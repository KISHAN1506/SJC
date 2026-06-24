const { getAllCertificates, createCertificate, getCertificateById, deleteCertificate, updateCertificate } = require('../models/certificateModel');

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
    const isSessionVerified = req.session && req.session.certificateAdminVerified;

    if (!isSessionVerified) {
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
    const deleteSuccess = req.query.deleted === 'true';
    const updateSuccess = req.query.updated === 'true';
    const adminPassword = req.session.certificateAuthPassword || '';

    // IMMEDIATELY CLEAR THE SESSION VERIFICATION (locks page on refresh/next request)
    req.session.certificateAdminVerified = false;
    req.session.certificateAuthPassword = null;

    res.render('pages/certificate', {
      pageTitle: 'Internship Certificate Portal',
      activePage: 'certificate',
      certificates,
      selectedId,
      uploadSuccess,
      deleteSuccess,
      updateSuccess,
      adminPassword,
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
      req.session.certificateAuthPassword = password;
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
    // Authorize using the submitted password token
    const adminPasswordInput = req.body.adminPassword;
    const adminPassword = process.env.ADMIN_PASSWORD || 'sjc2026';
    if (adminPasswordInput !== adminPassword) {
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

    // Set temporary session verified flags for the redirect rendering
    req.session.certificateAdminVerified = true;
    req.session.certificateAuthPassword = adminPassword;

    res.redirect(`/certificate?success=true&id=${newCertificate._id}`);
  } catch (error) {
    next(error);
  }
}

async function destroyCertificate(req, res, next) {
  try {
    // Authorize using the submitted password token
    const adminPasswordInput = req.body.adminPassword;
    const adminPassword = process.env.ADMIN_PASSWORD || 'sjc2026';
    if (adminPasswordInput !== adminPassword) {
      return res.status(403).send('Unauthorized. You must be authenticated to delete certificates.');
    }

    const { id } = req.params;
    const { cloudinary } = require('../cloudConfig');
    const cert = await getCertificateById(id);

    if (cert) {
      if (cert.image && cert.image.filename) {
        try {
          await cloudinary.uploader.destroy(cert.image.filename);
        } catch (cloudinaryErr) {
          console.error('Failed to delete image from Cloudinary:', cloudinaryErr);
        }
      }
      await deleteCertificate(id);
    }

    // Set temporary session verified flags for the redirect rendering
    req.session.certificateAdminVerified = true;
    req.session.certificateAuthPassword = adminPassword;

    res.redirect('/certificate?deleted=true');
  } catch (error) {
    next(error);
  }
}

async function updateCertificateController(req, res, next) {
  try {
    // Authorize using the submitted password token
    const adminPasswordInput = req.body.adminPassword;
    const adminPassword = process.env.ADMIN_PASSWORD || 'sjc2026';
    if (adminPasswordInput !== adminPassword) {
      return res.status(403).send('Unauthorized. You must be authenticated to edit certificates.');
    }

    const { id } = req.params;
    const { studentName, collegeName } = req.body;
    if (!studentName || !studentName.trim() || !collegeName || !collegeName.trim()) {
      throw new Error('Student name and college name are required.');
    }

    const updateData = {
      studentName: studentName.trim(),
      collegeName: collegeName.trim(),
    };

    // If a new image file is uploaded, replace the old one
    if (req.file) {
      const { cloudinary } = require('../cloudConfig');
      const cert = await getCertificateById(id);
      if (cert && cert.image && cert.image.filename) {
        try {
          await cloudinary.uploader.destroy(cert.image.filename);
        } catch (cloudinaryErr) {
          console.error('Failed to delete old image from Cloudinary:', cloudinaryErr);
        }
      }

      updateData.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await updateCertificate(id, updateData);

    // Set temporary session verified flags for the redirect rendering
    req.session.certificateAdminVerified = true;
    req.session.certificateAuthPassword = adminPassword;

    res.redirect('/certificate?updated=true');
  } catch (error) {
    next(error);
  }
}

function handleCertificateLogout(req, res) {
  if (req.session) {
    req.session.certificateAdminVerified = false;
  }
  res.redirect('/certificate');
}

module.exports = {
  renderCertificatePage,
  handleCertificateAuth,
  handleCertificateUpload,
  destroyCertificate,
  updateCertificateController,
  handleCertificateLogout,
};
