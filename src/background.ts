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
  chrome?.browserAction?.setBadgeText({ text: Math.trunc(Number(gasPriceInGwei)) + '' });

  chrome.storage.local.get('notificationGas', (result) => {
    if (Number(gasPriceInGwei) < Number(result.notificationGas)) {
      console.log(`gasPriceInGwei < result.notificationGas!`)
      chrome.notifications.create('lowGas', {
        type: 'basic',
        iconUrl: '../assets/icon.png',
        title: 'Gas Price Alert',
        message: `Gas price is lower than ${result.notificationGas} Gwei`
      });
    }
  })
}

checkGasPrice()
const checkGap = 1 * 60 // check every 5 minutes
const asyncSetInterval = async (fn: any, delay = 40 * 1e3) => {
  try {
    await fn();
  } catch (err) {
    console.log(err)
  }
  setTimeout(() => {
    asyncSetInterval(fn, delay);
  }, delay)
}

asyncSetInterval(checkGasPrice, checkGap * 1e3);
