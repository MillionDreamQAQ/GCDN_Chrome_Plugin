let tabInfo = null;
let tabId = null;

const quickReplies = [
  document.querySelector("#reply-1"),
  document.querySelector("#reply-2"),
  document.querySelector("#reply-3"),
  document.querySelector("#reply-4"),
  document.querySelector("#reply-5"),
  document.querySelector("#reply-6")
];

const quickReplyHints = [
  document.querySelector("#reply-hint-1"),
  document.querySelector("#reply-hint-2"),
  document.querySelector("#reply-hint-3"),
  document.querySelector("#reply-hint-4"),
  document.querySelector("#reply-hint-5"),
  document.querySelector("#reply-hint-6")
];

const keys = [
  "quickReplyData1", "quickReplyData2", "quickReplyData3", "quickReplyData4", "quickReplyData5", "quickReplyData6",
  "quickReplyHintData1", "quickReplyHintData2", "quickReplyHintData3", "quickReplyHintData4", "quickReplyHintData5", "quickReplyHintData6"
];

function setDefaultData() {
  chrome.storage.sync.get(keys, function (data) {
    for (let i = 0; i < quickReplies.length; i++) {
      if (quickReplies[i] && data[`quickReplyData${i + 1}`]) {
        quickReplies[i].value = data[`quickReplyData${i + 1}`];
      }
      if (quickReplyHints[i] && data[`quickReplyHintData${i + 1}`]) {
        quickReplyHints[i].value = data[`quickReplyHintData${i + 1}`];
      }
    }
  });
}

function attachEvent() {
  attachChangedEvent();
}

function attachChangedEvent() {  
  for (let i = 0; i < quickReplies.length; i++) {
    const qr = quickReplies[i];
    if (qr) {
      qr.addEventListener("change", (e) => {
        let obj = {};
        obj[`quickReplyData${i + 1}`] = e.target.value;
        chrome.storage.sync.set(obj);
      });
    }
  }

  for (let i = 0; i < quickReplyHints.length; i++) {
    const qrHint = quickReplyHints[i];
    if (qrHint) {
      qrHint.addEventListener("change", (e) => {
        let obj = {};
        obj[`quickReplyHintData${i + 1}`] = e.target.value;
        chrome.storage.sync.set(obj);
      });
    }
  }
}

function getTabId() {
  return tabId;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setDefaultData();
attachEvent();
