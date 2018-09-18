var UBXToken = artifacts.require("./UBXToken.sol"); //chuyen sang nodejs
contract('UBXToken',function(accounts){
    it('sets the total supply upon deployment',function(){
        return UBXToken.deployed().then(function(instance){})
        tokenInstance = instance;
        return tokenInstance.name();
    }).then(function(name){
        assert.equal(name,'UBXToken','has the correct name');
    });
})