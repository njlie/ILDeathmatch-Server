function getMonetizationId (receiverUrl, clientId) {
  return new Promise((resolve, reject) => {
    var id = clientId
    var receiver = receiverUrl.replace(/:id/, id)

    if (window.monetize) {
      window.monetize({
        receiver
      })
      resolve(id)
    } else {
      console.log('Your extension is disabled or not installed.')
      reject(new Error('web monetization is not enabled'))
    }
  })
}

// function addPaymentPointer (clientId, address) {
//   fetch('http://localhost:8080')
// }

window.onload = function () {
  console.log('ready')
  const socket = new WebSocket('ws://localhost:8080')

  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!')
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      const ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(':', '-')
      getMonetizationId('http://localhost:8080/pay/:id', ip)
      document.getElementById('submit').removeAttribute('disabled')
    }
  })
}
