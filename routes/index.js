const express = require('express');
const {
  homePage,
  collectionsPage,
  productPage,
  aboutPage,
  contactPage,
  submitEnquiry,
} = require('../controllers/pageController');

const router = express.Router();

router.get('/', homePage);
router.get('/collections', collectionsPage);
router.get('/products/:id', productPage);
router.get('/about', aboutPage);
router.get('/contact', contactPage);
router.post('/enquiries', submitEnquiry);

module.exports = router;
