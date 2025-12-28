const joi = require("joi");

const listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().required().min(0),
    country: joi.string().required(),
    location: joi.string().required(),
     category: joi.string()
      .valid(
        "Trending",
        "Rooms",
        "Iconic City",
        "Mountains",
        "Castles",
        "Swimming Pool",
        "Camping",
        "Farm",
        "Arctic"
      )
      .required()
  }).required(),
});

const reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required(),
    comment: joi.string().required(),
  }).required(),
});

module.exports = { listingSchema, reviewSchema };
