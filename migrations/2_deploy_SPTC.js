// migrations/2_deploy_SPTC.js
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const cSPTC = artifacts.require('SPTC'); // contact

// flag for enums or structs in  deployProxy()/upgradeProxy()/prepareUpgrade() 
const unsafeAllowCustomTypes = true

module.exports = async function (deployer, network, accounts) { 
  const instance = await deployProxy(cSPTC, [], { deployer,unsafeAllowCustomTypes });
  console.log('Deployed:', instance.address);
};