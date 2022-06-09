chrome.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  const tabId = sender.tab.id
  if (request?.action == 'close_tab') {
    chrome.tabs.remove(tabId)
  } 
})
