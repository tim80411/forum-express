const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: Category })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))

        return res.render('restaurants', { restaurants: data })
      })
  },

  getRestaurant: (req, res) => {
    const id = req.params.id

    return Restaurant.findByPk(id, { include: Category })
      .then(restaurant => {
        return res.render('restaurnat', {
          restaurant: restaurant.toJSON()
        })
      })
  }
}

module.exports = restController