let tabInfo = null;
let tabId = null;

const quickReply1 = document.querySelector("#reply-1");
const quickReply2 = document.querySelector("#reply-2");
const quickReply3 = document.querySelector("#reply-3");
const quickReply4 = document.querySelector("#reply-4");
const quickReply5 = document.querySelector("#reply-5");
const quickReply6 = document.querySelector("#reply-6");

function setDefaultData() {
  chrome.storage.sync.get(
    [
      "quickReplyData1",
      "quickReplyData2",
      "quickReplyData3",
      "quickReplyData4",
      "quickReplyData5",
      "quickReplyData6",
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
      if (data?.quickReplyData5) {
        quickReply5.value = data.quickReplyData5;
      }
      if (data?.quickReplyData6) {
        quickReply6.value = data.quickReplyData6;
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

  quickReply5.addEventListener("change", (e) => {
    let quickReplyData5 = e.target.value;
    chrome.storage.sync.set({ quickReplyData5 });
  });

  quickReply6.addEventListener("change", (e) => {
    let quickReplyData6 = e.target.value;
    chrome.storage.sync.set({ quickReplyData6 });
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
