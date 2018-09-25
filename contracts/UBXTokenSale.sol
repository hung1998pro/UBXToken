pragma solidity ^0.4.24;
import "./UBXToken.sol";
contract UBXTokenSale{
    address admin;
    UBXToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer,uint256 _amount);

    constructor (UBXToken _tokenContract,uint256 _tokenPrice) public   {
        //Assign an admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price
        tokenPrice=_tokenPrice;
    }
    //  multiply
    function multiply(uint x,uint y) internal pure returns (uint z){
        require (y==0||(z=x*y)/y==x);
    } 

    //Buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable{ //payable can receive funds when someone send token to this
        //Require that value is equal to tokens
        require(msg.value==multiply(_numberOfTokens,tokenPrice));
        //Require that the contract has enough tokens
        require(tokenContract.balanceOf(this)>=_numberOfTokens);
        //Require that a transfer is successful
        require(tokenContract.transfer(msg.sender,_numberOfTokens));
        //Keep track of number of tokens sold
        tokensSold += _numberOfTokens;
        //Trigger Sell Event
        emit Sell(msg.sender,_numberOfTokens);
    }
    function endSale() public {
        require(msg.sender==admin);
        require(tokenContract.transfer(admin,tokenContract.balanceOf(this)));
        selfdestruct(admin);
    }
}