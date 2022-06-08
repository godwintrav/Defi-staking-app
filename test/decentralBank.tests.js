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

    describe('RWD Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name();
            assert.equal(name, 'RWD Token');
            const symbol = await rwd.symbol();
            assert.equal(symbol, 'RWD');
        })
    })
})