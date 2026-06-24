const { createProduct, updateProduct, deleteProduct, getProductById, getProductsByOwner } = require('../models/productModel');

function toCloudinaryImage(file, fallback = null) {
  if (file) {
    return {
      url: file.path,
      filename: file.filename,
    };
  }

  return fallback;
}

async function renderAdminPage(req, res, next) {
  try {
    const loginError = req.query.error === 'login';
    const products = req.user ? await getProductsByOwner(req.user._id) : [];

    res.render('pages/admin', {
      pageTitle: 'Admin',
      activePage: 'admin',
      loginError,
      products,
      productToEdit: null,
    });
  } catch (error) {
    next(error);
  }
}

async function renderEditPage(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.redirect('/admin');
    }

    const products = req.user ? await getProductsByOwner(req.user._id) : [];
    res.render('pages/admin', {
      pageTitle: 'Admin',
      activePage: 'admin',
      loginError: false,
      products,
      productToEdit: product,
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    if (!req.file) {
      return res.redirect('/admin?error=login');
    }

    await createProduct({
      ...req.body,
      price: Number(req.body.price),
      image: toCloudinaryImage(req.file),
      gallery: [toCloudinaryImage(req.file)],
      owner: req.user._id,
      featured: req.body.featured === 'on' || req.body.featured === 'true',
      bestseller: req.body.bestseller === 'on' || req.body.bestseller === 'true',
    });

    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const existing = await getProductById(req.params.id);
    if (!existing) {
      return res.redirect('/admin');
    }

    const updatedImage = req.file ? toCloudinaryImage(req.file) : existing.image;
    await updateProduct(req.params.id, {
      ...req.body,
      price: Number(req.body.price),
      image: updatedImage,
      gallery: [updatedImage],
      owner: req.user._id,
      featured: req.body.featured === 'on' || req.body.featured === 'true',
      bestseller: req.body.bestseller === 'on' || req.body.bestseller === 'true',
    });

    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
}

async function destroy(req, res, next) {
  try {
    await deleteProduct(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderAdminPage,
  renderEditPage,
  create,
  update,
  destroy,
};
