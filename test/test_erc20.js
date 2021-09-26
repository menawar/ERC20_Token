const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let ERC20;
  let erc20;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.deploy("AYAA", "AY", 1000);
    await erc20.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await erc20.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await erc20.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      //   const ownerBalance = await erc20.balanceOf(owner.address);
      // //   console.log(ownerBalance);
      await erc20.connect(owner).transfer(addr1.address, 800);

      const addr1Balance = await erc20.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(800);
      console.log(addr1Balance);

      await erc20.connect(addr1).transfer(addr2.address, 400);
      //   console.log(await erc20.balanceOf(addr1.address));
      const addr2Balance = await erc20.balanceOf(addr2.address);
      //   console.log(addr2Balance);
      expect(addr2Balance).to.equal(400);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await erc20.balanceOf(owner.address);
      await expect(
        erc20.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await erc20.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await erc20.balanceOf(owner.address);

      // Transfer 500 tokens from owner to addr1.
      await erc20.connect(owner).transfer(addr1.address, 500);

      // Transfer another 50 tokens from owner to addr2.
      await erc20.connect(owner).transfer(addr2.address, 200);

      // Check balances.
      const finalOwnerBalance = await erc20.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 700);

      const addr1Balance = await erc20.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(500);

      const addr2Balance = await erc20.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(200);
    });
  });
});
