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
  attachCheckBoxEvent();
  attachSelectEvent();
  attachButtonEvent();
}

function attachCheckBoxEvent() {
  manualCheckBox.addEventListener("change", (e) => {
    let manual = e.target.checked;
    chrome.storage.sync.set({ manual });
  });
}

function attachSelectEvent() {
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
}

function attachButtonEvent() {
  moveButton.addEventListener("click", async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    tabInfo = tab[0];
    tabId = tab[0].id;

    await chrome.scripting.executeScript({
      target: { tabId },
      func: move_stage0,
    });

    await sleep(800);
    await chrome.scripting.executeScript({
      target: { tabId },
      func: move_stage1,
      args: [getMoveTargetSpace()],
    });

    await sleep(800);
    await chrome.scripting.executeScript({
      target: { tabId },
      func: move_stage2,
      args: [getMoveTargetStatus()],
    });

    await sleep(500);
    await chrome.scripting.executeScript({
      target: { tabId },
      func: submit,
      args: [getTabId()],
    });
  });

  changeStatusButton.addEventListener("click", async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    tabInfo = tab[0];
    tabId = tab[0].id;

    await chrome.scripting.executeScript({
      target: { tabId },
      func: change_status_stage0,
    });

    await sleep(1000);
    await chrome.scripting.executeScript({
      target: { tabId },
      func: change_status_stage1,
      args: [getChangeStatusTargetStatus()],
    });

    await sleep(500);
    await chrome.scripting.executeScript({
      target: { tabId },
      func: submit,
    });
  });
}

function move_stage0() {
  let moveButton = document.querySelector("#modmenu > a:nth-child(17)");
  moveButton.click();
}

function getMoveTargetSpace() {
  let index = moveTargetSpace.selectedIndex;
  return moveTargetSpace.options[index].text;
}

function move_stage1(space) {
  let spaceSelect = document.querySelector("#moveto");

  switch (space) {
    case "求助中心":
      spaceSelect.options.selectedIndex = 23;
      break;
    case "Bug反馈":
      spaceSelect.options.selectedIndex = 27;
      break;
    case "产品需求":
      spaceSelect.options.selectedIndex = 26;
      break;
    default:
      break;
  }

  spaceSelect.dispatchEvent(new Event("change"));
}

function getMoveTargetStatus() {
  let index = moveTargetStatus.selectedIndex;
  return moveTargetStatus.options[index].text;
}

function move_stage2(status) {
  let statusSelect = document.querySelector("#threadtypes > select");
  let offset = 0;
  if (statusSelect.options.length == 5) {
    offset = 1;
  }
  switch (status) {
    case "未处理":
      statusSelect.options.selectedIndex = offset + 0;
      break;
    case "处理中":
      statusSelect.options.selectedIndex = offset + 1;
      break;
    case "已处理":
      statusSelect.options.selectedIndex = offset + 2;
      break;
    case "保留处理":
      statusSelect.options.selectedIndex = offset + 3;
      break;
    default:
      break;
  }
}

function change_status_stage0() {
  let moveButton = document.querySelector("#modmenu > a:nth-child(19)");
  moveButton.click();
}

function getChangeStatusTargetStatus() {
  let index = changeStatusTargetStatus.selectedIndex;
  return changeStatusTargetStatus.options[index].text;
}

function change_status_stage1(status) {
  let statusSelect = document.querySelector("#typeid");
  let offset = 0;
  if (statusSelect.options.length == 5) {
    offset = 1;
  }
  switch (status) {
    case "未处理":
      statusSelect.options.selectedIndex = offset + 0;
      break;
    case "处理中":
      statusSelect.options.selectedIndex = offset + 1;
      break;
    case "已处理":
      statusSelect.options.selectedIndex = offset + 2;
      break;
    case "保留处理":
      statusSelect.options.selectedIndex = offset + 3;
      break;
    default:
      break;
  }
}

function getTabId() {
  console.log(tabId);
  return tabId;
}

function submit(tabId) {
  chrome.storage.sync.get("manual", (data) => {
    let res = data.manual;

    if (!res) {
      let confirmButton = document.querySelector("#modsubmit");
      confirmButton.click();
    }
    
    console.log(tabInfo);
    // chrome.tabs.remove(tabId);
    // chrome.tabs.create()
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showOptions(element) {
  let mouseEvent = new MouseEvent("mousedown", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(mouseEvent);
}

setDefaultData();
attachEvent();
