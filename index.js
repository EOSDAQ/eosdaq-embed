var iframeDomain = 'http://eosdaq.test:3000';

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
const iframe = document.getElementById('eosdaq').contentWindow;

function Eosdaq(scatter) {
  this.scatter = scatter;

  var ___messageToEosdaq = (action, payload) => {
    var message = {
      action: action,
      payload: payload || '',
    };
  
    iframe.postMessage(JSON.stringify(message), iframeDomain);
  }

  this.login = (payload) => {
    __messageToEosdaq('getIdentity', payload);
  };

  this.logout = () => {
    __messageToEosdaq('forgetIdentity');
  };

  this.transfer = (data) => {
    this.scatter.eos.transaction(data).then(() => {
      ___messageToEosdaq('transferResult', {
        success: true,
      });
    }).catch((err) => {
      ___messageToEosdaq('transferResult', {
        success: true,
        err: err
      });
    })
  }

  function onMessage(e) {
    if (e.origin !== iframeDomain) {
      return;
    }
    
    var data = e.data;
    if (data.action === 'transfer') {
      this.transfer(JSON.parse(data));
    }
  }

  window.addEventListener('message', onMessage);
  
  this.destory = function() {
    window.removeEventListener('message', onMessage);
  }
}

window.eosdaq = new Eosdaq(window.scatter);

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
