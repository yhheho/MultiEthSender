var MultiEthSender = artifacts.require("./MultiEthSender.sol");

const ether = 10**18; // 1 ether = 1000000000000000000 wei
const initialDepositsBalance = 30 * ether;


contract("MultiEthSender - basic initialization", function(accounts) {
  const deployer = accounts[0];
  const bob = accounts[1];
  const charlie = accounts[2];
  const dave = accounts[3];
  const deposit = 30 * ether;

  it("initialization should have correct initial deposit", async () => {
    const multiEthSender = await MultiEthSender.deployed({value: web3.toBigNumber(deposit)});

    const balance = await multiEthSender.getBalance();
    assert.equal(balance, initialDepositsBalance, "deposit amount incorrect, check deposit method");
  });

  it("deposit function should be correct", async () => {
    const multiEthSender = await MultiEthSender.deployed({value: web3.toBigNumber(deposit)});

    await multiEthSender.deposit({from: deployer, value: web3.toBigNumber(deposit)});
    const balance = await multiEthSender.getBalance();
    assert.equal(balance, 2 * deposit, "deposit amount incorrect, check deposit method");
  });

  it("should transfer correct amount of eth to addresses", async () => {
    const multiEthSender = await MultiEthSender.deployed();
    const transferAmountInEth = 20;
    var addresses = [bob, charlie, dave];
    var originBalances = [web3.eth.getBalance(bob), web3.eth.getBalance(charlie), web3.eth.getBalance(dave)];

    await multiEthSender.multiSendEth(transferAmountInEth, addresses);

    //test balance after multi transfer
    const balance = await multiEthSender.getBalance();
    assert.equal(balance, 0, "the balance should be 0, please check the method");

    //test account's balances
    const bobNewBalance = await web3.eth.getBalance(bob);
    assert.equal(bobNewBalance - originBalances[0], transferAmountInEth*ether, "the new balance should be 10, please check the method");
    const charlieNewBalance = await web3.eth.getBalance(charlie);
    assert.equal(charlieNewBalance - originBalances[1], transferAmountInEth*ether, "the new balance should be 10, please check the method");
    const daveNewBalance = await web3.eth.getBalance(dave);
    assert.equal(daveNewBalance - originBalances[2], transferAmountInEth*ether, "the new balance should be 10, please check the method");
  });

});
