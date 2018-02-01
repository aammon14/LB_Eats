//Authorization methods and middleware are based on the example we were given in class
const User = require('../models/user');
const router = require('express').Router();
const passport = require('passport');

const restaurantsModel = require("../models/restaurants");
const auth = require('../services/auth');

// ----------------------------------------
// users index
router.get ('/', (req, res, next) => {
    res.redirect('users/profile')
})

router.post(
    '/',
    // we want the behavior of the site to vary depending on whether or
    // not the user is already logged in. If they are logged in, we want
    // to send them to /users/profile. If they are not, we want to send
    // them to users/new.
    passport.authenticate(
        // The following string indicates the particular strategy instance
        // we'll want to use to handle signup. We defined behavior for
        // 'local-signup' back in index.js.
        'local-signup', {
            failureRedirect: '/users/new',
            successRedirect: '/users/profile'
        }
    )
);

// ----------------------------------------
// register new user
router.get('/new', (req, res) => {
    res.render('users/new');
});
// ----------------------------------------
// user logout
router.get('/logout', (req, res) => {
    // passport put this method on req for us
    req.logout();
    // redirect back to index page
    res.redirect('/');
});
// ----------------------------------------
// user login
router.get('/login', (req, res) => {
    res.render('users/login');
});
// passport.authenticate will _build_ middleware for us
// based on the 'local-login' strategy we registered with
// passport in auth.js
router.post('/login', passport.authenticate(
    'local-login', {
        failureRedirect: '/users/login',
        successRedirect: '/users/profile'
    }
));

// ----------------------------------------
// user profile

router.get(
    '/profile',
    // Middleware (that we wrote) ensuring that if the user is not
    // authenticated, he or she will be redirected to the login screen.
    auth.restrict,
    User.findByEmailMiddleware,
    (req, res) => {
        console.log('in handler for users/profile');
        console.log('req.user:');
        console.log(req.user);
        res.render('users/profile', { user: res.locals.userData });
    }
);

router.post('/profile',
    auth.restrict,
    restaurantsModel.addUserFav, 
    (req, res, next) => {
        res.render('users/profile', { userFavData: res.locals.userFavData });
});

router.get(
    '/favorites',
    auth.restrict,
    User.findUserFav,
    (req, res) => {
        res.render('users/favorites', {favData: res.locals.favData});
});

router.put(
    "/favorites",
    auth.restrict,
    restaurantsModel.updateRating,
    (req, res, next) => {
        res.send({ updatedRating: res.locals.updatedRating });
    }
);

router.delete(
    "/favorites/",
    auth.restrict,
    restaurantsModel.destroy,
    (req, res, next) => {
        // not a lot to send back
        res.json({});
    }
);

module.exports = router;