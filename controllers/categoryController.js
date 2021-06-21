const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render('admin/categories', { categories })
      })
  },

  postCategory: (req, res) => {
    const { categoryName } = req.body
    console.log('@@@@', categoryName)
    return Category.create({ name: categoryName })
      .then(() => {
        return res.redirect('/admin/categories')
      })
  }
}

module.exports = categoryController