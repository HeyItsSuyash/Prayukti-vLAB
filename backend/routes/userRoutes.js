const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser, updateUser, sendMailToUser } = require('../controllers/userController');

// In a real app, these should have admin authentication middleware
// e.g., router.use(protect, adminMiddleware)

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .delete(deleteUser)
    .put(updateUser);

router.post('/send-email', sendMailToUser);

module.exports = router;
