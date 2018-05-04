var id = false
var baseUrl = new URL(window.location)

window.addEventListener('load', function () {
  console.log('ready')
  id = document.cookie.split(';').filter(e => e.includes('monetizeId'))[0].split('=')[1] || false
  const socket = new WebSocket(`ws://${baseUrl.host}`)

  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ msg: 'Quake Client Socket connected.' }))
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      getMonetizationId(`http://${baseUrl.host}/pay/:id`, id)
    }
  })
  
  var oldLog = console.log
  console.log = function (message) {
    if (message.includes('--ILDM_CONNECT') && message.indexOf('console_tell') === 0) {
      const index = message.split(' ')[2]
      socket.send(JSON.stringify({ msg: message, index: index, monetizeId: ip }))
    }
    message = 'TOKEN: ' + message
    oldLog.apply(console, arguments)
  }
})
