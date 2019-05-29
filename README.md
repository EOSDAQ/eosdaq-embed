# @eosdaq/embed

## Installation
```
  npm install @eosdaq/embed
  yarn add @eosdaq/embed
```

## Usage 1. (Using Scatter wallet)

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
    tokens: ['PTI_EOS', 'ARN_EOS'], // Token list that will be traded. An Empty array will show all tokens.
    initialToken: 'KEOS_EOS', // Default selected token.
    theme: 'dark' // Optional. Only 'light' and 'dark' are available.
    locale: 'en' // Optional. 'en', 'cn', 'hk' and 'ko' are available.
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
    eosdaq.login({
      identity: ScatterJS.identity,
      origin: 'some.com', // Optional. Your origin to add on memo
      eos,
    });
  })
```

### IMPORTANT
When you call `eosdaq.login`, you have to pass scatter filled with identity property.
Thus the flow is like this.
1. `ScatterJS.scatter.connect(YOUR_APP_NAME)`
2. `ScatterJS.login(...)`
3. `eosdaq.login({ identity: ScatterJs.identity, eos, origin })`

## Usage 2. (For non Scatter wallet)
Process is almost identical to usage 1, except `eosdaq.login` payload.

```javascript
  eosdaq.login({
    identity: {
      accounts: [{
        authority: 'active', // eg. 'active', 'owner'
        name: 'xxxxxxxxxxxx12', // Account name
        publickey: 'EOS7M4sXLVtqSDYT8SaGXyqyBASFYaEaqAoucZuB7RaBghv2Bd111',  // Account`s public key
      }],
    },
    origin: 'some.com', // Optional. Your origin to add on memo
    eos,
    transactionCb: async (tx) => {
      // Call your transaction function here
      const result = await eos.transaction(tx);
      return result;
    },
  });
```