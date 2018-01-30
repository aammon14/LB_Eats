const bcrypt = require('bcryptjs');

const db = require('../db/index.js');

const userModelObject = {};

// Note that this is NOT middleware!
userModelObject.create = function create(user) {
    // This is where we obtain the hash of the user's password.
    const passwordDigest = bcrypt.hashSync(user.password, 10);
    // Generally we try to avoid passing promises around, but here 
    // LocalStrategy's interface means we can't just rely on next() 
    // to glide us to the next thing we want to do. So we'll return the callback.
    // To see how it's used, see passport.use('local-strategy', ...) in services/auth.js
    // Anyway, here we make an entry in the database for the new user. We set the counter to 0 initially.
    // We do NOT store the password in the database!
    // Instead we store the password digest, which is a salted hash of the password.
    // If someone grabs the password digest it won't tell them what the password is,
    // but we can use the password digest to verify if a submitted password is correct.
    // This is the magic of hashes.
    return db.oneOrNone(
        'INSERT INTO users (email, password_digest) VALUES ($1, $2) RETURNING *;', [user.email, passwordDigest]
    );
};


userModelObject.findByEmail = function findByEmail(email) {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1;', [email]);
};

userModelObject.findByEmailMiddleware = function findByEmailMiddleware(req, res, next) {
    console.log('in findByEmailMiddleware');
    const email = req.user.email;
    userModelObject
        .findByEmail(email)
        .then((userData) => {
            res.locals.userData = userData;
            next();
        }).catch(err => console.log('ERROR:', err));
};

userModelObject.addFavorite = function addFavorite(user_id, restaurant_id) {
    return db.one(
        'INSERT INTO restaurants_users (user_id, restaurant_id) VALUES (1, 2) RETURNING *;'
        // [user_id, restaurant_id]
    );
};

userModelObject.addFavoriteMiddleware = function addFavoriteMiddleware(req, res, next) {
    const user_id = req.body.user_id;
    const restaurant_id = req.body.restaurant_id;
    user
        .addFavorite(user_id, restaurant_id)
        .then(userData => {
            res.locals.userData = userData;
            next();
        })
        .catch(err => console.log('ERROR:', err));
};

userModelObject.findUserFav = function findUserFav(req, res, next) {
    const id = req.user.id;
    db
    .manyOrNone("SELECT * FROM restaurants_users WHERE user_id = $1", [
            id
        ])
        .then(result => {
            res.locals.favData = result;
            next();
        })
        .catch(err => {
            console.log(
                "Error encountered in userModelObject.findUserFav, error:",
                err
            );
            next(err);
        });
};


module.exports = userModelObject;