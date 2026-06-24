const { getAllCertificates, createCertificate, getCertificateById } = require('../models/certificateModel');

async function renderCertificatePage(req, res, next) {
  try {
    const selectedId = req.query.id || null;

    // Case 1: Direct verification link (anyone can view a specific certificate by ID)
    if (selectedId) {
      const certificate = await getCertificateById(selectedId);
      if (!certificate) {
        return res.status(404).render('pages/not-found', {
          pageTitle: 'Certificate Not Found',
          activePage: 'certificate',
        });
      }
      return res.render('pages/certificate-verify', {
        pageTitle: `Verify ${certificate.studentName}'s Certificate`,
        activePage: 'certificate',
        certificate,
      });
    }

    // Case 2: Accessing the main page to upload or view the database (requires authentication)
    const isPassportAdmin = req.isAuthenticated && req.isAuthenticated();
    const isSessionVerified = req.session && req.session.certificateAdminVerified;

    if (!isPassportAdmin && !isSessionVerified) {
      // Show password prompt
      return res.render('pages/certificate-login', {
        pageTitle: 'Verification Portal Login',
        activePage: 'certificate',
        error: req.query.error === 'auth',
      });
    }

    // Already verified admin - render full database & upload form
    const certificates = await getAllCertificates();
    const uploadSuccess = req.query.success === 'true';

    res.render('pages/certificate', {
      pageTitle: 'Internship Certificate Portal',
      activePage: 'certificate',
      certificates,
      selectedId,
      uploadSuccess,
    });
  } catch (error) {
    next(error);
  }
}

async function handleCertificateAuth(req, res, next) {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'sjc2026';

    if (password === adminPassword) {
      req.session.certificateAdminVerified = true;
      return res.redirect('/certificate');
    } else {
      return res.redirect('/certificate?error=auth');
    }
  } catch (error) {
    next(error);
  }
}

async function handleCertificateUpload(req, res, next) {
  try {
    // Authorize upload
    const isPassportAdmin = req.isAuthenticated && req.isAuthenticated();
    const isSessionVerified = req.session && req.session.certificateAdminVerified;
    if (!isPassportAdmin && !isSessionVerified) {
      return res.status(403).send('Unauthorized. You must be authenticated to upload certificates.');
    }

    if (!req.file) {
      throw new Error('Please upload an image file of the internship certificate.');
    }

    const { studentName, collegeName } = req.body;
    if (!studentName || !studentName.trim() || !collegeName || !collegeName.trim()) {
      throw new Error('Student name and college name are required.');
    }

    const certificateData = {
      studentName: studentName.trim(),
      collegeName: collegeName.trim(),
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
    };

    const newCertificate = await createCertificate(certificateData);
    res.redirect(`/certificate?success=true&id=${newCertificate._id}`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderCertificatePage,
  handleCertificateAuth,
  handleCertificateUpload,
};
