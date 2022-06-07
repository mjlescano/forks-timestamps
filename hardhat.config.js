const path = require('path')
const fs = require('fs/promises')
const { task } = require('hardhat/config');

require('dotenv/config')
require('@nomiclabs/hardhat-ethers')

const contractName = 'Timestamp';

task('deploy', async (_, hre) => {
  const factory = await hre.ethers.getContractFactory(contractName)
  const contract = await factory.deploy()

  console.log('Deploying ', contractName)
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)

  const deploymentPath = path.resolve(__dirname, 'deployments', `${hre.network.name}.json`)
  await fs.writeFile(
    deploymentPath,
    JSON.stringify({ [contractName]: contract.address }, null, 2)
  )
})

task('timestamps', async (_, hre) => {
  const deploymentPath = path.resolve(__dirname, 'deployments', `${hre.network.name}.json`)
  const deployment = require(deploymentPath)

  const Timestamp = await hre.ethers.getContractAt(contractName, deployment[contractName])

  const fromContract = (await Timestamp.getTimestamp()).toNumber()
  const fromProvider = (await hre.ethers.provider.getBlock()).timestamp

  console.log('Timestamps:', JSON.stringify({ fromContract,  fromProvider }, null, 2))
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ['optimistic-mainnet']: {
      url: 'https://mainnet.optimism.io',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    ['fork-ba617aa0-5f89-48b2-83b2-70be696b4359']: {
      url: 'https://rpc.tenderly.co/fork/ba617aa0-5f89-48b2-83b2-70be696b4359',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
}
