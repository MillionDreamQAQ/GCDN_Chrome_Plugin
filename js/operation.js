let tabInfo = null;
let tabId = null;

const manualCheckBox = document.querySelector("#manual");

const closeButton = document.querySelector("#close");

const moveTargetSpace = document.querySelector("#moveTargetSpace");
const moveTargetStatus = document.querySelector("#moveTargetStatus");
const moveButton = document.querySelector("#move");

const changeStatusTargetStatus = document.querySelector(
  "#changeStatusTargetStatus"
);
const changeStatusButton = document.querySelector("#changeStatus");

const quickReply1 = document.querySelector("#reply-1");
const quickReply2 = document.querySelector("#reply-2");
const quickReply3 = document.querySelector("#reply-3");
const quickReply4 = document.querySelector("#reply-4");

function setDefaultData() {
  chrome.storage.sync.get(
    [
      "moveSpace",
      "moveStatus",
      "changeStatus",
      "manual",
      "quickReplyData1",
      "quickReplyData2",
      "quickReplyData3",
      "quickReplyData4",
    ],
    function (data) {
      console.log(data);
      if (data?.moveSpace) {
        moveTargetSpace.value = data.moveSpace;
      }
      if (data?.moveStatus) {
        moveTargetStatus.value = data.moveStatus;
      }
      if (data?.changeStatus) {
        changeStatusTargetStatus.value = data.changeStatus;
      }
      if (data?.manual) {
        manualCheckBox.checked = data.manual;
      }
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
  attachButtonEvent();
}

function attachChangedEvent() {
  moveTargetSpace.addEventListener("change", (e) => {
    let moveSpace = e.target.value;
    chrome.storage.sync.set({ moveSpace });
  });

  moveTargetStatus.addEventListener("change", (e) => {
    let moveStatus = e.target.value;
    chrome.storage.sync.set({ moveStatus });
  });

  changeStatusTargetStatus.addEventListener("change", (e) => {
    let changeStatus = e.target.value;
    chrome.storage.sync.set({ changeStatus });
  });

  manualCheckBox.addEventListener("change", (e) => {
    let manual = e.target.checked;
    chrome.storage.sync.set({ manual });
  });

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

function attachButtonEvent() {
  moveButton.addEventListener("click", async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    const space = getMoveTargetSpace();
    const status = getMoveTargetStatus();
    chrome.runtime.sendMessage({ msg: "move", tab, space, status });
  });

  changeStatusButton.addEventListener("click", async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    const status = getChangeStatusTargetStatus();
    chrome.runtime.sendMessage({ msg: "changeStatus", tab, status });
  });

  closeButton.addEventListener("click", async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.runtime.sendMessage({ msg: "close", tab });
  });
}

function getMoveTargetSpace() {
  let index = moveTargetSpace.selectedIndex;
  return moveTargetSpace.options[index].text;
}

function getMoveTargetStatus() {
  let index = moveTargetStatus.selectedIndex;
  return moveTargetStatus.options[index].text;
}

function getChangeStatusTargetStatus() {
  let index = changeStatusTargetStatus.selectedIndex;
  return changeStatusTargetStatus.options[index].text;
}

function getTabId() {
  return tabId;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setDefaultData();
attachEvent();
