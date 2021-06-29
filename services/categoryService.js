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

  putCategory: (req, res, cb) => {
    const { categoryName } = req.body
    const id = req.params.id

    if (!categoryName) {
      return cb({ status: 'error', message: "name didn't exist" })
    }

    return Category.findByPk(id)
      .then(category => {
        category.update({
          name: categoryName
        })
      })
      .then(() => {
        return cb({ status: 'success', message: 'category was successfully updated' })      
      })
      .catch(error => {
        return cb({ status: 'error', message: 'update process got wrong' })
      })
  },

  deleteCategory: (req, res, cb) => {
    const id = req.params.id

    return Category.findByPk(id)
      .then(category => {
        return category.destroy()
      })
      .then(() => {
        return cb({ status: 'success', message: 'category was successfully deleted' })
      })
      .catch(error => {
        return cb({ status: 'error', message: 'delete process got wrong' })
      })
  }
}

module.exports = categoryService