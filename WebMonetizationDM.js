const WebMonetization = require('koa-web-monetization')

class WebMonetizationDM extends WebMonetization {
  constructor() {
    super()
  }

  spawnPlayer({price}) {
    return async (ctx, next) => {
      const id = ctx.params.id
      if (!id) {
        return ctx.throw(400, 'ctx.params.id must be defined')
      }

      const _price = (typeof price === 'function')
        ? Number(price(ctx))
        : Number(price)
    }

    // await this.awaitBalance(id, _price)
    return next()
  }

  payPlayer (amount) {
    return async (ctx, next) => {
      console.log('it worked')
      const id = ctx.params.id
      const payer = ctx.params.payer
      const balance = this.buckets.get(id) || -1
      const payerBalance = this.buckets.get(payer) || -1
      if (balance === -1) {
        return 'Player is not on server'
      }
      if (payerBalance === -1) {
        // victim has not bought in, so you get nothing.
        return 'Payer is not on server'
      }

      this.buckets.set(id, balance + amount)
      console.log('player=', id, ' total=', balance+amount)

      return next()
    }
  }

  async cashOut (id, paymentPointer) {
    // TODO: Pay player based on bucket value and payment pointer
  }
}

const wm = new WebMonetizationDM

wm.payPlayer()

module.exports = WebMonetizationDM