const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const erc20 = await ERC20.deploy("AYAA", "AY", 1000);

  await erc20.deployed();

  console.log("ERC20 deployed to:", erc20.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
