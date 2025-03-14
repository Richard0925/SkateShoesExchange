import express from 'express';
import { verifyJWT } from '../utils/token.js';

const router = express.Router();

/**
 * Get User Profile by Username
 * GET /api/users/profile/:username
 */
router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Get user data
        const [users] = await req.sequelize.query(`
            SELECT 
                u.id, u.username, u.email, u.is_active, u.created_at,
                p.location, p.preferred_foot, p.shoe_size,
                COUNT(DISTINCT l.id) as listings_count
            FROM users u
            LEFT JOIN user_profiles p ON u.id = p.user_id
            LEFT JOIN listings l ON u.id = l.user_id
            WHERE u.username = ?
            GROUP BY u.id, p.id
        `, {
            replacements: [username]
        });

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Return user data
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isActive: user.is_active,
                preferredFoot: user.preferred_foot,
                shoeSize: user.shoe_size,
                location: user.location,
                createdAt: user.created_at,
                listingsCount: parseInt(user.listings_count) || 0,
                transactionsCount: 0,
                rating: 0
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
});

export default router; 