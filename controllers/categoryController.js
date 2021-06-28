const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    const { categoryName } = req.body

    if (categoryName) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({ name: categoryName })
        .then(() => {
          return res.redirect('/admin/categories')
        })
    }

  },

  editCategory: (req, res) => {
    const id = req.params.id

    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return Category.findByPk(id)
          .then(category => {
            category = category.toJSON()

            return res.render('admin/categories', { category, categories })
          })
      })
  },

  putCategory: (req, res) => {
    const { categoryName } = req.body
    const id = req.params.id

    return Category.findByPk(id)
      .then(category => {
        category.update({
          name: categoryName
        })
      })
      .then(() => {
        return res.redirect('/admin/categories')
      })
  },

  deleteCategory: (req, res) => {
    const id = req.params.id

    return Category.findByPk(id)
      .then(category => {
        return category.destroy()
      })
      .then(() => {
        return res.redirect('/admin/categories')
      })
  }
}

module.exports = categoryController