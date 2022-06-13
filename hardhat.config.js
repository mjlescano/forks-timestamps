const path = require('path')
const fs = require('fs/promises')
const { task } = require('hardhat/config');

require('dotenv/config')
require('@nomiclabs/hardhat-ethers')

const contractName = 'Timestamp';

const getDeploymentPath = (hre) =>
  path.resolve(__dirname, 'deployments', `${hre.network.name}.json`)

task('deploy', async (_, hre) => {
  const factory = await hre.ethers.getContractFactory(contractName)
  const contract = await factory.deploy()

  console.log('Deploying ', contractName)
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)

  const deploymentPath = getDeploymentPath(hre)
  await fs.writeFile(
    deploymentPath,
    JSON.stringify({ [contractName]: contract.address }, null, 2)
  )
})

task('timestamps', async (_, hre) => {
  const deployment = require(getDeploymentPath(hre))

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
  },
}
