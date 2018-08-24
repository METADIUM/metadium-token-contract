![meta logo](./misc/Metadium_Logo_Vertical_PNG.png)
# Metadium ERC20 Smart Contract
-------------------------------------------------
[![Generic badge](https://img.shields.io/badge/build-passing-green.svg)](https://shields.io/)    [![Generic badge](https://img.shields.io/badge/licence-MIT-blue.svg)](https://shields.io/)

This is Metadium ERC20 Token Smart Contract


Mainnet Metadium Address : [0xde2f7766c8bf14ca67193128535e5c7454f8387c](https://etherscan.io/token/0xde2f7766c8bf14ca67193128535e5c7454f8387c)


MultiSigWallet : [0x317483f2cdc9f43c5647e03ece51b6099afb294a](https://etherscan.io/address/0x317483f2cdc9f43c5647e03ece51b6099afb294a#code)

## How to test
--------------------------------------------------
Install truffle

```
$ npm install -g truffle

```

Install ganache-cli

```
$ npm install -g ganache-cli

$ ganache-cli -l 0xffffffff
```

In the project root directory, 

```
$ npm install
```

**Whole test**

```
$ sh run_test.sh
```


**OR**
```
$ truffle test test/StandardToken.js
```

