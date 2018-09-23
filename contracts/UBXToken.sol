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
    //transfer
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );
    mapping(address=> uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;
    //allowance 
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
    //approve
    function approve(address _spender,uint256 _value)public returns (bool success){
        //allowance
        allowance[msg.sender][_spender]=_value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }
    function transferFrom(address _from,address _to,uint256 _value) public returns (bool success){
    require(_value<=balanceOf[_from]);
    //Require _from has enough tokens
    require(_value<=allowance[_from][msg.sender]);// mesg.sender represent _from to make a transaction
    //Require allowance is big enough
    balanceOf[_from]-=_value;
    balanceOf[_to]+=_value;
    //change& update the balance
    allowance[_from][msg.sender]-=_value;
    //update the allowance
    emit Transfer(_from,_to,_value);
    //transfer event
    return true;    
    //return a booleean
    }
}
