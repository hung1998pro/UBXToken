var UBXToken = artifacts.require("./UBXToken.sol"); // transmit UBXToken to JS
var UBXTokenSale = artifacts.require("./UBXTokenSale.sol"); // transmit UBXToken to JS
module.exports = function (deployer) {
    deployer.deploy(UBXToken,66669999).then(function(){
        //Token price is 0.001 Ether
        var tokenPrice = 1000000000000000; //in wei
        return deployer.deploy(UBXTokenSale,UBXToken.address,tokenPrice);
    });
    
};
