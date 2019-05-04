const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Purchase = require('../models/Purchase')
const Queue = require('../services/Queue')
const { from } = require('../../config/mail')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.find({
      seller: req.userId
    })

    return res.json(purchases)
  }
  async store (req, res) {
    const { ad, content } = req.body
    const purchaseAd = await Ad.findById(ad).populate('author')

    if (purchaseAd.purchasedBy) {
      return res.status(400).json({ error: 'Ad not available for purchase' })
    }

    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content,
      from
    }).save()

    const purchase = await Purchase.create({
      content,
      ad,
      user: user._id,
      seller: purchaseAd.author._id
    })

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
