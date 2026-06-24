const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

function getAllCertificates() {
  return Certificate.find().sort({ createdAt: -1 });
}

function createCertificate(payload) {
  return Certificate.create(payload);
}

function getCertificateById(id) {
  return Certificate.findById(id);
}

function deleteCertificate(id) {
  return Certificate.findByIdAndDelete(id);
}

function updateCertificate(id, payload) {
  return Certificate.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
}

module.exports = {
  getAllCertificates,
  createCertificate,
  getCertificateById,
  deleteCertificate,
  updateCertificate,
};
