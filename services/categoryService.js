const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, cb) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return cb({ categories })
    })
  },
}

module.exports = categoryService