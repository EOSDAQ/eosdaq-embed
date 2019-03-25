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
      origin: '',
      theme: '',
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
    this.validOrigin = {};
    window.addEventListener('message', this.onMessage);
  }

  buildSrcUrl() {
    const {
      targetUrl, initialToken, theme,
    } = this.config;
    let tokens = this.splitTokens();
    let themeQuery;

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

    if (theme) {
      themeQuery = `&theme=${theme}`;
    }

    const firstToken = initialToken || tokens[0];
    if (!firstToken) {
      throw Error('expect initialToken');
    }
    return `${targetUrl}/embed/${firstToken}?tokenList=${tokens.join('-')}${themeQuery}`;
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
    const { data, ports } = e;
    if (data.action === 'transaction') {
      this.transaction(data.payload, ports);
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
      for (const oldFrame of oldies) {
        div.removeChild(oldFrame);
      }
    }

    this.iframe = document.createElement('iframe');
    this.iframe.src = embedSource;
    this.iframe.frameBorder = 0;

    div.appendChild(this.iframe);
    this.childProcess = this.iframe.contentWindow;
  }

  sendMessage(action, payload, ports) {
    const message = {
      action,
      payload,
    };

    if (ports && ports[0]) {
      ports[0].postMessage(message);
      return;
    }

    this.childProcess.postMessage(message, this.config.targetUrl);
  }

  onLoad() {
    this.isLoaded = true;
    if (this.queue.length > 0) {
      const work = this.queue.pop();
      work();
    }
  }

  async login({ identity, eos, origin }) {
    if (identity) {
      this.identity = identity;
      if (eos) {
        this.eos = eos;
      }
      if (this.isLoaded) {
        this.sendMessage('getIdentity', identity);
      } else {
        this.queue.push(this.sendMessage.bind(this, 'getIdentity', identity));
      }
    }
    if (origin) {
      this.config.origin = origin;
    }
    await this.buildValidOrigin();
    this.validateOrigin(this.config.tokens);
  }

  logout() {
    this.identity = null;
    this.eos = null;
    this.sendMessage('forgetIdentity');
  }

  async buildValidOrigin() {
    const keys = Object.keys(this.validOrigin);
    if (keys.length > 0) {
      return;
    }

    const { eos } = this;
    if (!eos) {
      throw Error('eos is not initialized');
    }

    const { rows } = await this.eos.getTableRows({
      code: 'eosdaqmarket',
      scope: 'eosdaqmarket',
      table: 'stfee',
      json: true,
      limit: -1,
    });

    rows.forEach((row) => {
      const { basefee, quotefee, origin } = row;
      const symbol = quotefee.replace(/[0-9. ]/g, '');
      const base = basefee.replace(/[0-9. ]/g, '');
      if (!symbol) {
        return;
      }
      const pair = `${symbol}_${base}`;
      if (!this.validOrigin[pair]) {
        this.validOrigin[pair] = {};
      }
      this.validOrigin[pair][origin] = true;
    });
  }

  validateOrigin(tokens) {
    const { origin } = this.config;
    if (!origin || !tokens) {
      return;
    }
    tokens = !tokens.length ? [tokens] : tokens;
    tokens.forEach((token) => {
      if (!this.validOrigin[token] || !this.validOrigin[token][origin]) {
        throw Error(`Your origin(${origin}) is not registered. Use a right origin or send email to contact@eosdaq.com to regist`);
      }
    });
  }

  setOriginOnMemo(action) {
    if (!this.config.origin) {
      return;
    }
    try {
      const memo = JSON.parse(action.data.memo);
      memo.origin = this.config.origin;
      const memoKeys = Object.keys(memo);
      const { length } = memoKeys;
      action.data.memo = `{ ${memoKeys.map((key, index) => `"${key}": "${memo[key]}"${index !== length - 1 ? ', ' : ''}`).join('')} }`;
    } catch (e) {
      return action;
    }
  }

  async transaction(tx, ports) {
    let payload;
    try {
      for (const action of tx.actions) {
        this.setOriginOnMemo(action);
      }

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
        error: error.toString(),
      }
    }
    const action = 'transactionResult';
    this.sendMessage(action, payload, ports);
  }

  destroy() {
    window.removeEventListener('message', this.onMessage);
    this.isLoaded = false;
  }
}

export default Eosdaq;
