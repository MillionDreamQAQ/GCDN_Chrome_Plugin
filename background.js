// let popup = chrome.runtime.getContexts({
//   contextTypes: ["POPUP"],
// });
// console.log(popup);

let tabInfo = null;
let tabId = null;

let moveTargetSpace = null;
let moveTargetStatus = null;

let changeStatusTargetStatus = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query(
    { active: true, lastFocusedWindow: true, currentWindow: true },
    function (tabs) {
      tabInfo = tabs[0];
      tabId = tabs[0].id;
    }
  );
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "move",
    type: "normal",
    title: "移动帖子",
  });

  chrome.contextMenus.create({
    id: "change",
    type: "normal",
    title: "更改帖子状态",
  });
});

chrome.contextMenus.onClicked.addListener(contextClick);
async function contextClick(info) {
  switch (info.menuItemId) {
    case "move":
      chrome.storage.sync.get("moveSpace", (data) => {
        moveTargetSpace = data.moveSpace;
      });
      chrome.storage.sync.get("moveStatus", (data) => {
        moveTargetStatus = data.moveStatus;
      });
      await handleMoveButtonClick(tabId);
      break;
    case "change":
      chrome.storage.sync.get("changeStatus", (data) => {
        changeStatusTargetStatus = data.changeStatus;
      });
      await handleChangeStatusButtonClick(tabId);
      break;
    default:
      break;
  }
}

chrome.runtime.onMessage.addListener(messageReceived);
function messageReceived(data) {
  if (data.msg == "changeStatus") {
    tabId = data.tab[0].id;
    tabInfo = data.tab[0];
    changeStatusTargetStatus = data.status;
    handleChangeStatusButtonClick(tabId);
  } else if (data.msg == "move") {
    tabId = data.tab[0].id;
    tabInfo = data.tab[0];
    moveTargetSpace = data.space;
    moveTargetStatus = data.status;
    handleMoveButtonClick(tabId);
  }
}

/******************************************************************************* */

async function handleMoveButtonClick(tabId) {
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
}

function move_stage0() {
  let moveButton = document.querySelector("#modmenu > a:nth-child(17)");
  moveButton.click();
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

/******************************************************************************* */

async function handleChangeStatusButtonClick(tabId) {
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
}

function change_status_stage0() {
  let moveButton = document.querySelector("#modmenu > a:nth-child(19)");
  moveButton.click();
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

function submit(tabId) {
  chrome.storage.sync.get("manual", (data) => {
    let res = data.manual;

    if (!res) {
      let confirmButton = document.querySelector("#modsubmit");
      confirmButton.click();
    }
  });
}

/******************************************************************************* */

function getMoveTargetSpace() {
  return moveTargetSpace;
}

function getMoveTargetStatus() {
  return moveTargetStatus;
}

function getChangeStatusTargetStatus() {
  return changeStatusTargetStatus;
}

function getTabId() {
  return tabId;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
