# @eosdaq/embed

## Installation
```
  npm install @eosdaq/embed
  yarn add @eosdaq/embed
```

## Usage 

1. Initialize eosdaq module
```javascript
const eosdaq = new Eosdaq(
  'eosdaq', // id of div for iframe to be rendered.
  {
    targetUrl: 'https://eosdaq.com', // Target url to load eosdaq embedding page
    tokens: ['PTI_EOS', 'ARN_EOS'], // Token list that will be traded. An Empty array will show all tokens.
    initialToken: 'KEOS_EOS', // Default selected token.
    theme: 'dark', // Optional. Only 'light' and 'dark' are available.
    locale: 'en' // Optional. 'en', 'cn', 'hk' and 'ko' are available.
  }
);
```

2. Login and add callback function for transaction data
```javascript 
  eosdaq.login({
    identity: {
      accounts: [{
        authority: 'active', // eg. 'active', 'owner'
        name: 'xxxxxxxxxxxx12', // Account name
        publickey: 'EOS7M4sXLVtqSDYT8SaGXyqyBASFYaEaqAoucZuB7RaBghv2Bd111', // Account`s public key
      }],
    },
    origin: 'eosdaq.com', // Optional. Your origin to add on memo
    eos, // Optional.
    transactionCb: async (tx) => {
      // Call your transaction function here
      const result = await eos.transaction(tx);
      return result;
    },
  });
```
or (if you use only Scatter interface)
```javascript 
  const eos = ScatterJS.scatter.eos(network, Eos, {});
  eosdaq.login({
    identity: ScatterJS.identity,
    origin: 'eosdaq.com',
    eos,
  });

```
In this case, transaction will be excuted in library with eos object.

3. Logout
```javascript
  eosdaq.logout();
```

## API
-  changeLanguage(language)
```javascript
  eosdaq.changeLanguage('en'); // 'en', 'cn', 'hk', 'ko'
```