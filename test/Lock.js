const { expect, assert } = require("chai")
const {getNamedAccounts,deployments, ethers}  = require("hardhat")


describe("Lending", async function(){
  let Lending,deployer;

  let amount = ethers.utils.parseEther("1");
  let tokenAmount = ethers.utils.parseEther("100")
  let tokenAmountHalf = ethers.utils.parseEther("50")
  let tokenAmountInLending = ethers.utils.parseEther("1000")
  let tokenA ,tokenB;
  beforeEach(async function()
  {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    Lending = await ethers.getContract("Lending",deployer)
    tokenA = await ethers.getContract("TokenA",deployer)
    tokenB = await ethers.getContract("TokenB",deployer)
   
    await tokenA.transfer(Lending.address,tokenAmountInLending)
    await tokenB.transfer(Lending.address,tokenAmountInLending)
  })

  describe("Deposit",async function(){
    it("The deposit amount must be greater than 0",async function()
    {
      await expect(Lending.deposit({value:0})).to.be.revertedWith("Amount deposited must be greater than 0")
    })

    it("The amount of the depositor increase", async function(){
      await Lending.deposit({from:deployer,value:amount})
      const amountDeposited = await Lending.getBalanceDeposited(deployer)
      assert.equal(tokenAmount.toString(),amountDeposited.toString())
    }) 
  })

  describe("Borrow",async function(){
    it("User cannot borrow 0 amount",async function(){
      await expect(Lending.borrow(0)).to.be.revertedWith("You cannot borrow 0");
    })

    it("User cannot borrow unless he deposited twice",async function(){
      await Lending.deposit({from:deployer,value:amount})
      await expect(Lending.borrow(tokenAmount)).to.be.revertedWith("You must deposit twice")
    })

    it("User borrow",async function(){
      await Lending.deposit({from:deployer,value:amount})
      await tokenA.approve(Lending.address,tokenAmountHalf)
      await Lending.borrow(tokenAmountHalf,{from:deployer})
      const amountBorrowed = await Lending.getBalanceBorrowed(deployer)
      assert.equal(amountBorrowed.toString(),tokenAmountHalf.toString())
    })
  })

  describe("Get token A back",async function(){
    it("User cannot getTokanABack if they have not borrow",async function(){
      await expect(Lending.getTokenABack()).to.be.revertedWith("You have not borrowed anything")
    })
    it("User has tokenB has been transfer",async function()
    {
      await Lending.deposit({from:deployer,value:amount})
      await tokenA.approve(Lending.address,tokenAmountHalf)
      await Lending.borrow(tokenAmountHalf,{from:deployer})
      await tokenB.approve(Lending.address,tokenAmountHalf)
      await Lending.getTokenABack()
      const after = await Lending.getBalanceBorrowed(deployer)
      assert.equal(after.toString(),0)
      
    })
  })

  describe("Get Eth Back",async function(){
    it("User has 0 tokenA after getting back eth",async function(){
      await Lending.deposit({from:deployer,value:amount})
      await tokenA.approve(Lending.address,tokenAmountHalf)
      await Lending.borrow(tokenAmountHalf,{from:deployer})
      await tokenB.approve(Lending.address,tokenAmountHalf)
      await Lending.getTokenABack()
      await tokenA.approve(Lending.address,tokenAmount)
      await Lending.getEthBack()
      const tokenAafter = await tokenA.balanceOf(deployer)
      assert.equal(tokenAafter.toString(),0)
    })
  })

})