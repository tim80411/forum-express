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

  postCategory: (req, res, cb) => {
    const { categoryName } = req.body

    if (!categoryName) {
      return cb({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.create({ name: categoryName })
        .then(() => {
          return cb({ status: 'success', message: 'category was successfully created' })
        })
    }

  },
}

module.exports = categoryService