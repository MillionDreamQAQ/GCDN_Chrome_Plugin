let tabInfo = null;
let tabId = null;

const quickReply1 = document.querySelector("#reply-1");
const quickReply2 = document.querySelector("#reply-2");
const quickReply3 = document.querySelector("#reply-3");
const quickReply4 = document.querySelector("#reply-4");
const quickReply5 = document.querySelector("#reply-5");
const quickReply6 = document.querySelector("#reply-6");

const quickReplyHint1 = document.querySelector("#reply-hint-1");
const quickReplyHint2 = document.querySelector("#reply-hint-2");
const quickReplyHint3 = document.querySelector("#reply-hint-3");
const quickReplyHint4 = document.querySelector("#reply-hint-4");
const quickReplyHint5 = document.querySelector("#reply-hint-5");
const quickReplyHint6 = document.querySelector("#reply-hint-6");

function setDefaultData() {
  chrome.storage.sync.get(
    [
      "quickReplyData1",
      "quickReplyData2",
      "quickReplyData3",
      "quickReplyData4",
      "quickReplyData5",
      "quickReplyData6",
      "quickReplyHintData1",
      "quickReplyHintData2",
      "quickReplyHintData3",
      "quickReplyHintData4",
      "quickReplyHintData5",
      "quickReplyHintData6",
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
      if (data?.quickReplyHintData1) {
        quickReplyHint1.value = data.quickReplyHintData1;
      }
      if (data?.quickReplyHintData2) {
        quickReplyHint2.value = data.quickReplyHintData2;
      }
      if (data?.quickReplyHintData3) {
        quickReplyHint3.value = data.quickReplyHintData3;
      }
      if (data?.quickReplyHintData4) {
        quickReplyHint4.value = data.quickReplyHintData4;
      }
      if (data?.quickReplyHintData5) {
        quickReplyHint5.value = data.quickReplyHintData5;
      }
      if (data?.quickReplyHintData6) {
        quickReplyHint6.value = data.quickReplyHintData6;
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

  quickReplyHint1.addEventListener("change", (e) => {
    let quickReplyHintData1 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData1 });
  });

  quickReplyHint2.addEventListener("change", (e) => {
    let quickReplyHintData2 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData2 });
  });

  quickReplyHint3.addEventListener("change", (e) => {
    let quickReplyHintData3 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData3 });
  });

  quickReplyHint4.addEventListener("change", (e) => {
    let quickReplyHintData4 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData4 });
  });

  quickReplyHint5.addEventListener("change", (e) => {
    let quickReplyHintData5 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData5 });
  });

  quickReplyHint6.addEventListener("change", (e) => {
    let quickReplyHintData6 = e.target.value;
    chrome.storage.sync.set({ quickReplyHintData6 });
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
