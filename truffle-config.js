require('babel-register');
require('babel-polyfill');
const provider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const secrets = JSON.parse(
  fs.readFileSync('.secrets.json').toString().trim()
);

module.exports = {
    networks: {
        goerli: {
            provider: () => new provider(
             secrets.privateKeys,
              'https://goerli.infura.io/v3/d7509ac78da84338b5430611d7223c93',
              0,
              3
            ),
            network_id: 5
          },
        development: {
            host:'127.0.0.1',
            port: 7545,
            network_id: '*', //match any network
        },
    },

    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/truffle_abis/',
    compilers: {
        solc: {
            version: '^0.5.0',
            optimizer: {
                enabled: true,
                runs: 200
            },
        }
    }

}