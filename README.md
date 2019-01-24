# @eosdaq/embed

## Installation
```
  npm install @eosdaq/embed
  yarn add @eosdaq/embed
```

## Usage

```javascript
import Eosdaq from '@eosdaq/embed';
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const network = { ... }; // https://get-scatter.com/docs/networks
const network1 = ScatterJS.Network.fromJson(network1); 

const eosdaq = new Eosdaq(
  'eosdaq', // id of div for iframe to be rendered.
  {
    targetUrl: 'https://eosdaq.com', // Target url to load eosdaq embedding page
    tokens: ['KEOS_EOS', 'TPT_EOS'], // Token list that will be traded 
    initialToken: 'KEOS_EOS', // Default selected token.
  }
);

ScatterJS.plugins(new ScatterEOS())
ScatterJS.scatter.connect('EOSDAQ', { network: network1 })
  .then(c => {
    if (!c) {
      console.log('Failed to connect');
      return;
    }

    const eos = ScatterJS.scatter.eos(network, Eos, {});
    eosdaq.login(ScatterJS.identity, eos);
  })
```

## IMPORTANT
When you call `eosdaq.login`, you have to pass scatter filled with identity property.
Thus the flow is like this.
1. `ScatterJS.scatter.connect(YOUR_APP_NAME)`
2. `ScatterJS.login(...)`
3. `eosdaq.login(ScatterJs.identity, eos)`
