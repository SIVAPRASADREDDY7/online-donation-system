const pool = require('./db');

async function runSeed() {
  try {
    const [[{ userCount }]] = await pool.query('SELECT COUNT(*) AS userCount FROM users');
    console.log('Current users count:', userCount);
    if (userCount === 0) {
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
        ['Priya Patel', 'priya.patel@gmail.com', 'Priya@123', '9988776655', 'Donor']
      );

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

      await pool.query(
        'INSERT INTO donations (user_id, campaign_id, amount, donation_date, payment_status, transaction_id) VALUES (?, ?, ?, NOW(), ?, ?), (?, ?, ?, NOW(), ?, ?), (?, ?, ?, NOW(), ?, ?)',
        [
          u2.insertId, c1.insertId, 5000.00, 'Completed', 'TXN-SPR-1001',
          u3.insertId, c2.insertId, 7500.00, 'Completed', 'TXN-SPR-1002',
          u4.insertId, c3.insertId, 3000.00, 'Completed', 'TXN-SPR-1003'
        ]
      );
      console.log('✅ Success: Demo data inserted into MySQL database online_donation!');
    } else {
      console.log('Database already has records.');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    process.exit(0);
  }
}

runSeed();
