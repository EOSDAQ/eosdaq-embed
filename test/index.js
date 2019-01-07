import 'babel-polyfill';
import Eosdaq from '@eosdaq/embed';
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const network = {
  blockchain: "eos",
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  host: "rpc.eosys.io",
  httpEndpoint: "https://rpc.eosys.io:443",
  port: 443,
  protocol: "https"
};

const eosdaq = new Eosdaq(
  'eosdaq',
  {},
);

ScatterJS.plugins(new ScatterEOS())
ScatterJS.scatter.connect('EOSDAQ')
  .then(async (c) => {
    if (!c) {
      console.log('Failed to connect');
      return;
    }
    
    const eos = ScatterJS.scatter.eos(network, Eos, {});
    eosdaq.login(ScatterJS.scatter, eos);
  })