if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const { setSiteLocals, notFound, errorHandler } = require('./middleware');
const siteRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

require('./config/passport');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15mb' }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'shree-jagdamba-creation',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(setSiteLocals);

app.use('/', siteRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('connected');

    // Ensure default admin user exists
    const User = require('./models/user');
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
        adminUser = new User({
            username: 'admin',
            email: 'admin@shreejagdambacreation.com',
            fullName: 'Admin User'
        });
        await User.register(adminUser, 'sjc2026');
        console.log('Default admin user registered.');
    }



    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Shree Jagdamba Creation running on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.log(err);
});
