const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const {
  renderAdminPage,
  renderEditPage,
  create,
  update,
  destroy,
} = require('../controllers/adminController');

// Middleware to automatically log in the default admin user on the server for all admin routes.
// This matches the client-side password design and satisfies product schema requirements for a user owner _id.
router.use(async (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    const User = require('../models/user');
    try {
      const adminUser = await User.findOne({ username: 'admin' });
      if (adminUser) {
        req.login(adminUser, (err) => {
          if (err) return next(err);
          next();
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

router.get('/', renderAdminPage);
router.get('/products/:id/edit', renderEditPage);
router.post('/products', upload.single('imageFile'), create);
router.put('/products/:id', upload.single('imageFile'), update);
router.delete('/products/:id', destroy);

module.exports = router;
