class Eosdaq {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.childProcess;
    this.iframe;
    this.renderEosdaq();
  }

  renderEosdaq() {
    const div = document.getElementById(this.container);
    this.iframe = document.createElement('iframe');
    this.childProcess = this.iframe.contentWindow;
    iframe.src = `http://eosdaq.test:3000/embed/IQ_SYS`;

    div.appendChild(this.iframe)
  }

  sendMessage(action, payload) {
    this.childProcess.postMessage({
      action,
      payload,
    }, 'http://eosdaq.test:3000')
  }

  login(scatter, eos) {
    this.scatter = scatter;
    this.eos = eos;
    this.sendMessage('getIdentity', scatter.identity);
  }

  logout() {
    this.scatter = null;
    this.eos = null;
    this.sendMessage('forgetIdentity');
  }

  async transaction(tx) {
    await this.eos.transaction(tx)
  }
}

export default Eosdaq;
