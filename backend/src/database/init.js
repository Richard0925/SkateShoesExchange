import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read SQL file
const sqlFilePath = path.join(__dirname, 'init.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

/**
 * Initialize database schema
 * @param {Sequelize} sequelize - Sequelize instance
 */
export async function initializeDatabase(sequelize) {
    try {
        console.log('Initializing database schema...');

        // Create tables in the correct order to handle dependencies

        // 1. Create base tables (no foreign keys)
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS shoe_sizes (
        id CHAR(36) PRIMARY KEY,
        size_us DECIMAL(3,1) NOT NULL,
        size_eu DECIMAL(3,1),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS condition_types (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Create tables with foreign keys to base tables
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        full_name VARCHAR(100),
        bio TEXT,
        location VARCHAR(100),
        avatar_url VARCHAR(255),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        brand_id CHAR(36) NOT NULL,
        model VARCHAR(100),
        size_id CHAR(36) NOT NULL,
        condition_id CHAR(36) NOT NULL,
        preferred_foot ENUM('left', 'right', 'both') NOT NULL,
        location VARCHAR(100),
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0.00,
        is_active BOOLEAN DEFAULT TRUE,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (brand_id) REFERENCES brands(id),
        FOREIGN KEY (size_id) REFERENCES shoe_sizes(id),
        FOREIGN KEY (condition_id) REFERENCES condition_types(id)
      );
    `);

        // 3. Create tables with foreign keys to listings
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS listing_images (
        id CHAR(36) PRIMARY KEY,
        listing_id CHAR(36) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        sequence INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exchange_requests (
        id CHAR(36) PRIMARY KEY,
        requester_id CHAR(36) NOT NULL,
        listing_id CHAR(36) NOT NULL,
        status ENUM('pending', 'accepted', 'rejected', 'completed', 'canceled') DEFAULT 'pending',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
      );
    `);

        // 4. Create tables with foreign keys to exchange_requests
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id CHAR(36) PRIMARY KEY,
        title VARCHAR(255),
        exchange_id CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (exchange_id) REFERENCES exchange_requests(id) ON DELETE SET NULL
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS exchange_history (
        id CHAR(36) PRIMARY KEY,
        exchange_id CHAR(36) NOT NULL,
        old_status ENUM('pending', 'accepted', 'rejected', 'completed', 'canceled'),
        new_status ENUM('pending', 'accepted', 'rejected', 'completed', 'canceled') NOT NULL,
        changed_by CHAR(36) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exchange_id) REFERENCES exchange_requests(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id)
      );
    `);

        // 5. Create tables with foreign keys to conversations
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id CHAR(36) PRIMARY KEY,
        conversation_id CHAR(36) NOT NULL,
        user_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_participation (conversation_id, user_id)
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id CHAR(36) PRIMARY KEY,
        conversation_id CHAR(36) NOT NULL,
        sender_id CHAR(36) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

        // 6. Create utility tables
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

        // 7. Add Django and Saleor compatibility fields
        // MySQL 8.0 doesn't support IF NOT EXISTS in ADD COLUMN
        // We need to check if columns exist first
        try {
            await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN django_id INT AUTO_INCREMENT UNIQUE,
        ADD COLUMN is_staff BOOLEAN DEFAULT FALSE,
        ADD COLUMN is_superuser BOOLEAN DEFAULT FALSE,
        ADD COLUMN date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN saleor_id VARCHAR(255) UNIQUE;
      `);
        } catch (error) {
            console.log('Django compatibility columns might already exist:', error.message);
        }

        try {
            await sequelize.query(`
        ALTER TABLE listings 
        ADD COLUMN saleor_product_id VARCHAR(255) UNIQUE;
      `);
        } catch (error) {
            console.log('Saleor compatibility columns might already exist:', error.message);
        }

        // 8. Create indexes
        // User related indexes
        try {
            await sequelize.query(`CREATE INDEX idx_users_username ON users(username);`);
            await sequelize.query(`CREATE INDEX idx_users_email ON users(email);`);
            await sequelize.query(`CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);`);

            // Listing related indexes
            await sequelize.query(`CREATE INDEX idx_listings_user_id ON listings(user_id);`);
            await sequelize.query(`CREATE INDEX idx_listings_brand_id ON listings(brand_id);`);
            await sequelize.query(`CREATE INDEX idx_listings_size_id ON listings(size_id);`);
            await sequelize.query(`CREATE INDEX idx_listings_condition_id ON listings(condition_id);`);
            await sequelize.query(`CREATE INDEX idx_listings_preferred_foot ON listings(preferred_foot);`);
            await sequelize.query(`CREATE INDEX idx_listings_created_at ON listings(created_at);`);
            await sequelize.query(`CREATE INDEX idx_listings_is_active ON listings(is_active);`);

            // Exchange request related indexes
            await sequelize.query(`CREATE INDEX idx_exchange_requests_requester_id ON exchange_requests(requester_id);`);
            await sequelize.query(`CREATE INDEX idx_exchange_requests_listing_id ON exchange_requests(listing_id);`);
            await sequelize.query(`CREATE INDEX idx_exchange_requests_status ON exchange_requests(status);`);

            // Message related indexes
            await sequelize.query(`CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);`);
            await sequelize.query(`CREATE INDEX idx_messages_sender_id ON messages(sender_id);`);
            await sequelize.query(`CREATE INDEX idx_messages_created_at ON messages(created_at);`);
            await sequelize.query(`CREATE INDEX idx_messages_is_read ON messages(is_read);`);
            await sequelize.query(`CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);`);
            await sequelize.query(`CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);`);
        } catch (error) {
            console.log('Some indexes might already exist:', error.message);
        }

        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database schema:', error);
        throw error;
    }
}

/**
 * Create database if it doesn't exist
 * @param {string} databaseUrl - Database connection URL
 */
export async function createDatabase(databaseUrl) {
    try {
        // Extract connection info from DATABASE_URL
        const dbUrl = new URL(databaseUrl);
        const host = dbUrl.hostname;
        const port = dbUrl.port;
        const user = dbUrl.username;
        const password = dbUrl.password;
        const database = dbUrl.pathname.substr(1);

        // Create connection without database selected
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
        console.log('Database checked/created successfully');
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
}

/**
 * Initialize database with sample data for development
 * @param {Sequelize} sequelize - Sequelize instance
 */
export async function seedSampleData(sequelize) {
    try {
        console.log('Seeding sample data...');

        // Check if users table is empty
        const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM users');

        if (userCount[0].count === 0) {
            // Generate UUID for IDs
            const userId = await sequelize.query("SELECT UUID() as id");
            const brandId = await sequelize.query("SELECT UUID() as id");
            const sizeId = await sequelize.query("SELECT UUID() as id");
            const conditionId = await sequelize.query("SELECT UUID() as id");

            // Insert sample user
            await sequelize.query(`
        INSERT INTO users (id, username, email, password_hash, is_active)
        VALUES ('${userId[0][0].id}', 'demo_user', 'demo@example.com', '$2a$10$JwYX5Z8IPF.2BncFqZwQWOzCL1ADM0xOmGP.kB.O9i8qVWgm5ik0a', true)
      `);

            // Insert sample brand
            await sequelize.query(`
        INSERT INTO brands (id, name, logo_url)
        VALUES ('${brandId[0][0].id}', 'Nike', 'https://example.com/nike-logo.png')
      `);

            // Insert sample shoe size
            await sequelize.query(`
        INSERT INTO shoe_sizes (id, size_us, size_eu)
        VALUES ('${sizeId[0][0].id}', 9.5, 43)
      `);

            // Insert sample condition type
            await sequelize.query(`
        INSERT INTO condition_types (id, name, description)
        VALUES ('${conditionId[0][0].id}', 'Like New', 'Worn only a few times, in excellent condition')
      `);

            console.log('Sample data seeded successfully');
        } else {
            console.log('Database already contains data, skipping seed');
        }
    } catch (error) {
        console.error('Failed to seed sample data:', error);
        // Don't throw error here, just log it
    }
} 