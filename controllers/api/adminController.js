const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    return adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    return adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    return adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res) => {
    return adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController