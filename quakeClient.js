var ip = false
var baseUrl = new URL(window.location)

window.addEventListener('load', function () {
  console.log('ready')
  const quake = document.getElementById('quake-game')
  const socket = new WebSocket(`ws://${baseUrl.host}`)

  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!')
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(/\./g, '-').replace(/[^0-9\-]/g, '')
      console.log(ip)
      getMonetizationId(`http://${baseUrl.host}/pay/:id`, ip)
    }
  })
})
