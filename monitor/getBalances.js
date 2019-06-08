const BN = require('bignumber.js')
const Web3 = require('web3')
const { BRIDGE_MODES } = require('./utils/bridgeMode')

const Web3Utils = Web3.utils


const ERC20_ABI = require('./abis/ERC20.abi')
const ERC677_ABI = require('./abis/ERC677.abi')
const HOME_ERC_TO_ERC_ABI = require('./abis/HomeBridgeErcToErc.abi')
const HOME_ERC_TO_NATIVE_ABI = require('./abis/HomeBridgeErcToNative.abi')
const BLOCK_REWARD_ABI = require('./abis/IBlockReward.abi')
const FOREIGN_ERC_TO_ERC_ABI = require('./abis/ForeignBridgeErcToErc.abi')
const FOREIGN_ERC_TO_NATIVE_ABI = require('./abis/ForeignBridgeErcToNative.abi')
const FOREIGN_NATIVE_TO_ERC_ABI = require('./abis/ForeignBridgeNativeToErc.abi')

function main({ HOME_RPC_URL, FOREIGN_RPC_URL, HOME_BRIDGE_ADDRESS, FOREIGN_BRIDGE_ADDRESS }) {
  return async function main(bridgeMode) {
    const homeProvider = new Web3.providers.HttpProvider(HOME_RPC_URL)
    const web3Home = new Web3(homeProvider)
    
    const foreignProvider = new Web3.providers.HttpProvider(FOREIGN_RPC_URL)
    const web3Foreign = new Web3(foreignProvider)

    try {
      if (bridgeMode === BRIDGE_MODES.ERC_TO_ERC) {
        const foreignBridge = new web3Foreign.eth.Contract(
          FOREIGN_ERC_TO_ERC_ABI,
          FOREIGN_BRIDGE_ADDRESS
        )
        const erc20Address = await foreignBridge.methods.erc20token().call()
        const erc20Contract = new web3Foreign.eth.Contract(ERC20_ABI, erc20Address)
        const foreignErc20Balance = await erc20Contract.methods
          .balanceOf(FOREIGN_BRIDGE_ADDRESS)
          .call()
        const homeBridge = new web3Home.eth.Contract(HOME_ERC_TO_ERC_ABI, HOME_BRIDGE_ADDRESS)
        const tokenAddress = await homeBridge.methods.erc677token().call()
        const tokenContract = new web3Home.eth.Contract(ERC677_ABI, tokenAddress)
        const totalSupply = await tokenContract.methods.totalSupply().call()
        const foreignBalanceBN = new BN(foreignErc20Balance)
        const foreignTotalSupplyBN = new BN(totalSupply)
        const diff = foreignBalanceBN.minus(foreignTotalSupplyBN).toString(10)
        return {
          home: {
            totalSupply: Web3Utils.fromWei(totalSupply)
          },
          foreign: {
            erc20Balance: Web3Utils.fromWei(foreignErc20Balance)
          },
          balanceDiff: Number(Web3Utils.fromWei(diff)),
          lastChecked: Math.floor(Date.now() / 1000)
        }
      } else if (bridgeMode === BRIDGE_MODES.NATIVE_TO_ERC) {
        const foreignBridge = new web3Foreign.eth.Contract(
          FOREIGN_NATIVE_TO_ERC_ABI,
          FOREIGN_BRIDGE_ADDRESS
        )
        const erc20Address = await foreignBridge.methods.erc677token().call()
        const homeBalance = await web3Home.eth.getBalance(HOME_BRIDGE_ADDRESS)
        const tokenContract = new web3Foreign.eth.Contract(ERC20_ABI, erc20Address)
        const totalSupply = await tokenContract.methods.totalSupply().call()
        const homeBalanceBN = new BN(homeBalance)
        const foreignTotalSupplyBN = new BN(totalSupply)
        const diff = homeBalanceBN.minus(foreignTotalSupplyBN).toString(10)
        return {
          home: {
            balance: Web3Utils.fromWei(homeBalance)
          },
          foreign: {
            totalSupply: Web3Utils.fromWei(totalSupply)
          },
          balanceDiff: Number(Web3Utils.fromWei(diff)),
          lastChecked: Math.floor(Date.now() / 1000)
        }
      } else if (bridgeMode === BRIDGE_MODES.ERC_TO_NATIVE) {
        const foreignBridge = new web3Foreign.eth.Contract(
          FOREIGN_ERC_TO_NATIVE_ABI,
          FOREIGN_BRIDGE_ADDRESS
        )
        const erc20Address = await foreignBridge.methods.erc20token().call()
        const erc20Contract = new web3Foreign.eth.Contract(ERC20_ABI, erc20Address)
        const foreignErc20Balance = await erc20Contract.methods
          .balanceOf(FOREIGN_BRIDGE_ADDRESS)
          .call()

        const homeBridge = new web3Home.eth.Contract(HOME_ERC_TO_NATIVE_ABI, HOME_BRIDGE_ADDRESS)
        const blockRewardAddress = await homeBridge.methods.blockRewardContract().call()
        const blockRewardContract = new web3Home.eth.Contract(BLOCK_REWARD_ABI, blockRewardAddress)
        const mintedCoins = await blockRewardContract.methods.mintedTotally().call()
        const burntCoins = await homeBridge.methods.totalBurntCoins().call()

        const mintedCoinsBN = new BN(mintedCoins)
        const burntCoinsBN = new BN(burntCoins)
        const totalSupplyBN = mintedCoinsBN.minus(burntCoinsBN)
        const foreignErc20BalanceBN = new BN(foreignErc20Balance)

        const diff = foreignErc20BalanceBN.minus(totalSupplyBN).toFixed()
        return {
          home: {
            totalSupply: Web3Utils.fromWei(totalSupplyBN.toFixed())
          },
          foreign: {
            erc20Balance: Web3Utils.fromWei(foreignErc20Balance)
          },
          balanceDiff: Number(Web3Utils.fromWei(diff)),
          lastChecked: Math.floor(Date.now() / 1000)
        }
      } else {
        throw new Error(`Unrecognized bridge mode: '${bridgeMode}'`)
      }
    } catch (e) {
      throw e
    }
  }
}

module.exports = main