# Siva Prasad Reddy - Online Donation Management System

A full-stack, responsive web application for managing online charity donations with real-time MySQL Workbench integration.

**Developer:** Siva Prasad Reddy  
**Database:** MySQL (`online_donation`)  
**Backend:** Node.js, Express.js  
**Frontend:** HTML5, CSS3, JavaScript (Fetch API)  

---

## 🌟 6 HTML Pages Overview

1. **`index.html` (Home Page)** - Hero banner, live donation counters from MySQL, featured causes, and recent donor feed.
2. **`campaigns.html` (Active Campaigns)** - Browse fundraising initiatives, live progress bars, category filters, and search.
3. **`donate.html` (Make a Donation)** - Online donation portal saving to MySQL `donations` table with instant downloadable receipt popup.
4. **`add-campaign.html` (Create Campaign)** - Admin/Fundraiser form to insert new causes into MySQL `campaigns` table with live preview.
5. **`users.html` (Donors & Users)** - Register and manage donors, volunteers, and admins in MySQL `users` table.
6. **`about.html` (About & Contact)** - Founder story, MySQL database architecture details, live health test, and contact form.

---

## 🗄️ MySQL Database Tables

Database Name: `online_donation`

1. **`users`**:
   - `user_id` (INT PK AUTO_INCREMENT)
   - `name` (VARCHAR(100))
   - `email` (VARCHAR(100) UNIQUE)
   - `password` (VARCHAR(255))
   - `phone` (VARCHAR(15))
   - `role` (VARCHAR(30))

2. **`campaigns`**:
   - `campaign_id` (INT PK AUTO_INCREMENT)
   - `title` (VARCHAR(45))
   - `target_amount` (VARCHAR(45))
   - `start_date` (VARCHAR(45))
   - `end_date` (VARCHAR(45))
   - `status` (VARCHAR(45))

3. **`donations`**:
   - `donation_id` (INT PK AUTO_INCREMENT)
   - `user_id` (INT FK -> users.user_id)
   - `campaign_id` (INT FK -> campaigns.campaign_id)
   - `amount` (DECIMAL(10,2))
   - `donation_date` (DATETIME)
   - `payment_status` (VARCHAR(30))
   - `transaction_id` (VARCHAR(100) UNIQUE)

---

## 🚀 How to Run the Project

1. **Open Terminal / Command Prompt** in the project folder:
   ```bash
   cd "blood bank management system"
   ```

2. **Install Dependencies** (if running on a new computer):
   ```bash
   npm install
   ```

3. **Configure MySQL Database**:
   - Open MySQL Workbench.
   - Run the included `database_schema.sql` script to create database and tables.
   - Ensure `.env` has your MySQL password:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=root
     DB_NAME=online_donation
     DB_PORT=3306
     ```

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Open in Browser**:
   Visit [http://localhost:5000](http://localhost:5000)
