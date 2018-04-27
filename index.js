const Koa = require('Koa')
const app = new Koa()

const router = require('koa-router')()
const WebMonetizationDM = require('./WebMonetizationDM')
const monetization = new WebMonetizationDM()
const fs = require('fs-extra')
const path = require('path')

router.get('/pay/:id', monetization.receiver())

// for player spawn
router.get('/game/spawn/:id', monetization.paid({price: 100, awaitBalance: true}), async ctx => {

})

// For player disconnect.
router.get('/game/disconnect/:id', async ctx => {
  ctx.body = 'Player ' + ctx.params.id + 'disconnected.'
})

router.get('/game/kill/:id/:payer', monetization.payPlayer(100), async ctx => {
  ctx.body = 'Player ' + ctx.params.id + ' paid by' + ctx.params.payer + ' for kill.'
})

router.get('/', async ctx => {
  ctx.set('content-type', 'text/html')
  ctx.body = fs.readFileSync(path.resolve(__dirname, 'index.html')
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080)

console.log('listening on 8080')
