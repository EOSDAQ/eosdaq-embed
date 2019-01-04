class Eosdaq {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.childProcess;
    this.iframe;
    this.queue = [];
    this.isLoaded = false;
    this.embedDomain = 'http://eosdaq.test:3000';
    this.embedSource = 'http://eosdaq.test:3000/embed/IQ_SYS';
    this.network = {
      blockchain: "eos",
      chainId: "8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b",
    };
    this.renderEosdaq();
    window.addEventListener('message', this.onMessage);
  }

  onMessage(e) {
    if (e.origin !== this.embedDomain) {
      return;
    }
    const { data } = e;
    if (data.action === 'transaction') {
      this.transaction(data.payload);
    }
  }

  renderEosdaq() {
    const div = document.getElementById(this.container);
    const oldies = div.getElementsByTagName('iframe');
    if (oldies && oldies.length > 0) {
      for (let oldFrame of oldies) {
        div.removeChild(oldFrame);
      }
    }
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.embedSource;
    this.iframe.onload = this.onLoad();
    div.appendChild(this.iframe);
    this.childProcess = this.iframe.contentWindow;
  }

  sendMessage(action, payload) {
    this.childProcess.postMessage({
      action,
      payload,
    }, this.embedDomain);
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
    scatter.getIdentity(this.config.network || this.network);
    await this.eos.transaction(tx)
  }
  
  destroy() {
    window.removeEventListener('message', onMessage);
    this.isLoaded = false;
  }
}

export default Eosdaq;
