const assert = require('assert');
const { contract, accounts,web3 } = require('@openzeppelin/test-environment');

const { expect } = require('chai');

// require('@openzeppelin/test-helpers/configure')({
//   provider: 'http://localhost:8545',  
//   // provider: web3.currentProvider,
//   singletons: {
//     abstraction: 'web3',
//     // abstraction: 'truffle',
//     defaultGas: 6e6,
//     defaultSender: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
//   },
// });

const { 
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    ether,          // ether('1')=>1e18=>1000000000000000000
    expectEvent,    // Assertions for emitted events
    expectRevert,   // Assertions for transactions that should fail
    send,time } = require('@openzeppelin/test-helpers');//测试助手
// time tool
// await time.advanceBlock();
// await time.advanceBlockTo(target)
// await time.latest()
// await time.latestBlock()
// await time.increase(duration)
// await time.increaseTo(target)
// await time.increase(time.duration.years(2));

// Loads the built artifact from build/contracts/SPTC.json
// const ERC20 = artifacts.require('ERC20'); // truffle style
const ERC20Contract = contract.fromArtifact("SPTC"); // contract name

// get account from accounts array
[owner, sender, receiver, purchaser, beneficiary] = accounts;
const bnValue = new BN('18');

describe("test balance", function () {   

    it('check sender balance after send', async function () {
        ownerBalance = await web3.eth.getBalance(owner);
        send.ether(owner, receiver, ether('10'))
        assert.equal(ether('90').toString(),(await web3.eth.getBalance(owner)).toString());
    });
    it('check receiver balance after send ', async function () {
        assert.equal(ether('110').toString(),(await web3.eth.getBalance(receiver)).toString());
    });
});

// contract('ERC20', function (accounts) { //  truffle style
describe("ERC20 test", function () {     
    beforeEach(async function() {
        ERC20Param = [
            "SwapPetTokenCoop",   // name
            "SPTC",              // symbol
            '10000',              // totalSupply
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });//deployed instance 
    });

    it('deployer is owner', async function () {
        expect(await ERC20Instance.owner()).to.equal(owner);
    });
});

describe("test ERC20 contact info", function () {  

    it('name()', async function () {
        assert.equal(ERC20Param[0], await ERC20Instance.name());
    });
    it('symbol()', async function () {
        assert.equal(ERC20Param[1], await ERC20Instance.symbol());
    });
    it('decimals()', async function () {
        assert.equal(18, (await ERC20Instance.decimals()).toString());
    });
    // ether('1')=>1000000000000000000
    it('totalSupply()', async function () {
        assert.equal(ether(ERC20Param[2]).toString(), (await ERC20Instance.totalSupply()).toString());
    });
    it('owner balanceOf()', async function () {
        assert.equal(ether(ERC20Param[2]).toString(), (await ERC20Instance.balanceOf(owner)).toString());
    });
    it('transfer()', async function () {
        let receipt = await ERC20Instance.transfer(receiver, ether('100'), { from: owner });
        // Event assertions can verify that the arguments are the expected ones 
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: receiver,
            value: ether('100'),
        });
    });
    it('error rejects:transfer() to zero', async function () {
        await assert.rejects(
            ERC20Instance.transfer(
                constants.ZERO_ADDRESS,
                ether('100'),
                { from: owner }
            ),
            /ERC20: transfer to the zero address/
        );
    });
    it('reverts when transferring tokens to the zero address', async function () {
        // Conditions that trigger a require statement can be precisely tested
        await expectRevert(
          ERC20Instance.transfer(constants.ZERO_ADDRESS, ether('100'), { from: sender }),
          'ERC20: transfer to the zero address',
        );
      });
    it('updates balances on successful transfers', async function () {
        ERC20Instance.transfer(receiver, ether('100'), { from: sender });

        // BN assertions are automatically available via chai-bn (if using Chai)
        expect(await ERC20Instance.balanceOf(receiver))
          .to.be.bignumber.equal(ether('100'));
      });
});



