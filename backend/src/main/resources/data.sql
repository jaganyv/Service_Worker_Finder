-- Sample data for testing (optional)
-- This file is executed on application startup if spring.sql.init.mode=always

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using BCrypt
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES ('Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1234567890', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE email=email;

