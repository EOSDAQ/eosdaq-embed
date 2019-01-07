# @eosdaq/embed

## Installation
```
  npm install @eosdaq/core
  yarn add @eosdaq/core
```

## Usage

```javascript
import Eosdaq from '@eosdaq/embed';
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const network = { ... }; // https://get-scatter.com/docs/networks

const eosdaq = new Eosdaq(
  'eosdaq', // id of div for iframe to be rendered.
  {}, // extra config. currently it is empty object.
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

## IMPORTANT
When you call `eosdaq.login`, you have to pass scatter filled with identity property.
Thus the flow is like this.
1. `scatter.connect(YOUR_APP_NAME)`
2. `scatter.getIdentity(...)`
3. `eosdaq.login(scatter, eos)`
