/**
 * config {
 *  container: 'eosdaq' (Id of div)
 *  src: 'https://eosdaq.com/embed/
 * 
 * 
 * }
 */

class Eosdaq {
  constructor(container, src) {
    this.src = src;
    this.container = container;
    this.childProcess;
    this.iframe;
    this.queue = [];
    this.isLoaded = false;

    this.renderEosdaq();
    this.onMessage = this.onMessage.bind(this);
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

    if (data.action === 'ready') {
      this.onLoad();
    }
  }

  guardConfig(configKey) {
    if (this[configKey]) {
      return this[configKey];
    }

    throw Error(`${configKey} is not found in config`);
  }

  renderEosdaq() {
    const { container, src } = this;

    const div = document.getElementById(container);
    const oldies = div.getElementsByTagName('iframe');
    if (oldies && oldies.length > 0) {
      for (let oldFrame of oldies) {
        div.removeChild(oldFrame);
      }
    }

    this.iframe = document.createElement('iframe');
    this.iframe.src = src;
    this.iframe.frameBorder = 0;

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
    if (!scatter.identity) {
      throw new Error('Cannot login with null identity. Use scatter.getIdentity first');
    }
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
    const action = 'transactionResult';
    let payload;

    try {
      const result = await this.eos.transaction(tx);
      payload = {
        success: true,
        data: result,
        error: null,
      };
    } catch (error) {
      payload = {
        success: false,
        data: null,
        error,
      }
    }

    this.sendMessage(action, payload);
  }
  
  destroy() {
    window.removeEventListener('message', onMessage);
    this.isLoaded = false;
  }
}

export default Eosdaq;
