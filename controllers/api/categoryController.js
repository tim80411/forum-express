const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = categoryController