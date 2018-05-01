const baseUrl = '10.20.25.168'
var ip = false

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

document.getElementById('payment-pointer').addEventListener('submit', event => {
  event.preventDefault()
  addPaymentPointer()
})

function addPaymentPointer () {
  document.getElementById('pointer-form').append('Adding Pointer...')
  const pointer = document.getElementById('payment-pointer').value
  console.log('id: ', ip)
  console.log('pointer: ', pointer)
  fetch(`http://${baseUrl}:8080/addpointer/${ip}/${pointer}`)
  document.getElementById('pointer-form').append('Pointer Added!')
}

window.onload = function () {
  console.log('ready')
  const socket = new WebSocket(`ws://${baseUrl}:8080`)

  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!')
  })

  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
    if (event.data.includes('IP: ')) {
      const ipData = event.data.split('IP:').map(e => e.trim())[1]
      ip = ipData === '::1' ? '127-0-0-1' : ipData.replace(/\./g, '-').replace(/[^0-9\-]/g, '')
      console.log(ip)
      getMonetizationId(`http://${baseUrl}:8080/pay/:id`, ip)
      document.getElementById('submit').removeAttribute('disabled')
    }
  })
}
