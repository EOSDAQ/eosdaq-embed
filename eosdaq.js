/**
 * config {
 *  container: 'eosdaq' (Id of div)
 *  src: 'https://eosdaq.com/embed/
 * }
 */

class Eosdaq {
  constructor(container, config) {
    const defaultConfig = {
      targetUrl: 'https://dev.eosdaq.com',
      tokens: [],
      initialToken: '',
    };

    this.container = container;
    this.config = Object.assign({}, defaultConfig, config);

    this.childProcess = null;
    this.iframe = null;
    this.queue = [];
    this.isLoaded = false;
    this.embedSource = this.buildSrcUrl();

    this.renderEosdaq();
    this.onMessage = this.onMessage.bind(this);
    window.addEventListener('message', this.onMessage);
  }

  buildSrcUrl() {
    const {
      targetUrl, initialToken,
    } = this.config;
    let tokens = this.splitTokens();
    const isEmptyTokens = (
      !tokens
      || tokens.length < 1
      || (tokens.length < 2 && !tokens[0])
    );

    if (initialToken) {
      if (isEmptyTokens) {
        tokens = [initialToken];
      }
    }

    const firstToken = initialToken || tokens[0];
    if (!firstToken) {
      throw Error('expect initialToken');
    }
    return `${targetUrl}/embed/${firstToken}?tokenList=${tokens.join('-')}`;
  }

  splitTokens() {
    const { tokens } = this.config;
    tokens.forEach((t) => {
      const divider = '_';
      if (t.indexOf(divider) < 0) {
        throw new Error('invalid token');
      }
      const bunch = t.split(divider);
      const symbol = bunch[0];
      const baseSymbol = bunch[1];
      if (!symbol || symbol.length < 1
        || !baseSymbol || baseSymbol.length < 1) {
        throw new Error('invalid token');
      }
    });
    return tokens;
  }

  onMessage(e) {
    if (e.origin !== this.config.targetUrl) {
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
    const { container, embedSource } = this;

    const div = document.getElementById(container);
    const oldies = div.getElementsByTagName('iframe');
    if (oldies && oldies.length > 0) {
      for (let oldFrame of oldies) {
        div.removeChild(oldFrame);
      }
    }

    this.iframe = document.createElement('iframe');
    this.iframe.src = embedSource;
    this.iframe.frameBorder = 0;

    div.appendChild(this.iframe);
    this.childProcess = this.iframe.contentWindow;
  }

  sendMessage(action, payload) {
    this.childProcess.postMessage({
      action,
      payload,
    }, this.config.targetUrl);
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
