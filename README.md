# Shree Jagdamba Creation

A professional, light-mode wholesale B2B website for an Indian ethnic wear brand focused on sarees and related ethnic wear.

## Overview

This project is built with:

- HTML
# Shree Jagdamba Creation

A professional wholesale B2B saree website built in Express MVC format for an Indian ethnic wear brand.

## Overview

This project uses:

- Node.js
- Express
- EJS with `ejs-mate`
- Bootstrap 5
- JSON file storage for products and enquiries

It is designed for wholesale enquiries rather than direct online checkout. Product actions use **Enquire Now** and **WhatsApp** instead of add-to-cart flows.

## MVC Structure

```text
/Users/kishanagarwal/Documents/ShreeJagdambaCreation Project
├── app.js
├── package.json
├── README.md
├── controllers/
├── routes/
├── models/
├── views/
│   ├── layouts/
│   ├── includes/
│   └── pages/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── data/
├── init/
└── utils/
```

## Features

- Light-mode UI with cream, gold, and maroon accents
- Bootstrap 5 layout and components
- Home page with hero, categories, product highlights, and enquiry CTA
- Collections page with category filters
- Product detail page with gallery and WhatsApp enquiry actions
- About page for brand story and heritage
- Contact page with bulk enquiry form
- Admin panel for product CRUD
- JSON-backed product and enquiry persistence

## Routes

- `/` Home
- `/collections` Catalogue
- `/products/:id` Product detail
- `/about` About
- `/contact` Contact and enquiry form
- `/admin` Admin dashboard
- `/admin/products` Create product
- `/admin/products/:id` Update or delete product

## Data Storage

- `data/products.json` stores catalogue items
- `data/enquiries.json` stores enquiry submissions

## Default Admin Login

The current client-side/admin password is:

- `sjc2026`

## Running the App

1. Install dependencies if needed: `npm install`
2. Start the server: `npm start`
3. Open `http://localhost:3000`

## Customization

Update these values in the model and controller files as needed:

- WhatsApp number
- Phone number
- Email address
- Business address
- GST number
- Admin password

## Notes

- This project is B2B only and does not include add-to-cart or checkout flows.
- Product images currently use placeholder SVG assets and can be replaced with real brand assets in `public/images`.
- If you want a database-backed version later, the JSON storage layer can be replaced with MongoDB or SQL without changing the page structure.
