//This runs in the background and sends messages to the content script 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log(tab)
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1]
      //console.log(typeof queryParameters) so it is a string here
      const urlParameters = new URLSearchParams(queryParameters) 
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      })

    }
}) 
  