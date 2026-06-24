const { getFeaturedProducts, getCategories, getAllProducts, getProductById } = require('../models/productModel');
const { saveEnquiry } = require('../models/enquiryModel');

async function homePage(req, res, next) {
  try {
    const featuredProducts = await getFeaturedProducts(6);
    const categories = await getCategories();

    res.render('pages/home', {
      pageTitle: 'Home',
      activePage: 'home',
      featuredProducts,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function collectionsPage(req, res, next) {
  try {
    const category = req.query.category || 'All';
    const allProducts = await getAllProducts();
    const categories = ['All', ...(await getCategories())];
    const products = category === 'All'
      ? allProducts
      : allProducts.filter((product) => product.category === category);

    res.render('pages/collections', {
      pageTitle: 'Collections',
      activePage: 'collections',
      categories,
      products,
      selectedCategory: category,
    });
  } catch (error) {
    next(error);
  }
}

async function productPage(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).render('pages/not-found', {
        pageTitle: 'Product Not Found',
        activePage: '',
      });
    }

    const relatedProducts = (await getAllProducts())
      .filter((item) => item.id.toString() !== product.id.toString() && (item.category === product.category || item.fabric === product.fabric))
      .slice(0, 3);

    res.render('pages/product', {
      pageTitle: product.name,
      activePage: 'collections',
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
}

function aboutPage(req, res) {
  res.render('pages/about', {
    pageTitle: 'About',
    activePage: 'about',
  });
}

function contactPage(req, res) {
  const product = req.query.product || '';
  res.render('pages/contact', {
    pageTitle: 'Contact',
    activePage: 'contact',
    product,
    submitted: req.query.submitted === '1',
  });
}

async function submitEnquiry(req, res, next) {
  try {
    await saveEnquiry(req.body);
    res.redirect('/contact?submitted=1');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  homePage,
  collectionsPage,
  productPage,
  aboutPage,
  contactPage,
  submitEnquiry,
};
