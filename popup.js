let tabInfo = null;
let tabId = null;

const moveTargetSpace = document.querySelector("#moveTargetSpace");
const moveTargetStatus = document.querySelector("#moveTargetStatus");
const moveButton = document.querySelector("#move");

const changeStatusTargetStatus = document.querySelector(
  "#changeStatusTargetStatus"
);
const changeStatusButton = document.querySelector("#changeStatus");

const manualCheckBox = document.querySelector("#manual");

function setDefaultData() {
  chrome.storage.sync.get("moveSpace", (data) => {
    let res = data.moveSpace;
    moveTargetSpace.value = res;
  });

  chrome.storage.sync.get("moveStatus", (data) => {
    let res = data.moveStatus;
    moveTargetStatus.value = res;
  });

  chrome.storage.sync.get("changeStatus", (data) => {
    let res = data.changeStatus;
    changeStatusTargetStatus.value = res;
  });

  chrome.storage.sync.get("manual", (data) => {
    let res = data.manual;
    manualCheckBox.checked = res;
  });
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
