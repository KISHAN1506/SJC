function setSiteLocals(req, res, next) {
  res.locals.siteName = 'Shree Jagdamba Creation';
  res.locals.siteAddress = 'F-Block, 4756-57, Raghukul Textile Market, Surat, Gujarat - 395002, India';
  res.locals.siteEmail = 'rohitfashion2020@gmail.com';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.activePage = req.path === '/' ? 'home' : req.path.replace(/\//g, '') || 'home';
  res.locals.currUser = req.user || null;
  next();
}

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/admin?error=login');
  }

  next();
}

function notFound(req, res) {
  res.status(404).render('pages/not-found', {
    pageTitle: 'Page Not Found',
    activePage: '',
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).render('pages/error', {
    pageTitle: 'Error',
    activePage: '',
    errorMessage: message,
  });
}

module.exports = {
  setSiteLocals,
  isLoggedIn,
  notFound,
  errorHandler,
};
