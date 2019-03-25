import 'babel-polyfill';
import Eosdaq from '../eosdaq';
import Eos from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

const network = {
  blockchain: 'eos',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  host: 'rpc.eosys.io',
  httpEndpoint: 'https://rpc.eosys.io:443',
  port: 443,
  protocol: 'https',
};

const network1 = ScatterJS.Network.fromJson(network);

ScatterJS.plugins(new ScatterEOS());
ScatterJS.scatter.connect('EOSDAQ', { network: network1 })
  .then(async (c) => {
    if (!c) {
      console.log('Failed to connect');
      return;
    }

    await ScatterJS.login({ accounts: [network1] });
    const eos = ScatterJS.scatter.eos(network, Eos, {});
    const eosdaq = new Eosdaq(
      'eosdaq',
      {
        targetUrl: 'https://dev.eosdaq.com',
        tokens: ['KEOS_EOS', 'TPT_EOS'],
        initialToken: 'KEOS_EOS',
        theme: 'light',
      },
    );

    eosdaq.login({
      identity: ScatterJS.identity,
      origin: 'eosdaq.test',
      eos,
    });
  });
