-- ===================================================================
-- Siva Prasad Reddy - Online Donation Management System
-- MySQL Workbench Database Schema & Setup Script
-- ===================================================================

CREATE DATABASE IF NOT EXISTS online_donation;
USE online_donation;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  role VARCHAR(30) DEFAULT 'Donor',
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Table: campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  campaign_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  target_amount VARCHAR(45) NOT NULL,
  start_date VARCHAR(45) NOT NULL,
  end_date VARCHAR(45) NOT NULL,
  status VARCHAR(45) DEFAULT 'Active',
  PRIMARY KEY (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Table: donations
CREATE TABLE IF NOT EXISTS donations (
  donation_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  campaign_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  payment_status VARCHAR(30) DEFAULT 'Completed',
  transaction_id VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (donation_id),
  UNIQUE KEY transaction_id (transaction_id),
  KEY user_id (user_id),
  KEY campaign_id (campaign_id),
  CONSTRAINT donations_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT donations_ibfk_2 FOREIGN KEY (campaign_id) REFERENCES campaigns (campaign_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample Seed Data
INSERT IGNORE INTO users (user_id, name, email, password, phone, role) VALUES
(1, 'Siva Prasad Reddy', 'sivaprasadreddy@donation.org', 'Admin@2026', '9876543210', 'Admin'),
(2, 'Ramesh Kumar', 'ramesh.kumar@gmail.com', 'Ramesh@123', '9848012345', 'Donor'),
(3, 'Ananya Sharma', 'ananya.sharma@yahoo.com', 'Ananya@123', '9700123456', 'Donor'),
(4, 'Priya Patel', 'priya.patel@gmail.com', 'Priya@123', '9988776655', 'Donor');

INSERT IGNORE INTO campaigns (campaign_id, title, target_amount, start_date, end_date, status) VALUES
(1, 'Medical Care for Orphan Children', '50000', '2026-11-01', '2026-12-31', 'Active'),
(2, 'Rural Digital School Education', '75000', '2026-11-05', '2027-01-15', 'Active'),
(3, 'Emergency Daily Food Relief', '30000', '2026-10-15', '2026-11-30', 'Active'),
(4, 'Clean Drinking Water Initiative', '40000', '2026-11-01', '2026-12-25', 'Active');

INSERT IGNORE INTO donations (donation_id, user_id, campaign_id, amount, donation_date, payment_status, transaction_id) VALUES
(1, 2, 1, 5000.00, NOW(), 'Completed', 'TXN-SPR-1001'),
(2, 3, 2, 7500.00, NOW(), 'Completed', 'TXN-SPR-1002'),
(3, 4, 3, 3000.00, NOW(), 'Completed', 'TXN-SPR-1003');
