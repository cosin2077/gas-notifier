setInterval(() => {
  chrome.runtime.sendMessage({ keepAlive: true });
}, 20 * 1e3);