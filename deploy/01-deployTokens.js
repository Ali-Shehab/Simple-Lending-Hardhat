const { ethers } = require("hardhat")

const {deployments,getNamedAccounts} = hre 

module.exports = async(hre) =>{
    const {deploy } = deployments
    const {deployer } = await getNamedAccounts() //a way to get name account
    const value = ethers.utils.parseEther("1000")
    const tokenA = await deploy("TokenA",{
        from: deployer,
        args:[value]
    })
    const tokenB = await deploy("TokenB",{
        from: deployer,
        args:[value]
    })
    
}

module.exports.tags = ["all"]