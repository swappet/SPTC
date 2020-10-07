// migrations/3_upgrade_SPTCv2.js
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