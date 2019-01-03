const network = {
  blockchain: "eos",
  chainId: "8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b",
  host: "nodeos.eosdaq.test",
  httpEndpoint: "http://nodeos.eosdaq.test:18888",
  port: "18888",
  protocol: "http"
}

const signin = document.getElementById('scatter-signin')
const signout = document.getElementById('scatter-signout')
const result = ScatterJS.scatter.connect('Persian Pink')
const iframe = document.getElementById('eosdaq').contentWindow

signin.onmousedown = async (e) => {
  e.preventDefault()
  const payload = await ScatterJS.scatter.getIdentity({
    accounts: [network]
  })

  iframe.postMessage({
    action: 'getIdentity',
    payload,
  }, 'http://eosdaq.test:3000')
}

signout.onmousedown = (e) => {
  e.preventDefault()
  ScatterJS.scatter.forgetIdentity()

  iframe.postMessage({
    action: 'forgetIdentity'
  })
}

// window.onmessage = (e) => {
//   e.origin === 'iframeDomain'
//   action: transfer

//   result = ScatterJS.scatter.eos.transfer(payload)
//   iframe.postMessage(result)
// }
