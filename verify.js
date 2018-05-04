const jwt = require('jsonwebtoken')
const config = require('./config.json')

exports.verifyJWT = function () {
  return async (ctx, next) => {
    const token = ctx.request.body.jwt

    try {
      jwt.verify(token, config.JWT_SECRET)
      return next()
    } catch (err) {
      console.log(err)
      ctx.throw(400, 'Bad JWT token')
    }
  }
}