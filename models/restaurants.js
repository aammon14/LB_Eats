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
        "Bearer mzhNKmiI-vh0HpTj_Pg7TleB36FxRV5Xi-dOFfLZRTZ3ks05RToTxYZwDgLE6j49MXn1_FQrqqAFZIi8zidLewq_BgwppPgzvAyYzrnEwD97normnbviPfqn5TxrWnYx"
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
        "Bearer mzhNKmiI-vh0HpTj_Pg7TleB36FxRV5Xi-dOFfLZRTZ3ks05RToTxYZwDgLE6j49MXn1_FQrqqAFZIi8zidLewq_BgwppPgzvAyYzrnEwD97normnbviPfqn5TxrWnYx"
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
        "Bearer mzhNKmiI-vh0HpTj_Pg7TleB36FxRV5Xi-dOFfLZRTZ3ks05RToTxYZwDgLE6j49MXn1_FQrqqAFZIi8zidLewq_BgwppPgzvAyYzrnEwD97normnbviPfqn5TxrWnYx"
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


module.exports = restaurantModel;
