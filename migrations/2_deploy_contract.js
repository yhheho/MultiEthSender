var MultiEthSender = artifacts.require("./MultiEthSender.sol");

module.exports = function(deployer) {
  deployer.deploy(MultiEthSender, { value: 30000000000000000000 });
};
