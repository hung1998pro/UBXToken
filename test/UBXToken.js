var UBXToken = artifacts.require("./UBXToken.sol"); //chuyen sang nodejs
contract('UBXToken',function(accounts){
    it('sets the total supply upon deployment',function(){
        return UBXToken.deployed().then(function(instance){ //promise dai dien cho ket qua asynctask
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),66669999,'set the total supply to 66669999');
        });
    });
})
/* var UBXToken = artifacts.require("./UBXToken.sol");

contract('UBXToken', function(accounts) {

  it('sets the total supply upon deployment', function() {
    return UBXToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 66669999, 'sets the total supply to 1,000,000');
    });
  });
}) */

