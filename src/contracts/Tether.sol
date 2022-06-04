pragma solidity ^0.5.0;

contract Tether{
    string public name = 'Mock Tether Token';
    string public symbol = 'mUSDT';
    uint256 public totalSupply = 1000000000000000000000000; //1 million tokens
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient token");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //called by the token owner
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //called by approved address
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        //in the transferFrom method the msg.sender is the third party allowed and approved to transfer money from the _from address
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        //add the balance for transferFrom to the receiver address
        balanceOf[_to] += _value;
        //subtract the balance of the from address
        balanceOf[_from] -= _value;
        //subtract the allowed value in the allowance mapping
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}