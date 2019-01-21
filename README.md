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

const eosdaq = new Eosdaq(
  'eosdaq', // id of div for iframe to be rendered.
  'https://eosdaq.com/embed/ATD', // Src url of embed iframe.
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

## How to construct iframe src url.

Rule for src url is **eosdaq domain** + **tokens**(connected with '-')

```javascript
const tokens = [
  'ATD',
  'KEOS',
  'IQ',
];

const src = `https://eosdaq.com/embed/${tokens.join('-')}`
// https://eosdaq.com/embed/ATD-KEOS-IQ
```

## IMPORTANT
When you call `eosdaq.login`, you have to pass scatter filled with identity property.
Thus the flow is like this.
1. `scatter.connect(YOUR_APP_NAME)`
2. `scatter.getIdentity(...)`
3. `eosdaq.login(scatter, eos)`
