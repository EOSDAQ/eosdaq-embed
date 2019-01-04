import 'babel-polyfill';
import Eosdaq from '../eosdaq';
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