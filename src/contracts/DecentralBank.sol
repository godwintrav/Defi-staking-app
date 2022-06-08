pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RWD _rwd, Tether _tether) public{
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    //staking function
    function depositTokens(uint _amount) public {
        require(_amount > 0, 'amount cannot be greater than 0');

        //Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //issue rewards
    function issueTokens() public {
        //require owner to issue tokens only
        require(msg.sender == owner, 'caller must be the owner');

        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // divide by 9 to create percentage incentives
            if(balance > 0){
                rwd.transfer(recipient, balance);
            }
        }
    }

}