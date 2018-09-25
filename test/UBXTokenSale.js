var UBXToken = artifacts.require("./UBXToken");
var UBXTokenSale = artifacts.require("./UBXTokenSale");
contract('UBXTokenSale',function(accounts){
    var tokenSaleInstance;
    var tokenInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000; //in wei
    var tokensAvailable = 44446666; 
    var numberOfTokens;
    it('initializes the contract with the correct value',function(){
        return UBXTokenSale.deployed().then(function(instance){
            tokenSaleInstance=instance;
            return tokenSaleInstance.address;   //contract address
        }).then(function(address){
            assert.notEqual(address,0x0,'has correct contract address');
            return tokenSaleInstance.tokenContract();   //token address

        }).then(function(address){
            assert.notEqual(address,0x0,'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price,tokenPrice,'token price is correct');
        });
    });
    it('facilitates token buying',function(){
        return UBXToken.deployed().then(function(instance){
            //grab token instance first
            tokenInstance=instance;
            return UBXTokenSale.deployed();
        }).then(function(instance){
            //then grab token sale instance
            tokenSaleInstance=instance;
            //Provision 75% of all tokens to the token sale
            //admin has 66669999 tokens so far, and he only provides 44446666 tokens to ICO
            return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from: admin});
         }).then(function(receipt){ 
             numberOfTokens=10;
            //var value=numberOfTokens*tokenPrice; //in wei */
            return tokenSaleInstance.buyTokens(numberOfTokens,{from: buyer,value:numberOfTokens*tokenPrice})
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'triggers one event');
            assert.equal(receipt.logs[0].event,'Sell','should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer,buyer,'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount,numberOfTokens,'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(),numberOfTokens,'increaments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(),numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(),tokensAvailable-numberOfTokens);
            //Try to buy tokens different from the ether value
            return tokenSaleInstance.buyTokens(numberOfTokens,{from:buyer,value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'msg.value must equal number of token in wei');
            return tokenSaleInstance.buyTokens(90000000,{ from: buyer, value: numberOfTokens*tokenPrice });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'must purchse equal or less tokens than available');
        })
    });
    it('ends token sale',function(){
        return UBXToken.deployed().then(function(instance){
            tokenInstance=instance;
            return UBXTokenSale.deployed();
        }).then(function(instance){
            //then grab token sale instance
            tokenSaleInstance=instance;
            return tokenSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'only admin has permission to end sale');
            return tokenSaleInstance.endSale({from: admin});
        }).then(function(receipt){
            //receipt
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(),66669989,'minus admin balance 10, unsold UBXToken to admin');
            //check that token price was reset when selDestruct was called
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price.toNumber(),0,'token price was reset');
        });
    });
});
