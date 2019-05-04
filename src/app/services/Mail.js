const nodemailer = require('nodemailer')
const { host, port, secure, auth } = require('../../config/mail')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')

const trasporter = nodemailer.createTransport({ host, port, secure, auth })

const viewPath = path.resolve(__dirname, '..', 'views', 'emails')

trasporter.use(
  'compile',
  hbs({
    viewEngine: exphbs.create({
      partialsDir: path.resolve(viewPath, 'partials')
    }),
    viewPath,
    extName: '.hbs'
  })
)

module.exports = trasporter
