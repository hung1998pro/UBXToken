var UBXToken = artifacts.require("./UBXToken.sol"); //chuyen sang nodejs
//calling function from a different contract
contract('UBXToken',function(accounts){
  var tokenInstance;
    it('initializes the contract with the correct values',function(){
      return UBXToken.deployed().then(function(insect){
        tokenInstance=insect;
        return tokenInstance.name(); 
      }).then(function(name){
        assert.equal(name,'UBX Token','has the exact name');
        return tokenInstance.symbol();
      }).then(function(symbol){
        assert.equal(symbol,'UBX','has the exact symbol')
        return tokenInstance.standard();
      }).then(function(standard){
        assert.equal(standard,'UBX Token v1.0','has the correct standard');
      });
    });
    it('allocates initial supply upon deployment',function(){
        return UBXToken.deployed().then(function(insect){ //promise dai dien cho ket qua asynctask
            tokenInstance = insect;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),66669999,'set the total supply to 66669999');
            return tokenInstance.balanceOf(accounts[0]);
          }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),66669999,'it allocates the initial supply to admin account')
          });
    });
    it('transfers token ownership',function(){
      return UBXToken.deployed().then(function(insect){
        tokenInstance=insect;
        //test require statement first by transferring something larger than the sender balance
        //call would return true or false value
        return tokenInstance.transfer.call(accounts[1],9999999999999999);
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert')>=0,'error message must contain revert');
        return tokenInstance.transfer.call(accounts[1],300000,{from: accounts[0]});
      }).then(function(success){
        assert.equal(success,true,'it returns true'); 
        return tokenInstance.transfer(accounts[1],300000,{from:accounts[0]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length,1,'triggers one event');
        assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the token are transferred from');
        assert.equal(receipt.logs[0].args._to,accounts[1],'logs the account the tokens are transferred to');
        assert.equal(receipt.logs[0].args._value,300000,'logs the transfer amount');
        return tokenInstance.balanceOf(accounts[1]);

      }).then(function(balance){
        assert.equal(balance.toNumber(),300000,'adds the amount to receiving account');
        return tokenInstance.balanceOf(accounts[0]);
      }).then(function(balance){
        assert.equal(balance.toNumber(),66369999,'deducts the amount from sending account');
      });
    });
    it('approves tokens for delegated transfer',function(){
      return UBXToken.deployed().then(function(insect){
        tokenInstace=insect;
        return tokenInstance.approve.call(accounts[1],100);
      }).then(function(success){
        assert.equal(success,true,'it returns true');
        return tokenInstance.approve(accounts[1],100,{from: accounts[0]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length,1,'triggers one event');
        assert.equal(receipt.logs[0].event,'Approval','should be the "Approval" event');
        assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account the token are authorized by');
        assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the account the tokens are authorized to');
        assert.equal(receipt.logs[0].args._value,100,'logs the transfer amount');
        return tokenInstace.allowance(accounts[0],accounts[1]);
      }).then(function(allowance){
        assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
      })
    });
    it('handles delegated token transfers',function(){
      return UBXToken.deployed().then(function(insect){
        tokenInstance=insect;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];
        //Transfer some tokens to fromAccount
        return tokenInstance.transfer(fromAccount,100,{from: accounts[0]});
      }).then(function(receipt){
        //Approve spendingAccounts to spend 10 tokens from fromAccount
        return tokenInstance.approve(spendingAccount,10,{from: fromAccount});
      }).then(function(recript){
        //Try transfering something larger than the sender's Balance
         return tokenInstance.transferFrom(fromAccount,toAccount,6969,{from: spendingAccount});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than balance');
        //Try transferring something larger than approved amount
        return tokenInstance.transferFrom(fromAccount,toAccount,30,{from: spendingAccount});//<=balance but greater than authoried balance
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert')>=0,'cannot transfer value larger than approved amount');
        //don't actually want to create a transaction use call
        return tokenInstance.transferFrom.call(fromAccount,toAccount,5,{from: spendingAccount});
      }).then(function(success){
        assert.equal(success,true);
        //want to create transaction and change the state of accounts, check the result before change state
        return tokenInstace.transferFrom(fromAccount,toAccount,5,{from: spendingAccount});
      }).then(function(receipt){
        assert.equal(receipt.logs.length,1,'triggers one event');
        assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
        assert.equal(receipt.logs[0].args._from,fromAccount,'logs the account the token are transferred from');
        assert.equal(receipt.logs[0].args._to,toAccount,'logs the account the tokens are transferred to');
        assert.equal(receipt.logs[0].args._value,5,'logs the transfer amount');
        return tokenInstance.balanceOf(fromAccount);
      }).then(function(balance){
        assert.equal(balance.toNumber(),95,'deducts the amount from the sending Account');
        return tokenInstace.balanceOf(toAccount);
      }).then(function(balance){
        assert.equal(balance.toNumber(),5,'adds the amount from the receiving account')
        return tokenInstance.allowance(fromAccount,spendingAccount);
      }).then(function(allowance){
        assert.equal(allowance.toNumber(),5,'deducts the amount from the allowance');
      });
    });
}); 
/* assert(error.message.indexOf('revaert')>=0,'error message must contain revert'); */
/* .then(assert.fail).catch(function(error){ */