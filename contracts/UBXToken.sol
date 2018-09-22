pragma solidity ^0.4.24;
contract UBXToken{
    // Constructor
    //set number of total tokens
    // read total number of tokens
    string public name ='UBX Token';
    string public symbol = 'UBX';
    string public standard = 'UBX Token v1.0';
    uint256 public totalSupply;
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    mapping(address=> uint256) public balanceOf;

    //function UBXToken(uint256 _initialSupply) public {
      constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender]=_initialSupply;
        totalSupply = _initialSupply;
        //alocate initial supply to admin account
    }
    //transfer event
    function transfer(address _to,uint _value) public returns (bool success){
        require(balanceOf[msg.sender]>=_value);
        //Transfer
        balanceOf[msg.sender]-=_value;
        balanceOf[_to]+=_value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }
}
