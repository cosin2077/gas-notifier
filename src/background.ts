import { ethers } from 'ethers';

const apiList = [
  "https://eth-mainnet.g.alchemy.com/v2/3tZewOsSuJNKZq9CTdykN5fstJ7Dc-xE",
  "https://eth-mainnet.public.blastapi.io/",
  "https://cloudflare-eth.com/",
  "https://rpc.ankr.com/eth",
]
const randomRpc = () => apiList[Math.trunc(Math.random() * apiList.length) % apiList.length]
async function checkGasPrice() {

  const provider = new ethers.providers.JsonRpcProvider(randomRpc())
  console.log('checkGasPrice...')
  const gasPrice = await provider.getGasPrice();
  const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
  const result = await chrome.storage.local.get('notificationGas')
  console.log("Value currently is ", result.notificationGas);
  chrome.action.setBadgeText({ text: Math.trunc(Number(gasPriceInGwei)) + '' });
  if (result.notificationGas) {

  }
}

checkGasPrice()
const asyncSetInterval = async (fn: any, delay = 40 * 1e3) => {
  await fn();
  setTimeout(() => {
    asyncSetInterval(checkGasPrice, 30 * 1e3);
  }, delay)
}
asyncSetInterval(checkGasPrice, 30 * 1e3);
