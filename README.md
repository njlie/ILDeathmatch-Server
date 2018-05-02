# ILDeathmatch-Server
An API for monetizing ILDeathmatch

ILDeathmatch uses [dm-web-monetization](https://github.com/njlie/dm-web-monetization) for payments over the [Interledger](https://interledger.org/).

## Running the Server

### Prerequisites:
- [Moneyd](https://github.com/interledgerjs/moneyd-xrp)
- [ILDeathmatch](https://github.com/njlie/ILDeathmatch)

To start, make sure an instance of [moneyd](https://github.com/interledgerjs/moneyd-xrp) is running on your machine. This daemon will allow the server to make payments.

Then run the following commands:
```
npm install
node index.js
```

The server will now be listening on http://localhost:8080. To start using it for Quake, follow the instructions at [ILDeathmatch](https://github.com/njlie/ILDeathmatch) to launch a Quake server instance that uses this API.

## Connecting as a Client

### Prerequisites
- [Minute](https://github.com/interledgerjs/minute)
- [An ILP-SPSP Receiver](https://medium.com/interledger-blog/spsp-simple-payment-setup-protocol-2028292e6925)

In order for a client to connect to your server and start earning/losing money on ILDeathmatch, they'll first need to install the [Minute extenstion](https://github.com/interledgerjs/minute), which allows streaming of payment to the server for spawning, and set up an [ILP-SPSP receiver](https://medium.com/interledger-blog/spsp-simple-payment-setup-protocol-2028292e6925), which will allow the receiving of payment for kills. The section "Receiving an SPSP Payment" is the most relevant section for connecting to ILDeathmatch.

### How it works

Upon loading to the ILDeathmatch-Server homepage, a client will begin streaming payments to the server through Minute. This payment stream adds to a balance associated with the client that is spent when the client connects to the game, and each time they die. The site will ask for the client's SPSP receiver, and upon receiving it will first ping it to make sure it's live, then send the client into the game. ILDeathmatch-Server will send payments to this receiver each time the client kills other players on the Quake server.
