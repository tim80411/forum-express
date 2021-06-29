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
    return categoryService.postCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }

      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
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
    return categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }

      req.flash('success_messages', data.message)
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