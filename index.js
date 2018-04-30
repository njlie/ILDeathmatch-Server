const Koa = require('Koa')
const KoaWebSocket = require('koa-websocket')
const app = new Koa()
const socket = KoaWebSocket(app)

const router = require('koa-router')()
const ws = require('koa-router')()
const WebMonetizationDM = require('./WebMonetizationDM')
const monetization = new WebMonetizationDM()
const fs = require('fs-extra')
const path = require('path')

ws.get('/', (ctx) => {
  ctx.websocket.send('test')
  const ipMsg = 'IP: ' + ctx.websocket._socket.remoteAddress
  ctx.websocket.send(ipMsg)
  console.log('New connection on: ', ctx.websocket._socket.remoteAddress, ':', ctx.websocket._socket.remotePort)
  
  ctx.websocket.on('message', (message) => {
    console.log(message)
    ctx.websocket.send('response')
  })
  // console.log(app.ws.server.clients)

})


ws.get('/server', (ctx) => {
  ctx.websocket.send('server connected')
  console.log(ctx.websocket.clients)
  ctx.websocket.on('message', (message) => {
    console.log(message)
  })
})

router.get('/pay/:id', monetization.receiver())

// for player spawn
router.get('/game/spawn/:id', monetization.spawnPlayer({price: 100}), async ctx => {
  console.log('spawning')
  const id = ctx.params.id
  console.log('Player ', id, ' spawned in for 100 drops.')
  ctx.body = id
})

// For player disconnect.
router.get('/game/disconnect/:id', async ctx => {
  ctx.body = 'Player ' + ctx.params.id + 'disconnected.'
})

// For when a player gets a kill
router.get('/game/kill/:id', monetization.payPlayer(100), async ctx => {
  ctx.set('content-type', 'text/html')
  ctx.body = 'Player ' + ctx.params.id + ' paid for kill.'
})

// For when a player gets killed
router.get('/game/killed/:id', monetization.spawnPlayer({price: 100}), async ctx => {
  ctx.body = 'Player ' + ctx.params.id + ' killed, deducting from balance.'
})

router.get('/', async ctx => {
  ctx.set('content-type', 'text/html')
  ctx.body = fs.readFileSync(path.resolve(__dirname, 'index.html'))
})

router.post('/addpointer', monetization.addPointer(), async ctx => {
  ctx.body = 'Paid to spsp pointer.'
})

router.get('/clientDm.js', async ctx => {
  ctx.body = await fs.readFile(path.resolve(__dirname, 'clientDm.js'))
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.ws
  .use(ws.routes())
  .use(ws.allowedMethods())

app.listen(8080)
console.log('listening on 8080')
