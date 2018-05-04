var ip = false
var id = false
var baseUrl = new URL(window.location)

window.addEventListener('load', function () {
  console.log('ready')
  // id = document.cookie.split(';').filter(e => e.includes('monetizeId'))[0].split('=')[1] || false
  const socket = new WebSocket(`ws://${baseUrl.host}`)

  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ msg: 'Quake Client Socket connected.' }))
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(/\./g, '-').replace(/[^0-9-]/g, '')
      console.log(ip)
      getMonetizationId(`http://${baseUrl.host}/pay/:id`, ip)
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
