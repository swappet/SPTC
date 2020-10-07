# SPTC
Swap.Pet Token of Coops in Chicken Farm

1. SPTC is the token of ERC721 for DAO of Swap.Pet
2. SPTC is upgradable by using the OpenZeppelin tools 

# Create SPTE
## install LTS Node with nvm
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
$ source ~/.bash_profile
$ command -v nvm 
$ nvm -v                
0.36.0
$ nvm ls-remote 
<!-- $ nvm install node # "node" is an alias for the latest version(--lts) -->
$ nvm install --lts
$ node --version
v12.18.4
$ npm -v
6.14.6
$ npx -v
6.14.6
$ nvm reinstall-packages
```

## init project with truffle and ganache-cli
```
$ npm i -g truffle
$ npm i -g ganache-cli
$ mkdir ~/SPTE
$ cd ~/SPTE
$ npm init
$ npm install
$ truffle init
// open new terminal
$ npx ganache-cli --deterministic
```

## init openzeppelin CLI 
init SPTE project with openzeppelin CLI：
```
<!-- $ npm install --save-dev @openzeppelin/cli -->
$ npm install -g @openzeppelin/cli
$ openzeppelin --version
2.8.2
OR 
$ oz --version
$ npx oz --version 
$ cd ~/SPTE
$ npx openzeppelin init
OR
$ npx oz init
```

## Using the OpenZeppelin CLI With Truffle
edit `truffle-config.js`:
```
module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
    },
  },

  compilers: {
    solc: {
      version: "0.5.2",
      // docker: true,        // default: false
      settings: {
       optimizer: {
         enabled: true,
         runs: 200
       },
       // evmVersion: "byzantium" // istanbul(default),constantinople,byzantium
      }
    }
  }
}
```

edit `contracts/Migrations.sol`:
```
// contracts/Migrations.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  constructor() public {
    owner = msg.sender;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  } 
}
```

## edit first contact 
install lib:`$ npm install --save-dev @openzeppelin/contracts`
add `contracts/SPTC.sol`:
```
// contracts/SPTC.sol
// Copyright (C) 2020, 2021, 2022 Swap.Pet@pm.me
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";

// Make SPTC inherit from the Ownable contract 
contract SPTC is Ownable {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    // The onlyOwner modifier restricts who can call the store function
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

deploy and interact：
```
$ npx oz compile
$ npx oz deploy
$ npx oz send-tx
$ npx oz call
```

## Interacting Programmatically
```
$ npm install web3 @openzeppelin/contract-loader
$ mkdir src
$ touch src/index.js
```

edit 'src/index.js': `$ vi src/index.js`
```
// src/index.js 
// Copyright (C) 2020, 2021, 2022 Swap.Pet@pm.me
// SPDX-License-Identifier: MIT

const Web3 = require('web3'); 
const { setupLoader } = require('@openzeppelin/contract-loader');

// Set up web3 object, connected to the local development network
const web3 = new Web3('http://localhost:8545');
// // Set up a contract loader
const loader = setupLoader({ provider: web3 }).web3;


async function main() {
    // Our code will go here

    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // Set up a web3 contract, representing deployed instance
    const address = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
    // load contact using the contract loader
    const sptc = loader.fromArtifact('SPTC', address);

    // Call the retrieve() function of the deployed contract
    const value = await sptc.methods.retrieve().call();
    console.log("SPTC value is", value);
}

main();
```

run:
```
$ node src/index.js
[
  '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
  '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
  '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',...
]
SPTC value is 218
```
**node**:In a real-world app, need to [estimate the gas](https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#methods-mymethod-estimategas) of transactions, and check a [gas price oracle](https://ethgasstation.info) to know the optimal values to use on every transaction.

## Automated Smart Contract Tests
add test tool:
```
$ npm install --save-dev @openzeppelin/test-helpers
$ npm install --save-dev @openzeppelin/test-environment mocha chai
$ npm install --save-dev @openzeppelin/gsn-provider
$ npm install @truffle/debug-utils 
```

edit 'package.json':
```
"scripts": {
  "test": "oz compile && mocha --exit --recursive"
}
```

run oz test:
```
$ npm test
or
$ npm run test
<!-- cause Mocha to stop immediately on the first failing test -->
$ npm test -- --bail
```

run truffle test (need run `npx ganache-cli --deterministic` in new terminal):
```
$ truffle test
Using network 'development'.

Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
> Compiling ./contracts/SPTC.sol 
> Artifacts written to /var/folders/_8/p_k3r1jd1sbcm9czcb9jtcn80000gn/T/test--31822-qjaHN1B53eE5
> Compiled successfully using:
   - solc: 0.6.12+commit.27d51765.Emscripten.clang 

  SPTC
    ✓ deployer is owner (388ms)
```

edit test config 'test-environment.config.js'.

## edit upgradeable contact
install [OpenZeppelin reusable Ethereum Package](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package):`$ npm install @openzeppelin/contracts-ethereum-package` 

or : `$ npm install @openzeppelin/upgrades`

All contracts have an UpgradeSafe suffix to avoid confusion with their counterparts in OpenZeppelin Contracts. For example, 'ERC20' becomes 'ERC20UpgradeSafe'.

upgrade to use the same contact file:`$ npx oz upgrade`
upgrade to use the diff contact file:`$ npx truffle migrate`

## Upgrading Smart Contracts with truffle
install plugin for truffle:
```
$ npm install --save-dev @openzeppelin/truffle-upgrades
$ npm install --save-dev @nomiclabs/buidler-ethers ethers
```

deploy new contact with edit 'migrations/2_deploy_SPTC.js':
```
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const cSPTC = artifacts.require('SPTC'); // contact

// flag for enums or structs in  deployProxy()/upgradeProxy()/prepareUpgrade() 
const unsafeAllowCustomTypes = true

module.exports = async function (deployer, network, accounts) { 
  const instance = await deployProxy(cSPTC, [], { deployer,unsafeAllowCustomTypes });
  console.log('Deployed:', instance.address);
};
```

copy 'contracts/SPTC.sol' to 'contracts/SPTCv2.sol' and change something in 'SPTCv2.sol'.

upgrade contact with edit 'migrations/3_upgrade_SPTCv2.js':
```
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const SPTC = artifacts.require('SPTC');
const SPTCv2 = artifacts.require('SPTCv2');

// flag for enums or structs in  deployProxy()/upgradeProxy()/prepareUpgrade() 
const unsafeAllowCustomTypes = true

module.exports = async function (deployer, network, accounts) {
  const existing = await SPTC.deployed();
  console.log("existing:", existing.address);
  const instance = await upgradeProxy(existing.address, SPTCv2, { deployer,unsafeAllowCustomTypes });
  console.log("Upgraded:", instance.address);
};
```
call contact:
```
$ npx truffle develop
truffle(develop)>compile
truffle(develop)>deploy
or
truffle(develop)>migrate --reset --f 1 --to 2
truffle(develop)>SPTC.deployed().then(instance=>contract=instance)
truffle(develop)>contract.store(12)
truffle(develop)>contract.retrieve()
truffle(develop)>contract.store(33)
truffle(develop)>migrate
truffle(develop)>contract.retrieve()
truffle(develop)>contract.store(55)
truffle(develop)>contract.retrieve()
truffle(develop)>contract.store(88)
```

test:
```
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const SPTC = artifacts.require('SPTC');
const SPTCv2 = artifacts.require('SPTCv2');

// flag for enums or structs in  deployProxy()/upgradeProxy()/prepareUpgrade() 
const unsafeAllowCustomTypes = true

module.exports = async function (deployer, network, accounts) {
  const existing = await SPTC.deployed();
  console.log("existing:", existing.address);
  const instance = await upgradeProxy(existing.address, SPTCv2, { deployer,unsafeAllowCustomTypes });
  console.log("Upgraded:", instance.address);
};

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { ethers, upgrades } = require("@nomiclabs/buidler");

const SPTC = artifacts.require('SPTC');
const SPTCv2 = artifacts.require('SPTCv2');

// flag for enums or structs in  deployProxy()/upgradeProxy()/prepareUpgrade() 
const unsafeAllowCustomTypes = true

it('works before and after upgrading', async function () {
  const instance = await upgrades.deployProxy(cSPTC, []); 
  await upgrades.upgradeProxy(instance.address, SPTCv2); 
});
```

## Managing ownership
All proxies define an admin address which has the rights to upgrade them. By default, the admin is a proxy admin contract deployed behind the scenes. You can change the admin of a proxy by calling the `admin.changeAdminForProxy` function in the plugin of '@openzeppelin/truffle-upgrades'.

The proxy admin contract also defines an owner address which has the rights to operate it. By default, this address is the externally owned account used during deployment. You can change the proxy admin owner by calling the `admin.transferProxyAdminOwnership` function in the plugin. Note that changing the proxy admin owner effectively transfers the power to upgrade any proxy in your whole project to the new owner, so use with care.

Once you have transferred the rights to upgrade a proxy to another address, you can still use your local setup to validate and deploy the implementation contract. The plugins include a `prepareUpgrade` function that will validate that the new implementation is upgrade-safe and compatible with the previous one, and deploy it using your local Ethereum account. You can then execute the upgrade itself from the admin address.

## Connecting to Public Test Networks
https://docs.openzeppelin.com/learn/connecting-to-public-test-networks



## Preparing for Mainnet
https://docs.openzeppelin.com/learn/preparing-for-mainnet
