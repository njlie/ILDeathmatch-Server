const Koa = require('koa')
const KoaWebSocket = require('koa-websocket')
const app = new Koa()
const render = require('koa-ejs')
KoaWebSocket(app)

const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const ws = require('koa-router')()
const WebMonetizationDM = require('dm-web-monetization')
const monetization = new WebMonetizationDM()
const verify = require('./verify')
const EventEmitter = require('events')
class DMEmitter extends EventEmitter {}
const emitter = new DMEmitter()
const fs = require('fs-extra')
const path = require('path')

render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  layout: 'play',
  cache: false,
  debug: false
})

ws.get('/', (ctx) => {
  const ipMsg = 'IP: ' + ctx.websocket._socket.remoteAddress
  ctx.websocket.send(ipMsg)
  console.log('New connection on: ', ctx.websocket._socket.remoteAddress, ':', ctx.websocket._socket.remotePort)

  ctx.websocket.on('message', (message) => {
    console.log(message)
    const parse = JSON.parse(message)
    const msg = parse.msg || ''
    console.log('msg: ', msg)
    if (msg.includes('--ILDM_CONNECT')) {
      console.log('got message: --ILDM_CONNECT')
      emitter.emit('--ILDM_CONNECT_CLIENT', parse.index, parse.monetizeId)
    }
  })
})

ws.get('/server', (ctx) => {
  ctx.websocket.send(JSON.stringify({msg:'server connected'}))
  ctx.websocket.on('message', (message) => {
    console.log(message)
  })
  emitter.on('--ILDM_CONNECT_CLIENT', (quakeIndex, monetizeId) => {
    console.log('got event: --ILDM_CONNECT_CLIENT')
    console.log('quakeIndex: ', quakeIndex, ' monetizeId: ', monetizeId)
    ctx.websocket.send(JSON.stringify({msg: '--ILDM_CONNECT_CLIENT', index: quakeIndex, id: monetizeId}))
  })
})

router.get('/pay/:id', monetization.receiver())

// for player spawn
router.post('/game/spawn/:id', verify.verifyJWT(), monetization.spawnPlayer({price: 100}), async ctx => {
  const id = ctx.params.id
  console.log('Player ', id, ' spawned in for 100 drops.')
  ctx.body = id
})

// For player disconnect.
router.post('/game/disconnect/:id', verify.verifyJWT(), monetization.disconnectPlayer(), async ctx => {
  ctx.body = 'Player ' + ctx.params.id + 'disconnected.'
})

// For when a player gets a kill
router.post('/game/kill/:id', verify.verifyJWT(), monetization.payPlayer(100), async ctx => {
  ctx.body = 'Player ' + ctx.params.id + ' paid for kill.'
})

// For when a player gets killed
router.post('/game/killed/:id', verify.verifyJWT(), monetization.spawnPlayer({price: 100}), async ctx => {
  ctx.body = 'Player ' + ctx.params.id + ' killed, deducting from balance.'
})

router.get('/', async ctx => {
  ctx.set('content-type', 'text/html')
  ctx.body = fs.readFileSync(path.resolve(__dirname, 'index.html'))
})

router.get('/addpointer/:id/:pointer', monetization.addPointer(), async ctx => {
  ctx.body = 'Paid to spsp pointer.'
})

router.get('/clientDm.js', async ctx => {
  ctx.body = await fs.readFile(path.resolve(path.dirname(require.resolve('dm-web-monetization')), 'clientDm.js'))
})

router.get('/quakeClient.js', async ctx => {
  ctx.body = await fs.readFile(path.resolve(__dirname, 'quakeClient.js'))
})

router.get('/play', async ctx => {
  await ctx.render('play')
})

router.get('/css/game.css', async ctx => {
  ctx.set('Content-Type', 'text/css')
  ctx.body = await fs.readFile(path.resolve(__dirname, 'public/css/game.css'))
})

router.get('/quake/ioquake3.js', async ctx => {
  ctx.body = await fs.readFile(path.resolve(__dirname, 'public/quake/ioquake3.js'))
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.ws
  .use(ws.routes())
  .use(ws.allowedMethods())

app.listen(8080)
console.log('listening on 8080')
