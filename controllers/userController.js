const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like

const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // TODO: 要能夠瀏覽其他人的user profile
  getUser: (req, res) => {
    const id = helpers.getUser(req).id
    let count = 0

    return User.findByPk(id)
      .then(user => {
        return Comment.findAndCountAll({
          where: {
            UserId: id
          },
          include: [
            Restaurant
          ],
          raw: true,
          nest: true
        }).then(comments => {
          count = comments.count
          user = user.toJSON()

          return res.render('user', {
            user,
            comments,
            count
          })
        })
      })
  },

  editUser: (req, res) => {
    const id = helpers.getUser(req).id

    return User.findByPk(id)
      .then(user => {
        user = user.toJSON()

        return res.render('editUser', { user })
      })
  },

  putUser: (req, res) => {
    const id = helpers.getUser(req).id
    const { name } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', '姓名不得為空')
      return res.redirect(`/users/${id}/edit`)
    }

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then(user => {
            return user.update({
              name,
              image: img ? img.data.link : user.img
            })
          })
          .then(user => {
            return res.redirect(`/users/${user.id}`)
          })
      })
    } else {
      return User.findByPk(id)
        .then(user => {
          return user.update({
            name,
            image: user.img
          })
        })
        .then(user => {
          return res.redirect(`/users/${user.id}`)
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))

      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

      return res.render('topUser', { users: users })
    })
  }
}

module.exports = userController