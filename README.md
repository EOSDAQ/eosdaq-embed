# @eosdaq/core

[![](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/@eosdaq/core)

```html
<body>
  <div id="eosdaq"></div>
  <script type="text/javascript" src="./index.js"></script>
</body>
```

```javascript
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const network = {
  blockchain: "eos",
  chainId: "8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b",
  host: "nodeos.eosdaq.test",
  httpEndpoint: "http://nodeos.eosdaq.test:18888",
  port: "18888",
  protocol: "http"
}

const eosdaq = new Eosdaq(
  'eosdaq',
  {},
);

ScatterJS.plugins(new ScatterEOS())
ScatterJS.scatter.connect('EOSDAQ')
  .then(c => {
    if (!c) {
      console.log('Failed to connect');
      return;
    }

    const eos = ScatterJS.scatter.eos(network, Eos, {});
    eosdaq.login(ScatterJS.scatter, eos);
  })
```