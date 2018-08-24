
/* when transfer is not Enabled - owner only can transfer
                                - other users cannot transfer
   when transfer is enabled - all the users can transfer


   only owner can 
                  enable transfer, disable transfer 1
                  burn his own tokens 1

   

*/
import assertRevert from './helpers/assertRevert';
import EVMRevert from './helpers/EVMRevert';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MetadiumToken = artifacts.require('Metadium');

contract('MetadiumToken', function ([deployer, owner, recipient, anotherAccount, anotherAccount2]) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const INITIAL_SUPPLY = 2000000000 * 10 ** 18;
  beforeEach(async function () {
    this.token = await MetadiumToken.new({ from: owner });

  });

  describe('transfer', function () {
    describe('when the transfer is disabled', function () {
      const to = recipient;
      describe('owner', function () {
        const amount = INITIAL_SUPPLY;

        it('transfers the requested amount', async function () {
          await this.token.transfer(to, amount, { from: owner });

          const senderBalance = await this.token.balanceOf(owner);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(to);
          assert.equal(recipientBalance, amount);

        });
        it('emits a transfer event', async function () {
          const { logs } = await this.token.transfer(to, amount, { from: owner });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, owner);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });

      describe('other users', function () {
        const amount = INITIAL_SUPPLY;

        it('reverts', async function () {
          await this.token.transfer(anotherAccount, amount, { from: owner });
          await assertRevert(this.token.transfer(to, 1, { from: anotherAccount }));

        });
      });
    });

    describe('when the transfer is enabled', function () {
      const to = recipient;
      const amount = INITIAL_SUPPLY;
      beforeEach(async function () {
        await this.token.enableTransfer({ from: owner });
        await this.token.transfer(anotherAccount, amount, { from: owner });
      });
      describe('all the users ', function () {
        it('transfers the requested amount', async function () {
          await this.token.transfer(to, amount, { from: anotherAccount });

          const senderBalance = await this.token.balanceOf(anotherAccount);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(to);
          assert.equal(recipientBalance, amount);
        });
        it('emits a transfer event', async function () {
          const { logs } = await this.token.transfer(to, amount, { from: anotherAccount });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, anotherAccount);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });
    });
  });


  describe('transfer from', function () {
    describe('when the transfer is disabled', function () {
      const to = recipient;
      describe('owner', function () {
        const amount = INITIAL_SUPPLY;
        beforeEach(async function () {
          await this.token.transfer(anotherAccount, amount, { from: owner });
          await this.token.approve(owner, amount, { from: anotherAccount });

        });

        it('transfers the requested amount from an another account if he approved', async function () {
          await this.token.transferFrom(anotherAccount, to, amount, { from: owner });

          const senderBalance = await this.token.balanceOf(anotherAccount);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(to);
          assert.equal(recipientBalance, amount);

        });
        it('emits a transferFrom event', async function () {
          const { logs } = await this.token.transferFrom(anotherAccount, to, amount, { from: owner });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, anotherAccount);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });
      describe('other users', function () {
        const amount = INITIAL_SUPPLY;

        it('reverts', async function () {
          await this.token.approve(anotherAccount, amount, { from: owner });
          await assertRevert(this.token.transferFrom(anotherAccount, to, amount, { from: anotherAccount }));

        });
      });
    });

    describe('when the transfer is enabled', function () {
      const to = recipient;
      const amount = INITIAL_SUPPLY;
      beforeEach(async function () {
        await this.token.enableTransfer({ from: owner });
        await this.token.approve(anotherAccount, amount, { from: owner });
      });
      describe('all the users ', function () {
        it('transferFrom the requested amount from an another account if he approved ', async function () {
          await this.token.transferFrom(owner, to, amount, { from: anotherAccount });

          const senderBalance = await this.token.balanceOf(owner);
          assert.equal(senderBalance, 0);

          const recipientBalance = await this.token.balanceOf(to);
          assert.equal(recipientBalance, amount);
        });
        it('emits a transferFrom event', async function () {
          const { logs } = await this.token.transferFrom(owner, to, amount, { from: anotherAccount });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Transfer');
          assert.equal(logs[0].args.from, owner);
          assert.equal(logs[0].args.to, to);
          assert(logs[0].args.value.eq(amount));
        });
      });
    });
  });


  describe('only owner can', function () {
    const to = recipient;
    const burningAmount = INITIAL_SUPPLY;
    it('enable transfer', async function () {
      await this.token.enableTransfer({ from: owner });
      var transferEnabled = await this.token.transferEnabled();
      transferEnabled.should.equal(true);

    });
    it('disable transfer', async function () {
      await this.token.enableTransfer({ from: owner });
      var transferEnabled = await this.token.transferEnabled();
      transferEnabled.should.equal(true);
      await this.token.disableTransfer({ from: owner });
      transferEnabled = await this.token.transferEnabled();
      transferEnabled.should.equal(false);
    });
    it('burn his own token', async function () {
      await this.token.burn(burningAmount, { from: owner });
      const ownerBalance = await this.token.balanceOf(owner);
      assert.equal(ownerBalance, 0);

      const _totalSupply = await this.token.totalSupply();
      assert.equal(_totalSupply, 0);
    });
  });

  describe('other users cannot', function () {
    const to = recipient;
    const burningAmount = INITIAL_SUPPLY;
    it('enable transfer', async function () {
      await assertRevert(this.token.enableTransfer({ from: anotherAccount }));
    });
    it('disable transfer', async function () {
      await assertRevert(this.token.disableTransfer({ from: anotherAccount }));
    });
    it('burn his own token', async function () {
      await assertRevert(this.token.burn(burningAmount, { from: anotherAccount }));
    });
  });
});
