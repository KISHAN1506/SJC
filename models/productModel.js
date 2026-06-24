const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    url: String,
    filename: String,
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    fabric: {
      type: String,
      required: true,
      trim: true,
    },
    occasion: {
      type: String,
      required: true,
      trim: true,
    },
    moq: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: imageSchema,
      required: true,
    },
    gallery: {
      type: [imageSchema],
      default: undefined,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

function buildQuery() {
  return mongoose.model('Product').find().populate('owner', 'username email fullName');
}

function getAllProducts() {
  return buildQuery().sort({ createdAt: -1 });
}

function getProductsByOwner(ownerId) {
  return mongoose.model('Product').find({ owner: ownerId }).sort({ createdAt: -1 }).populate('owner', 'username email fullName');
}

function getProductById(id) {
  return mongoose.model('Product').findById(id).populate('owner', 'username email fullName');
}

function getFeaturedProducts(limit = 6) {
  return mongoose.model('Product').find({ $or: [{ featured: true }, { bestseller: true }] }).sort({ createdAt: -1 }).limit(limit);
}

async function getCategories() {
  return mongoose.model('Product').distinct('category').sort();
}

async function createProduct(payload) {
  const Product = mongoose.model('Product');
  const product = new Product(payload);
  await product.save();
  return product;
}

async function updateProduct(id, payload) {
  const Product = mongoose.model('Product');
  const updated = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return updated;
}

async function deleteProduct(id) {
  const Product = mongoose.model('Product');
  const deleted = await Product.findByIdAndDelete(id);
  return Boolean(deleted);
}

mongoose.model('Product', productSchema);

module.exports = {
  getAllProducts,
  getProductsByOwner,
  getProductById,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
