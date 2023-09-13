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
      tabId = tabInfo.id;
    }
  );
});

chrome.runtime.onInstalled.addListener(() => {
  let moveParent = chrome.contextMenus.create({
    id: "move",
    type: "normal",
    title: "移动帖子",
  });

  let helpParent = chrome.contextMenus.create({
    id: "help",
    type: "normal",
    title: "求助中心",
    parentId: moveParent,
  });

  chrome.contextMenus.create({
    id: "help_waiting",
    type: "normal",
    title: "未处理",
    parentId: helpParent,
  });

  chrome.contextMenus.create({
    id: "help_doing",
    type: "normal",
    title: "处理中",
    parentId: helpParent,
  });

  chrome.contextMenus.create({
    id: "help_done",
    type: "normal",
    title: "已处理",
    parentId: helpParent,
  });

  chrome.contextMenus.create({
    id: "help_query",
    type: "normal",
    title: "保留处理",
    parentId: helpParent,
  });

  let bugParent = chrome.contextMenus.create({
    id: "bug",
    type: "normal",
    title: "Bug反馈",
    parentId: moveParent,
  });

  chrome.contextMenus.create({
    id: "bug_waiting",
    type: "normal",
    title: "未处理",
    parentId: bugParent,
  });

  chrome.contextMenus.create({
    id: "bug_doing",
    type: "normal",
    title: "处理中",
    parentId: bugParent,
  });

  chrome.contextMenus.create({
    id: "bug_done",
    type: "normal",
    title: "已处理",
    parentId: bugParent,
  });

  chrome.contextMenus.create({
    id: "bug_query",
    type: "normal",
    title: "保留处理",
    parentId: bugParent,
  });

  let storyParent = chrome.contextMenus.create({
    id: "story",
    type: "normal",
    title: "产品需求",
    parentId: moveParent,
  });

  chrome.contextMenus.create({
    id: "story_waiting",
    type: "normal",
    title: "未处理",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_doing",
    type: "normal",
    title: "处理中",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_done",
    type: "normal",
    title: "已处理",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_query",
    type: "normal",
    title: "保留处理",
    parentId: storyParent,
  });

  let changeParent = chrome.contextMenus.create({
    id: "changeParent",
    type: "normal",
    title: "更改帖子状态",
  });

  chrome.contextMenus.create({
    id: "waiting",
    type: "normal",
    title: "未处理",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "doing",
    type: "normal",
    title: "处理中",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "done",
    type: "normal",
    title: "已处理",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "query",
    type: "normal",
    title: "保留处理",
    parentId: changeParent,
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
    tabInfo = data.tab[0];
    tabId = tabId.id;
    changeStatusTargetStatus = data.status;
    handleChangeStatusButtonClick(tabId);
  } else if (data.msg == "move") {
    tabInfo = data.tab[0];
    tabId = tabId.id;
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
