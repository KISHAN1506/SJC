const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });
const passport = require('passport');

const {
  renderAdminPage,
  renderEditPage,
  create,
  update,
  destroy,
} = require('../controllers/adminController');

const { login, logout } = require('../controllers/authController');
const { isLoggedIn } = require('../middleware');

// Route for login form submission
router.post('/login', (req, res, next) => {
  req.body.username = 'admin';
  next();
}, login);

// Route to logout
router.get('/logout', logout);

router.get('/', renderAdminPage);
router.get('/products/:id/edit', isLoggedIn, renderEditPage);
router.post('/products', isLoggedIn, upload.single('imageFile'), create);
router.put('/products/:id', isLoggedIn, upload.single('imageFile'), update);
router.delete('/products/:id', isLoggedIn, destroy);

module.exports = router;
