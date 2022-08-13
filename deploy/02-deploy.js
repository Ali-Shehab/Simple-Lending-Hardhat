const { network, ethers } = require("hardhat")

const {getNamedAccounts,deployments} = hre 
module.exports = async(hre) =>{
    const {deploy } = deployments
    const {deployer } = await getNamedAccounts() //a way to get name account
    const tokenA = await deployments.get("TokenA")
    const tokenB = await deployments.get("TokenB")
    console.log(`Token A is on ${tokenA.address}`)
    console.log(`Token B is on ${tokenB.address}`)
    const Lending = await deploy("Lending",{
        from: deployer,
        args:[tokenA.address,tokenB.address]
    })

    console.log(`Deployed at ${Lending.address}`)
}

module.exports.tags = ["all"]