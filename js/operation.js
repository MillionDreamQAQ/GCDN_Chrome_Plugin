let tabInfo = null;
let tabId = null;

const quickReply1 = document.querySelector("#reply-1");
const quickReply2 = document.querySelector("#reply-2");
const quickReply3 = document.querySelector("#reply-3");
const quickReply4 = document.querySelector("#reply-4");

function setDefaultData() {
  chrome.storage.sync.get(
    [
      "quickReplyData1",
      "quickReplyData2",
      "quickReplyData3",
      "quickReplyData4",
    ],
    function (data) {
      if (data?.quickReplyData1) {
        quickReply1.value = data.quickReplyData1;
      }
      if (data?.quickReplyData2) {
        quickReply2.value = data.quickReplyData2;
      }
      if (data?.quickReplyData3) {
        quickReply3.value = data.quickReplyData3;
      }
      if (data?.quickReplyData4) {
        quickReply4.value = data.quickReplyData4;
      }
    }
  );
}

function attachEvent() {
  attachChangedEvent();
}

function attachChangedEvent() {
  quickReply1.addEventListener("change", (e) => {
    let quickReplyData1 = e.target.value;
    chrome.storage.sync.set({ quickReplyData1 });
  });

  quickReply2.addEventListener("change", (e) => {
    let quickReplyData2 = e.target.value;
    chrome.storage.sync.set({ quickReplyData2 });
  });

  quickReply3.addEventListener("change", (e) => {
    let quickReplyData3 = e.target.value;
    chrome.storage.sync.set({ quickReplyData3 });
  });

  quickReply4.addEventListener("change", (e) => {
    let quickReplyData4 = e.target.value;
    chrome.storage.sync.set({ quickReplyData4 });
  });
}

function getTabId() {
  return tabId;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setDefaultData();
attachEvent();
