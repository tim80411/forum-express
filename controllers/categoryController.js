const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        console.log(categories)
        return res.render('admin/categories', { categories })
      })
  }
}

module.exports = categoryController