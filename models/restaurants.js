const db = require("../db/index.js");
const axios = require("axios");

const restaurantModel = {};

// Helper function for seeding the restaurant data
function restaurantsNameSeedStep(restaurantsData) {
  restaurantsData.forEach(restaurants => {
    db
      .none("INSERT INTO restaurants (name) VALUES ($1);", [restaurants.name])
      .catch(err => {
        console.log(
          "Error encounted in restaurantsNameSeedStep pgpromise call, error:",
          err
        );
      });
  });
  if (restaurantsData.next) {
    axios({
      method: "get",
      url: restaurantsData.next
    })
      .then(response => {
        // recursively call restaurantNameSeedStep
        restaurantsNameSeedStep(response.data);
      })
      .catch(err => {
        console.log(
          "Error encountered in axios call in restaurantsNameSeedStep, error:",
          err
        );
      });
  }
}

restaurantModel.seedAllRestaurantsNames = function() {
  axios({
    method: "get",
    url:
      "http://api.yelp.com/v3/businesses/search?term=food&location===LongBeach,ny&limit=50",
    headers:{
      Authorization:
        `Bearer ${process.env.Andrews_API_key}`
    }
  })
    .then(response => {
      restaurantsNameSeedStep(response.data.businesses);
    })
    .catch(err => {
      console.log(
        "Error encountered in restaurantModel.seedAllRestaurantNames:",
        err
      );
    })
};


restaurantModel.allRestaurants = (req, res, next) => {
  // db
  //   .manyOrNone("SELECT * FROM restaurants")
  axios({
    method: "get",
    url:
      "http://api.yelp.com/v3/businesses/search?term=food&location===LongBeach,ny&limit=50",
    headers: {
      Authorization:
        `Bearer ${process.env.Andrews_API_key}`
    }
  })
    .then(response => {
      console.log("then");
      res.locals.allRestaurantsData = response.data;
      next();
    })
    .catch(error => {
      console.log(
        "error encountered in restaurantModel.allRestaurants, error:",
        error
      );
      next();
    });
};

restaurantModel.restaurantById = (req, res, next) => {
  const id = req.params.restaurantId;
  axios({
    method: "get",
    url:
      `https://api.yelp.com/v3/businesses/${id}`,
    headers: {
      Authorization:
        `Bearer ${process.env.Andrews_API_key}`
    }
  })
      .then(response => {
        res.locals.restaurantData = response.data;
        next();
      })
      .catch(err => {
        console.log(
          "Error encountered in axios call in restaurantNameSeedStep, error:",
          err
        );
        next();
      });
}

restaurantModel.findFavoriteByUser = (req, res, next) => {
  db
    .manyOrNone("SELECT name FROM restaurants JOIN restaurants_users ON restaurants_users.restaurant_id = restaurants.id JOIN users ON users.id = restaurants_users.user_id WHERE user_id = $1;", [req.user.id])
    .then(result => {
      res.locals.userFavData = result;
      next();
    })
    .catch(err => {
      console.log("error encountered in restaurantModel.findFavoriteByUser, error:",
        err
      );
      next(err);
    });
}

restaurantModel.addUserFav = (req, res, next) => {
  const userId = req.user.id;
  const favName = req.body.name;
  db
    .one(
      "INSERT INTO restaurants_users (user_id, restaurant_name) VALUES ($1, $2) RETURNING id;",
      [userId, favName]
    )
    .then(result => {
      res.locals.userFavId = result.id;
      next();
    })
    .catch(err => {
      console.log(
        "Error encountered in restaurantModel.addUserFav. error:",
        err
      );
      next(err);
    });
};

restaurantModel.updateRating = (req, res, next) => {
  const rating = parseInt(req.body.rating);
  const userId = req.user.id;
  const name = req.body.name;
  console.log("this is req.body:", req.body);
  db
    .one("UPDATE restaurants_users SET current_rating = $1 WHERE user_id = $2 AND restaurant_name = $3 RETURNING id;",
      [rating, userId, name]
    ).then(data => {
      res.locals.updatedRating = data.id;
      next();
    })
    .catch(err => {
      console.log(
        "Error encountered in restaurantModel.updateRating. error:",
        err
      );
      next(err);
    });
}

restaurantModel.destroy = (req, res, next) => {
  const userId = req.body.id;
  const favName = req.body.name;
  db
    .none("DELETE FROM restaurants_users WHERE user_id = $1 AND restaurant_name = $2", [
      userId,
      favName
    ])
    .then(() => {
      next();
    })
    .catch(err => {
      console.log(
        "Error encountered in restaurantModel.destroy. error:",
        err
      );
      next(err);
    });
};

module.exports = restaurantModel;
