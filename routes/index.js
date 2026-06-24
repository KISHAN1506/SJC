const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const {
  homePage,
  collectionsPage,
  productPage,
  aboutPage,
  contactPage,
  submitEnquiry,
} = require('../controllers/pageController');

const {
  renderCertificatePage,
  handleCertificateAuth,
  handleCertificateUpload,
  destroyCertificate,
  updateCertificateController,
} = require('../controllers/certificateController');

const router = express.Router();

router.get('/', homePage);
router.get('/collections', collectionsPage);
router.get('/products/:id', productPage);
router.get('/about', aboutPage);
router.get('/contact', contactPage);
router.post('/enquiries', submitEnquiry);

router.get('/certificate', renderCertificatePage);
router.post('/certificate/auth', handleCertificateAuth);
router.post('/certificate', upload.single('certificateFile'), handleCertificateUpload);
router.put('/certificate/:id', upload.single('certificateFile'), updateCertificateController);
router.delete('/certificate/:id', destroyCertificate);


module.exports = router;

