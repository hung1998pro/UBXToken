var UBXToken = artifacts.require("./UBXToken.sol"); // transmit UBXToken to JS
module.exports = function (deployer) {
    deployer.deploy(UBXToken,66669999);
};
