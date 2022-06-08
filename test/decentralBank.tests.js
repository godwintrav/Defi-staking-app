const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner, customer]) => {

    let tether, rwd, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether');
    }

    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        //Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'));

        //Transfer 100 mock Tethers to Customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })
    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name();
            const symbol = await tether.symbol();
            assert.equal(name, 'Mock Tether Token');
            assert.equal(symbol, 'mUSDT');
        })
    })

    describe('Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
            const symbol = await rwd.symbol();
            assert.equal(symbol, 'RWD');
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        }) 
    })

    describe('Yield Farming', async() => {
        it('rewards tokens for staking', async () => {
            let result;

            //check Investor balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking');

                    //check Staking for customer
            await tether.approve(decentralBank.address, tokens('100'), {from: customer});
            await decentralBank.depositTokens(tokens('100'), {from: customer});

            //check updated balance of customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens');

            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'), 'Decentral Bank Tether Balance after staking from customer');

            //Is Staking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer is staking status after staking');

            //Issue Tokens
            await decentralBank.issueTokens({from: owner});

            //Ensure Only The Owner Can Issue Tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected;
        })


    })
})