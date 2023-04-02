import { ethers } from 'ethers';

import './common'

const apiList = [
  "https://eth-mainnet.g.alchemy.com/v2/3tZewOsSuJNKZq9CTdykN5fstJ7Dc-xE",
  "https://eth-mainnet.public.blastapi.io/",
  "https://cloudflare-eth.com/",
  "https://rpc.ankr.com/eth",
]
const randomRpc = () => apiList[Math.trunc(Math.random() * apiList.length) % apiList.length]
async function checkGasPrice() {

  try {
    const provider = new ethers.providers.JsonRpcProvider(randomRpc())
    console.log('checkGasPrice...')
    const gasPrice = await provider.getGasPrice();
    const gasPriceInGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
    console.log(`gasPriceInGwei: ${gasPriceInGwei}`)
    chrome?.action?.setBadgeText({ text: Math.trunc(Number(gasPriceInGwei)) + '' });

    const result = await chrome.storage.local.get('notificationGas')
    if (Number(gasPriceInGwei) < Number(result.notificationGas)) {
      console.log(`gasPriceInGwei < result.notificationGas!`)
      chrome.notifications.create('lowGas', {
        type: 'basic',
        iconUrl: '../assets/gas_128.png',
        title: 'Gas Price Alert',
        message: `Gas price:${Number(gasPriceInGwei).toFixed(0)} is lower than ${result.notificationGas} Gwei`
      });
    }
  } catch (err) {
    console.log((err as Error).message)
  }
}

checkGasPrice()
const checkGap = 3 * 60 // check every 3 minutes
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
console.log(`run background.ts`)
asyncSetInterval(checkGasPrice, checkGap * 1e3);

// const wakeUp = (name: string) => () => console.log(`[${name}]wake me up!`)
// chrome.webNavigation.onBeforeNavigate.addListener(wakeUp('onBeforeNavigate'));
// chrome.webNavigation.onHistoryStateUpdated.addListener(wakeUp('onHistoryStateUpdated'));

async function createOffscreen() {
  if (await (chrome as any).offscreen.hasDocument?.()) return;
  await (chrome as any).offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['BLOBS'],
    justification: 'keep service worker running',
  });
}
createOffscreen()
// chrome.runtime.onStartup.addListener(() => {
//   createOffscreen();
// });
chrome.runtime.onMessage.addListener(msg => {
  if (msg.keepAlive) console.log('keepAlive');
});
