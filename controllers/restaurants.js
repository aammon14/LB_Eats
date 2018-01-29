const router = require("express").Router();

const restaurantModel = require("../models/restaurants.js");

router.get("/", restaurantModel.allRestaurants, (req, res, next) => {
  // res.json(res.locals.allRestaurantsData);
  res.render("restaurants", { allRestaurantsData: res.locals.allRestaurantsData.businesses });
});

router.get("/:restaurantId", restaurantModel.restaurantById, (req, res) => {
  res.render('restaurant', {restaurant: res.locals.restaurantData});
});


module.exports = router;