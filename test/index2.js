import 'babel-polyfill';
import Eosdaq from '@eosdaq/embed';
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
        targetUrl: 'https://eosdaq.com',
        tokens: [],
        initialToken: 'PTI_EOS',
        theme: 'light',
        locale: 'en',
      },
    );

    const { identity } = ScatterJS;
    const { accounts: [account] } = identity;

    eosdaq.login({
      identity: {
      	accounts: [{
      		authority: account.authority,
      		name: account.name,
      		publickey: account.publickey,
      	}],
      },
      origin: 'eosdaq.com',
      eos,
      transactionCb: async (tx) => {
				const result = await eos.transaction(tx);
				return result;
			},
    });
  });
