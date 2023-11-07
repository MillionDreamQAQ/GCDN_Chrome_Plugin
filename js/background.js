let tabInfo = null;
let tabId = null;

let moveTargetSpace = null;
let moveTargetStatus = null;

let changeStatusTargetStatus = null;

let replySelectionIndex = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query(
    { active: true, lastFocusedWindow: true, currentWindow: true },
    function (tabs) {
      tabInfo = tabs[0];
      tabId = tabInfo.id;
    }
  );
});

/******************************************************************************* */

chrome.runtime.onInstalled.addListener(() => {
  let quickReplyParent = chrome.contextMenus.create({
    id: "quick_reply_parent",
    type: "normal",
    title: "快速回复",
  });

  chrome.contextMenus.create({
    id: "quick_reply1",
    type: "normal",
    title: "快速回复1",
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply2",
    type: "normal",
    title: "快速回复2",
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply3",
    type: "normal",
    title: "快速回复3",
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply4",
    type: "normal",
    title: "快速回复4",
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "search_crm",
    title: "使用CRM搜索：%s",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "search",
    title: "使用JIRA搜索：%s",
    contexts: ["selection"],
  });

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
    id: "help_query",
    type: "normal",
    title: "调研中",
    parentId: helpParent,
  });

  chrome.contextMenus.create({
    id: "help_done",
    type: "normal",
    title: "已处理",
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
    id: "bug_query",
    type: "normal",
    title: "调研中",
    parentId: bugParent,
  });

  chrome.contextMenus.create({
    id: "bug_done",
    type: "normal",
    title: "已处理",
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
    id: "story_query",
    type: "normal",
    title: "调研中",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_done",
    type: "normal",
    title: "已处理",
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
    id: "query",
    type: "normal",
    title: "调研中",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "done",
    type: "normal",
    title: "已处理",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "close",
    type: "normal",
    title: "结贴",
  });

  chrome.contextMenus.create({
    id: "remove_reward",
    type: "normal",
    title: "移除悬赏",
  });

  chrome.contextMenus.create({
    id: "notebook",
    title: "进入我的笔记本",
  });
});

chrome.contextMenus.onClicked.addListener(contextClick);
async function contextClick(info, tab) {
  tabInfo = tab;
  tabId = tabInfo.id;
  switch (info.menuItemId) {
    case "search":
      let text = info.selectionText;
      if (text.indexOf("(") != -1 || text.indexOf(")") != -1) {
        text = text.replaceAll("(", "");
        text = text.replaceAll(")", "");
      }
      if (text.indexOf("（") != -1 || text.indexOf("）") != -1) {
        text = text.replaceAll("（", "");
        text = text.replaceAll("）", "");
      }
      if (text.indexOf("[") != -1 || text.indexOf("]") != -1) {
        text = text.replaceAll("[", "");
        text = text.replaceAll("]", "");
      }
      if (text.indexOf("【") != -1 || text.indexOf("】") != -1) {
        text = text.replaceAll("【", "");
        text = text.replaceAll("】", "");
      }

      chrome.tabs.create({
        url: "https://grapecity.atlassian.net/browse/" + encodeURI(text),
      });
      break;

    case "search_crm":
      chrome.tabs.create({
        url:
          "https://developersolutions.crm5.dynamics.com/main.aspx?appid=69dffb8e-ae36-e811-817f-e0071b6927a1&forceUCI=1&pagetype=search&searchText=" +
          encodeURI(info.selectionText) +
          "&searchType=0",
      });
      break;

    case "notebook":
      chrome.tabs.create({
        url: "http://xa-gcscn-sys/gc_worksupport/%E5%94%AE%E5%90%8E%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2",
      });
      break;

    /********************************************************************** */

    case "story_waiting":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "未处理";
      await handleMoveButtonClick(tabId);
      break;
    case "story_doing":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "处理中";
      await handleMoveButtonClick(tabId);
      break;
    case "story_done":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "已处理";
      await handleMoveButtonClick(tabId);
      break;
    case "story_query":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "调研中";
      await handleMoveButtonClick(tabId);
      break;

    /********************************************************************** */

    case "bug_waiting":
      moveTargetSpace = "Bug反馈";
      moveTargetStatus = "未处理";
      await handleMoveButtonClick(tabId);
      break;
    case "bug_doing":
      moveTargetSpace = "Bug反馈";
      moveTargetStatus = "处理中";
      await handleMoveButtonClick(tabId);
      break;
    case "bug_done":
      moveTargetSpace = "Bug反馈";
      moveTargetStatus = "已处理";
      await handleMoveButtonClick(tabId);
      break;
    case "bug_query":
      moveTargetSpace = "Bug反馈";
      moveTargetStatus = "调研中";
      await handleMoveButtonClick(tabId);
      break;

    /********************************************************************** */

    case "help_waiting":
      moveTargetSpace = "求助中心";
      moveTargetStatus = "未处理";
      await handleMoveButtonClick(tabId);
      break;
    case "help_doing":
      moveTargetSpace = "求助中心";
      moveTargetStatus = "处理中";
      await handleMoveButtonClick(tabId);
      break;
    case "help_done":
      moveTargetSpace = "求助中心";
      moveTargetStatus = "已处理";
      await handleMoveButtonClick(tabId);
      break;
    case "help_query":
      moveTargetSpace = "求助中心";
      moveTargetStatus = "调研中";
      await handleMoveButtonClick(tabId);
      break;

    /********************************************************************** */

    case "waiting":
      changeStatusTargetStatus = "未处理";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "doing":
      changeStatusTargetStatus = "处理中";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "done":
      changeStatusTargetStatus = "已处理";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "query":
      changeStatusTargetStatus = "调研中";
      await handleChangeStatusButtonClick(tabId);
      break;

    /********************************************************************** */

    case "close":
      await handleCloseButtonClick(tabId);
      break;

    /********************************************************************** */

    case "remove_reward":
      await handleRemoveRewardButtonClick(tabId);
      break;

    /********************************************************************** */

    case "quick_reply1":
      replySelectionIndex = 1;
      await handleQuickReplay(tabId);
      break;

    case "quick_reply2":
      replySelectionIndex = 2;
      await handleQuickReplay(tabId);
      break;

    case "quick_reply3":
      replySelectionIndex = 3;
      await handleQuickReplay(tabId);
      break;

    case "quick_reply4":
      replySelectionIndex = 4;
      await handleQuickReplay(tabId);
      break;

    /********************************************************************** */

    default:
      break;
  }
}

/******************************************************************************* */

chrome.runtime.onMessage.addListener(messageReceived);
function messageReceived(data) {
  switch (data.msg) {
    case changeStatus:
      tabInfo = data.tab[0];
      tabId = tabInfo.id;
      changeStatusTargetStatus = data.status;
      handleChangeStatusButtonClick(tabId);
      break;

    case move:
      tabInfo = data.tab[0];
      tabId = tabInfo.id;
      moveTargetSpace = data.space;
      moveTargetStatus = data.status;
      handleMoveButtonClick(tabId);
      break;

    case close:
      tabInfo = data.tab[0];
      tabId = tabInfo.id;
      handleCloseButtonClick(tabId);
      break;

    default:
      break;
  }
}

/******************************************************************************* */

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "move_to_bug_query":
      moveTargetSpace = "Bug反馈";
      changeStatusTargetStatus = "调研中";
      handleMoveButtonClick(tabId);
      break;

    case "remove_rewards":
      handleRemoveRewardButtonClick(tabId);
      break;

    case "set_done":
      changeStatusTargetStatus = "已处理";
      handleChangeStatusButtonClick(tabId);
      break;

    case "close":
      handleCloseButtonClick(tabId);
      break;

    default:
      break;
  }
});

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
    case "调研中":
      statusSelect.options.selectedIndex = offset + 2;
      break;
    case "已处理":
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
    case "调研中":
      statusSelect.options.selectedIndex = offset + 2;
      break;
    case "已处理":
      statusSelect.options.selectedIndex = offset + 3;
      break;
    default:
      break;
  }
}

/******************************************************************************* */

async function handleCloseButtonClick(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: close_stage0,
  });

  await sleep(1000);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: close_stage1,
  });

  await sleep(500);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function close_stage0() {
  let closeButton = document.querySelector("#modmenu > a:nth-child(15)");
  closeButton.click();
}

function close_stage1() {
  let closeCheckBox = document.querySelector(
    "#moderateform > div > table > tbody > tr:nth-child(2) > td > ul > li:nth-child(2) > label"
  );
  closeCheckBox.click();
}

/******************************************************************************* */

async function handleRemoveRewardButtonClick(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: remove_stage0,
  });

  await sleep(500);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function remove_stage0() {
  let removeButton = document.querySelector("#modmenu > a:nth-child(29)");
  removeButton.click();
}

/******************************************************************************* */

async function handleQuickReplay(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: quick_reply,
    args: [getReplySelectionIndex()],
  });
}

function quick_reply(index) {
  let textArea = document.querySelector("#fastpostmessage");
  if (textArea) {
    switch (index) {
      case 1:
        chrome.storage.sync.get("quickReplyData1", (data) => {
          textArea.value += data.quickReplyData1;
        });
        break;
      case 2:
        chrome.storage.sync.get("quickReplyData2", (data) => {
          textArea.value += data.quickReplyData2;
        });
        break;
      case 3:
        chrome.storage.sync.get("quickReplyData3", (data) => {
          textArea.value += data.quickReplyData3;
        });
        break;
      case 4:
        chrome.storage.sync.get("quickReplyData4", (data) => {
          textArea.value += data.quickReplyData4;
        });
        break;
      default:
        break;
    }
  } else {
    alert("未找到指定元素！(#fastpostmessage)");
  }
}

/******************************************************************************* */

function submit(tabId) {
  chrome.storage.sync.get("manual", (data) => {
    let res = data.manual;

    if (!res) {
      let confirmButton = document.querySelector("#modsubmit");
      confirmButton.click();
    }
  });
}

function getReplySelectionIndex() {
  return replySelectionIndex;
}

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

/******************************************************************************* */

chrome.storage.sync.get(["notifyTime"], function (result) {
  if (result["notifyTime"] === undefined || result["notifyTime"] === null) {
    chrome.storage.sync.set({ notifyTime: "0" });
  }
});
chrome.storage.sync.get(["updateTime"], function (result) {
  if (result["updateTime"] === undefined || result["updateTime"] === null) {
    chrome.storage.sync.set({ updateTime: "0" });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(["notifyTime", "updateTime"], function (result) {
    if (result?.notifyTime) {
      let notifyTime = parseFloat(result.notifyTime);
      if (notifyTime > 0) {
        chrome.alarms.create("UserReplyTimer", { periodInMinutes: notifyTime });
      }
    }
    if (result?.updateTime) {
      let updateTime = parseFloat(result.updateTime);
      if (updateTime > 0) {
        chrome.alarms.create("UpdateCountTimer", {
          periodInMinutes: updateTime,
        });
      }
    }
  });
});

function getForumDataUser(isNotify) {
  fetch("https://gcdn.grapecity.com.cn/api/forummasterreply.php", {
    mode: "no-cors",
  })
    .then((response) => response.json())
    .then((resp) => {
      if (Array.isArray(resp) && resp.length) {
        chrome.storage.sync.get(["board"], function (result) {
          if (result?.board) {
            let board = result.board.split(",");
            resp = resp.filter((topic) => board.includes(topic.fid));
          }
          notificationUser(isNotify, resp.length);
        });
      }
      chrome.action.setBadgeText({ text: "" });
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

function notificationUser(isNotify, unreadTopicCount) {
  chrome.runtime.sendMessage({ msg: "refresh" });

  chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 125] });
  chrome.action.setBadgeText({
    text: unreadTopicCount > 0 ? "" + unreadTopicCount : "",
  });

  if (isNotify && unreadTopicCount > 0) {
    let options = {
      type: "basic",
      iconUrl: "../images/icon.png",
      title: "GCDN提醒",
      message: "你关注的板块有" + unreadTopicCount + "个帖子需要处理",
    };
    chrome.notifications.clear("UserReplyNotification");
    chrome.notifications.create("UserReplyNotification", options);
  }
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "UserReplyTimer") {
    getForumDataUser(true);
  } else if (alarm.name === "UpdateCountTimer") {
    getForumDataUser(false);
  }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId === "UserReplyNotification") {
    chrome.tabs.create(
      { url: chrome.runtime.getURL("index.html") },
      function (tab) {
        console.log(tab);
      }
    );
  }
});

(function (window) {
  window.setInterval(function () {
    let refreshHours = new Date().getHours();
    let refreshMin = new Date().getMinutes();
    let refreshSec = new Date().getSeconds();
    if (refreshHours == "12" && refreshMin == "0" && refreshSec == "0") {
      chrome.notifications.clear("EmailNotification");
      chrome.notifications.create("EmailNotification", {
        type: "basic",
        iconUrl: "../images/warn.png",
        title: "授权发送提醒",
        message: "客户很着急，请检查是否还有未发送的授权，谢谢！",
        requireInteraction: true,
      });
    }
    if (refreshHours == "17" && refreshMin == "30" && refreshSec == "0") {
      chrome.notifications.clear("EmailNotification");
      chrome.notifications.create("EmailNotification", {
        type: "basic",
        iconUrl: "../images/warn.png",
        title: "授权发送提醒",
        message: "客户很着急，请检查是否还有未发送的授权，谢谢！",
        requireInteraction: true,
      });
    }
  }, 1000);
})(this);
