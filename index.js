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
const iframe = document.getElementById('eosdaq').contentWindow;

function Eosdaq() {
  // this.scatter = window.ScatterJS.scatter;
  var that = this;

  var sendMessage = (action, payload) => {
    var message = {
      action: action,
      payload: payload || '',
    };
  
    iframe.postMessage(message, iframeDomain);
  }


  this.getScatter = () => {
    return this.scatter;
  }

  this.login = (scatter, eos) => {
    this.scatter = scatter;
    this.eos = eos;
    console.log(scatter);
    sendMessage('getIdentity', scatter.identity);
  };

  this.logout = () => {
    this.scatter = null;
    this.eos = null;
    sendMessage('forgetIdentity');
  };

  this.transaction = (transaction) => {
    this.eos.transaction(transaction).then((result) => {
      sendMessage('transactionResult', {
        success: true,
        result,
      });
    }).catch((err) => {
      sendMessage('transactionResult', {
        success: false,
        result: err,
      });
    })
  }

  function onMessage(e) {
    if (e.origin !== iframeDomain) {
      return;
    }

    var data = e.data;
    if (data.action === 'transaction') {
      that.transaction(data.payload);
    }
  }

  window.addEventListener('message', onMessage);
  
  this.destory = function() {
    window.removeEventListener('message', onMessage);
  }
}

const eosdaq = new Eosdaq();

signin.onmousedown = async (e) => {
  e.preventDefault()
  ScatterJS.plugins(new ScatterEOS());
  ScatterJS.scatter.connect('Persian Pink')
    .then(async () => {
      await ScatterJS.scatter.getIdentity({
        accounts: [network]
      })
      const eos = ScatterJS.scatter.eos(network, Eos, {});
      eosdaq.login(ScatterJS.scatter, eos)
    })

  // iframe.postMessage({
  //   action: 'getIdentity',
  //   payload,
  // }, 'http://eosdaq.test:3000')
}

signout.onmousedown = (e) => {
  e.preventDefault()
  ScatterJS.scatter.forgetIdentity()
  eosdaq.logout()
}
