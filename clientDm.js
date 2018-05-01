var ip = false
var baseUrl = new URL(window.location).host

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

function addPaymentPointer () {
  document.getElementById('pointer-form').append('Adding Pointer...')
  const pointer = document.getElementById('payment-pointer').value
  console.log('id: ', ip)
  console.log('pointer: ', pointer)
  fetch(`http://${baseUrl}/addpointer/${ip}/${pointer}`)
  document.getElementById('pointer-form').append('Pointer Added!')
}

window.onload = function () {
  console.log('ready')
  const quake = document.getElementById('quake-game')
  const socket = new WebSocket(`ws://${baseUrl}`)

  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!')
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(/\./g, '-').replace(/[^0-9\-]/g, '')
      console.log(ip)
      getMonetizationId(`http://${baseUrl}/pay/:id`, ip)
      document.getElementById('submit').removeAttribute('disabled')
    }
  })
}
