const WebMonetization = require('koa-web-monetization')
// const crypto = require('crypto')
const plugin = require('ilp-plugin')()
const SPSP = require('ilp-protocol-spsp')

class WebMonetizationDM extends WebMonetization {
  constructor() {
    super()

    this.pointers = new Map()
  }

  addPointer() {
    return async (ctx, next) => {
      console.log('adding spsp pointer')

      try {
        await SPSP.pay(plugin, {
          receiver: '$testdm.localtunnel.me',
          sourceAmount: '0'
        })

        console.log('paid!')
      } catch (e) {
        return ctx.throw(400, 'Payment pointer is not valid')
      }

      return next()

    }
  }

  spawnPlayer({price}) {
    return async (ctx, next) => {
      console.log('spawnplayer called')
      const id = ctx.params.id
      console.log('id: ', id)
      if (!id) {
        return ctx.throw(400, 'ctx.params.id must be defined')
      }

      const _price = (typeof price === 'function')
        ? Number(price(ctx))
        : Number(price)
    

      const hasBucket = this.buckets.get(id) || -1
      if (hasBucket === -1) {
        ctx.throw(400, 'Player is not on server')
      }

      try {
        this.spend(id, _price)
        return next()
      } catch (e) {
        return ctx.throw(402, e.message)
      }
      return next()
    }
  }

  payPlayer (price) {
    return async (ctx, next) => {
      console.log('it worked')
      const id = ctx.params.id
      const balance = this.buckets.get(id) || -1
      if (balance === -1) {
        console.log('Player is not on server')
        ctx.throw(400, 'Player is not on server')
      }

      this.buckets.set(id, balance + price)
      console.log('player=', id, ' oldAmount=', balance, ' newAmount=', balance + price)

      return next()
    }
  }

  disconnectPlayer (id) {
    return async (ctx, next) => {
      console.log('disconnecting player')
      const id = ctx.params.id
      const balance = this.buckets.get(id) || 0
      this.buckets.set(id, 0)
      // Generate a random id for payment pointer.
      // const newId =
    }
  }

  cashOut (id, paymentPointer) {
    // TODO: Pay player based on bucket value and payment pointer
  }
}

const wm = new WebMonetizationDM

wm.payPlayer()

module.exports = WebMonetizationDM