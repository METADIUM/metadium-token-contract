require('babel-register')
var LedgerWalletProvider = require("truffle-ledger-provider");

var ledgerOptions = {
  networkId: 1, // 1 mainnet, 3 ropsten
  path: "44'/60'/0'/0", // ledger default derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0
};


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas:6000000
    }
  }

};
