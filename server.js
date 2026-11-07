const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. HEALTH & DATABASE STATUS API
// ==========================================
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS test');
    res.json({
      status: 'success',
      database: 'MySQL Connected',
      db_name: process.env.DB_NAME || 'online_donation',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'MySQL Connection Error',
      error: error.message
    });
  }
});

// ==========================================
// 2. DASHBOARD / SUMMARY STATS API
// ==========================================
app.get('/api/stats', async (req, res) => {
  try {
    const [[donationsStat]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_raised, COUNT(*) AS total_donations FROM donations'
    );
    const [[campaignsStat]] = await pool.query(
      'SELECT COUNT(*) AS total_campaigns, SUM(CASE WHEN status = "Active" THEN 1 ELSE 0 END) AS active_campaigns FROM campaigns'
    );
    const [[usersStat]] = await pool.query(
      'SELECT COUNT(*) AS total_users FROM users'
    );

    res.json({
      success: true,
      data: {
        total_raised: parseFloat(donationsStat.total_raised || 0),
        total_donations: parseInt(donationsStat.total_donations || 0),
        total_campaigns: parseInt(campaignsStat.total_campaigns || 0),
        active_campaigns: parseInt(campaignsStat.active_campaigns || 0),
        total_users: parseInt(usersStat.total_users || 0)
      }
    });
  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. USERS APIs (table: users)
// ==========================================
// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.phone, u.role,
             COALESCE(COUNT(d.donation_id), 0) AS donation_count,
             COALESCE(SUM(d.amount), 0) AS total_donated
      FROM users u
      LEFT JOIN donations d ON u.user_id = d.user_id
      GROUP BY u.user_id
      ORDER BY u.user_id DESC
    `);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields.'
      });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const userPassword = password && password.trim() ? password.trim() : 'Password@123';
    const userRole = role && role.trim() ? role.trim() : 'Donor';

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), userPassword, phone.trim(), userRole]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully in MySQL database!',
      user_id: result.insertId,
      data: {
        user_id: result.insertId,
        name,
        email,
        phone,
        role: userRole
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Check if user has donations (foreign key check)
    const [donations] = await pool.query('SELECT donation_id FROM donations WHERE user_id = ?', [userId]);
    if (donations.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user #${userId} because they have ${donations.length} recorded donation(s). In MySQL, foreign key constraints protect donation history.`
      });
    }

    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User deleted successfully from MySQL.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. CAMPAIGNS APIs (table: campaigns)
// ==========================================
// GET all campaigns with raised amount
app.get('/api/campaigns', async (req, res) => {
  try {
    const [campaigns] = await pool.query(`
      SELECT c.campaign_id, c.title, c.target_amount, c.start_date, c.end_date, c.status,
             COALESCE(SUM(d.amount), 0) AS raised_amount,
             COUNT(d.donation_id) AS total_donations
      FROM campaigns c
      LEFT JOIN donations d ON c.campaign_id = d.campaign_id
      GROUP BY c.campaign_id
      ORDER BY c.campaign_id DESC
    `);

    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Fetch campaigns error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    let { title, target_amount, start_date, end_date, status } = req.body;

    if (!title || !target_amount || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, target amount, start date, and end date are required.'
      });
    }

    // Ensure title does not exceed 45 chars (VARCHAR(45) in schema)
    if (title.length > 45) {
      title = title.substring(0, 45);
    }

    const campaignStatus = status && status.trim() ? status.trim() : 'Active';

    const [result] = await pool.query(
      'INSERT INTO campaigns (title, target_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), target_amount.toString().trim(), start_date, end_date, campaignStatus]
    );

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully in MySQL Workbench!',
      campaign_id: result.insertId,
      data: {
        campaign_id: result.insertId,
        title,
        target_amount,
        start_date,
        end_date,
        status: campaignStatus
      }
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE campaign
app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const campaignId = req.params.id;
    // Check foreign keys in donations
    const [donations] = await pool.query('SELECT donation_id FROM donations WHERE campaign_id = ?', [campaignId]);
    if (donations.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete campaign #${campaignId} because it already has ${donations.length} recorded donation(s).`
      });
    }

    const [result] = await pool.query('DELETE FROM campaigns WHERE campaign_id = ?', [campaignId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    res.json({ success: true, message: 'Campaign deleted successfully from MySQL.' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. DONATIONS APIs (table: donations)
// ==========================================
// GET all donations with donor and campaign info
app.get('/api/donations', async (req, res) => {
  try {
    const [donations] = await pool.query(`
      SELECT d.donation_id, d.user_id, d.campaign_id, d.amount,
             DATE_FORMAT(d.donation_date, '%Y-%m-%d %H:%i:%s') AS donation_date,
             d.payment_status, d.transaction_id,
             u.name AS donor_name, u.email AS donor_email, u.phone AS donor_phone,
             c.title AS campaign_title
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.user_id
      LEFT JOIN campaigns c ON d.campaign_id = c.campaign_id
      ORDER BY d.donation_id DESC
    `);

    res.json({ success: true, data: donations });
  } catch (error) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new donation
app.post('/api/donations', async (req, res) => {
  try {
    let {
      user_id,
      campaign_id,
      amount,
      donor_name,
      donor_email,
      donor_phone,
      payment_status,
      transaction_id
    } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please specify a valid donation amount.' });
    }

    if (!campaign_id) {
      return res.status(400).json({ success: false, message: 'Please select a campaign.' });
    }

    // Verify campaign exists
    const [campaignRows] = await pool.query('SELECT campaign_id, title FROM campaigns WHERE campaign_id = ?', [campaign_id]);
    if (campaignRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected campaign does not exist in MySQL.' });
    }

    // Handle user_id resolution:
    // If user_id is provided, verify it exists.
    // If not provided or new donor details given, find or create the user in `users` table!
    let finalUserId = user_id ? parseInt(user_id, 10) : null;

    if (!finalUserId) {
      if (!donor_name || !donor_email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a registered user ID or donor name and email.'
        });
      }

      // Check if user already exists with this email
      const [existingUser] = await pool.query('SELECT user_id FROM users WHERE email = ?', [donor_email.trim()]);
      if (existingUser.length > 0) {
        finalUserId = existingUser[0].user_id;
      } else {
        // Auto-create new user in `users` table
        const [newUser] = await pool.query(
          'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
          [
            donor_name.trim(),
            donor_email.trim(),
            'Donor@123',
            (donor_phone || '9999999999').toString().trim(),
            'Donor'
          ]
        );
        finalUserId = newUser.insertId;
      }
    } else {
      // Verify given user_id exists
      const [userRows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [finalUserId]);
      if (userRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Provided user_id does not exist in MySQL.' });
      }
    }

    // Generate unique transaction ID if not provided
    const txnId = transaction_id && transaction_id.trim()
      ? transaction_id.trim()
      : `TXN-SPR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pStatus = payment_status && payment_status.trim() ? payment_status.trim() : 'Completed';

    const [result] = await pool.query(
      `INSERT INTO donations (user_id, campaign_id, amount, donation_date, payment_status, transaction_id)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [finalUserId, campaign_id, parseFloat(amount), pStatus, txnId]
    );

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully in MySQL database!',
      donation_id: result.insertId,
      transaction_id: txnId,
      data: {
        donation_id: result.insertId,
        user_id: finalUserId,
        campaign_id,
        campaign_title: campaignRows[0].title,
        amount: parseFloat(amount),
        payment_status: pStatus,
        transaction_id: txnId
      }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. INITIAL SEED DATA API (Demo setup)
// ==========================================
app.post('/api/seed', async (req, res) => {
  try {
    // Check if tables have records
    const [[{ userCount }]] = await pool.query('SELECT COUNT(*) AS userCount FROM users');
    const [[{ campCount }]] = await pool.query('SELECT COUNT(*) AS campCount FROM campaigns');

    if (userCount > 0 || campCount > 0) {
      return res.json({
        success: true,
        message: 'Database already contains data! No seeding needed.'
      });
    }

    // 1. Seed Users (Siva Prasad Reddy as Founder/Admin, plus Donors)
    const [u1] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Siva Prasad Reddy', 'sivaprasadreddy@donation.org', 'Admin@2026', '9876543210', 'Admin']
    );
    const [u2] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Ramesh Kumar', 'ramesh.kumar@gmail.com', 'Ramesh@123', '9848012345', 'Donor']
    );
    const [u3] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Ananya Sharma', 'ananya.sharma@yahoo.com', 'Ananya@123', '9700123456', 'Donor']
    );
    const [u4] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['Vikram Varma', 'vikram.varma@outlook.com', 'Vikram@123', '9988776655', 'Volunteer']
    );

    // 2. Seed Campaigns (Titles under 45 characters)
    const [c1] = await pool.query(
      'INSERT INTO campaigns (title, target_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      ['Medical Care for Orphan Children', '50000', '2026-11-01', '2026-12-31', 'Active']
    );
    const [c2] = await pool.query(
      'INSERT INTO campaigns (title, target_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      ['Rural Digital School Education', '75000', '2026-11-05', '2027-01-15', 'Active']
    );
    const [c3] = await pool.query(
      'INSERT INTO campaigns (title, target_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      ['Emergency Daily Food Relief', '30000', '2026-10-15', '2026-11-30', 'Active']
    );
    const [c4] = await pool.query(
      'INSERT INTO campaigns (title, target_amount, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      ['Clean Drinking Water Initiative', '40000', '2026-11-01', '2026-12-25', 'Active']
    );

    // 3. Seed Donations
    await pool.query(
      `INSERT INTO donations (user_id, campaign_id, amount, donation_date, payment_status, transaction_id) VALUES
       (?, ?, 5000.00, NOW(), 'Completed', 'TXN-SPR-SEED-1001'),
       (?, ?, 2500.00, NOW(), 'Completed', 'TXN-SPR-SEED-1002'),
       (?, ?, 10000.00, NOW(), 'Completed', 'TXN-SPR-SEED-1003')`,
      [u2.insertId, c1.insertId, u3.insertId, c2.insertId, u1.insertId, c3.insertId]
    );

    res.json({
      success: true,
      message: 'Sample demo data seeded successfully into MySQL Workbench!'
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Siva Prasad Reddy - Online Donation System`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`💾 Connected to MySQL: ${process.env.DB_NAME || 'online_donation'}`);
  console.log(`====================================================`);
});
