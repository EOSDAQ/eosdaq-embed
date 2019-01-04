class Eosdaq {
  static embedDomain = 'http://eosdaq.test:3000';
  static embedSource = 'http://eosdaq.test:3000/embed/IQ_SYS';  
  static network = {
    chainId: "8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b",
  };

  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.childProcess;
    this.iframe;
    this.onLoadQueue = [];
    this.isLoaded = false;
    this.renderEosdaq();
    window.addEventListener('message', this.onMessage);
  }

  onMessage(e) {
    if (e.origin !== embedDomain) {
      return;
    }
    const { data } = e;
    if (data.action === 'transaction') {
      this.transaction(data.payload);
    }
  }

  renderEosdaq() {
    const div = document.getElementById(this.container);
    this.iframe = document.createElement('iframe');    
    this.iframe.src = embedSource;
    this.iframe.onload = this.onLoad();
    div.appendChild(iframe);
    this.childProcess = iframe.contentWindow;
  }

  sendMessage(action, payload) {
    this.childProcess.postMessage({
      action,
      payload,
    }, embedDomain);
  }

  onLoad() {
    this.isLoaded = true;
    if (this.queue.length > 0) {
      const work = this.queue.pop();
      work();
    }
  }

  login(scatter, eos) {
    this.scatter = scatter;
    this.eos = eos;
    if (this.isLoaded) {
      this.sendMessage('getIdentity', scatter.identity);
    } else {
      this.queue.push(this.sendMessage.bind(this, 'getIdentity', scatter.identity));
    }
  }

  logout() {
    this.scatter = null;
    this.eos = null;
    this.sendMessage('forgetIdentity');
  }

  async transaction(tx) {    
    scatter.getIdentity(this.config.network || this.childProcess.network);
    await this.eos.transaction(tx)
  }
  
  destroy() {
    window.removeEventListener('message', onMessage);
    this.isLoaded = false;
  }
}

export default Eosdaq;
