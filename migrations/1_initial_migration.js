const Migrations  	= artifacts.require("Migrations");
const Spells     	= artifacts.require("Spells");
const Enchant_Zeta  = artifacts.require("Enchant_Zeta");
const Hello			= artifacts.require("Hello");

module.exports = function (deployer) {
	deployer.deploy(Migrations);
  	deployer.deploy(Spells);
	deployer.deploy(Enchant_Zeta);
	deployer.deploy(Hello);
};
