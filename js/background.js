let defaultSleepTime = 1500;

let tabInfo = null;
let tabId = null;

let moveTargetSpace = null;
let moveTargetStatus = null;

let changeStatusTargetStatus = null;

let replySelectionIndex = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("LOG: chrome.tabs.onActivated -> activeInfo", activeInfo);
  chrome.tabs.query(
    { active: true, lastFocusedWindow: true, currentWindow: true },
    function (tabs) {
      if (!tabs) {
        console.error("DEBUG: chrome.tabs.query -> tabs", tabs);
      }
      console.log("LOG: chrome.tabs.query -> tabs", tabs);
      tabInfo = tabs[0];
      tabId = tabInfo.id;
    }
  );
});

/******************************************************************************* */
let hints = [];

const hintKeys = [
  "quickReplyHintData1",
  "quickReplyHintData2",
  "quickReplyHintData3",
  "quickReplyHintData4",
  "quickReplyHintData5",
  "quickReplyHintData6",
];

chrome.storage.sync.get(hintKeys, function (data) {
  hintKeys.forEach((key, index) => {
    if (data?.[key]) {
      hints[index] = data[key];
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "search_crm",
    title: "使用CRM搜索：%s",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "search_jira",
    title: "使用JIRA搜索：%s",
    contexts: ["selection"],
  });

  let quickReplyParent = chrome.contextMenus.create({
    id: "quick_reply_parent",
    type: "normal",
    title: "快速回复",
  });

  chrome.contextMenus.create({
    id: "quick_reply1",
    type: "normal",
    title: hints[0],
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply2",
    type: "normal",
    title: hints[1],
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply3",
    type: "normal",
    title: hints[2],
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply4",
    type: "normal",
    title: hints[3],
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply5",
    type: "normal",
    title: hints[4],
    parentId: quickReplyParent,
  });

  chrome.contextMenus.create({
    id: "quick_reply6",
    type: "normal",
    title: hints[5],
    parentId: quickReplyParent,
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
    id: "story_communication",
    type: "normal",
    title: "沟通中",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_adopt",
    type: "normal",
    title: "已采纳",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_support",
    type: "normal",
    title: "已支持",
    parentId: storyParent,
  });

  chrome.contextMenus.create({
    id: "story_reserve",
    type: "normal",
    title: "暂不采纳",
    parentId: storyParent,
  });

  let changeParent = chrome.contextMenus.create({
    id: "change-parent",
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
    id: "communicate",
    type: "normal",
    title: "沟通中",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "query",
    type: "normal",
    title: "调研中",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "adopt",
    type: "normal",
    title: "已采纳",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "done",
    type: "normal",
    title: "已处理",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "support",
    type: "normal",
    title: "已支持",
    parentId: changeParent,
  });

  chrome.contextMenus.create({
    id: "reserve",
    type: "normal",
    title: "暂不采纳",
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
    id: "move_bug_query",
    title: "移至Bug板块调研中",
  });
});

chrome.contextMenus.onClicked.addListener(contextClick);
async function contextClick(info, tab) {
  tabInfo = tab;
  tabId = tabInfo.id;
  let text = info.selectionText;
  switch (info.menuItemId) {
    case "search_jira":
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

    /********************************************************************** */

    case "story_waiting":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "未处理";
      await handleMoveButtonClick(tabId);
      break;
    case "story_communication":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "沟通中";
      await handleMoveButtonClick(tabId);
      break;
    case "story_adopt":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "已采纳";
      await handleMoveButtonClick(tabId);
      break;
    case "story_support":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "已支持";
      await handleMoveButtonClick(tabId);
      break;
    case "story_reserve":
      moveTargetSpace = "产品需求";
      moveTargetStatus = "暂不采纳";
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
    case "move_bug_query":
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
    case "communicate":
      changeStatusTargetStatus = "沟通中";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "adopt":
      changeStatusTargetStatus = "已采纳";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "done":
      changeStatusTargetStatus = "已处理";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "support":
      changeStatusTargetStatus = "已支持";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "query":
      changeStatusTargetStatus = "调研中";
      await handleChangeStatusButtonClick(tabId);
      break;
    case "reserve":
      changeStatusTargetStatus = "暂不采纳";
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

    case "quick_reply5":
      replySelectionIndex = 5;
      await handleQuickReplay(tabId);
      break;

    case "quick_reply6":
      replySelectionIndex = 6;
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
      moveTargetStatus = "调研中";
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

  // below is the code which is open dialog, so need use interval to check if the dialog open.
  await chrome.scripting.executeScript({
    target: { tabId },
    func: move_stage1,
    args: [getMoveTargetSpace()],
  });

  await sleep(defaultSleepTime);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: move_stage2,
    args: [getMoveTargetStatus()],
  });

  await sleep(defaultSleepTime);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function move_stage0() {
  let moveButton = document.querySelector("#modmenu > a:nth-child(17)");
  if (!moveButton || moveButton.innerHTML != "移动") {
    alert("未找到移动按钮！");
    return;
  }
  moveButton.click();
}

function move_stage1(space) {
  let selector = "#moveto";
  let intervalId = setInterval(() => {
    let element = document.querySelector(selector);
    console.log(`Checking ${selector} element...`);

    if (element) {
      clearInterval(intervalId);

      switch (space) {
        case "求助中心":
          element.options.selectedIndex = 22;
          break;
        case "Bug反馈":
          element.options.selectedIndex = 26;
          break;
        case "产品需求":
          element.options.selectedIndex = 25;
          break;
        default:
          break;
      }

      element.dispatchEvent(new Event("change"));
    }
  }, 500);
}

function move_stage2(status) {
  let statusSelect = document.querySelector("#threadtypes > select");
  let offset = 0;
  if (
    statusSelect.options.length === 5 &&
    statusSelect.options[0].innerHTML !== "未处理"
  ) {
    offset = 1;
  }
  switch (status) {
    case "未处理":
      statusSelect.options.selectedIndex = offset + 0;
      break;
    case "处理中":
    case "沟通中":
      statusSelect.options.selectedIndex = offset + 1;
      break;
    case "调研中":
    case "已采纳":
      statusSelect.options.selectedIndex = offset + 2;
      break;
    case "已处理":
    case "已支持":
      statusSelect.options.selectedIndex = offset + 3;
      break;
    case "暂不采纳":
      statusSelect.options.selectedIndex = offset + 4;
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

  // below is the code which is open dialog, so need use interval to check if the dialog open.
  await chrome.scripting.executeScript({
    target: { tabId },
    func: change_status_stage1,
    args: [getChangeStatusTargetStatus()],
  });

  await sleep(defaultSleepTime);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function change_status_stage0() {
  let statusButton = document.querySelector("#modmenu > a:nth-child(19)");
  if (!statusButton || statusButton.innerHTML != "分类") {
    alert("分类按钮未找到！");
    return;
  }
  statusButton.click();
}

function change_status_stage1(status) {
  let selector = "#typeid";
  let intervalId = setInterval(() => {
    let element = document.querySelector(selector);
    console.log(`Checking ${selector} element...`);

    if (element) {
      clearInterval(intervalId);

      let offset = 0;
      if (element.options.length >= 5) {
        offset = 1;
      }
      switch (status) {
        case "未处理":
          element.options.selectedIndex = offset + 0;
          break;
        case "处理中":
        case "沟通中":
          element.options.selectedIndex = offset + 1;
          break;
        case "调研中":
        case "已采纳":
          element.options.selectedIndex = offset + 2;
          break;
        case "已处理":
        case "已支持":
          element.options.selectedIndex = offset + 3;
          break;
        case "暂不采纳":
          element.options.selectedIndex = offset + 4;
          break;
        default:
          break;
      }
    }
  }, 500);
}

/******************************************************************************* */

async function handleCloseButtonClick(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: close_stage0,
  });

  // below is the code which is open dialog, so need use interval to check if the dialog open.
  await chrome.scripting.executeScript({
    target: { tabId },
    func: close_stage1,
  });

  await sleep(defaultSleepTime);
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function close_stage0() {
  let closeButton = document.querySelector("#modmenu > a:nth-child(15)");
  if (!closeButton || closeButton.innerHTML != "关闭") {
    alert("关闭按钮未找到！");
    return;
  }
  closeButton.click();
}

function close_stage1() {
  let selector =
    "#moderateform > div > table > tbody > tr:nth-child(2) > td > ul > li:nth-child(2) > label";
  let intervalId = setInterval(() => {
    let element = document.querySelector(selector);
    console.log(`Checking ${selector} element...`);

    if (element) {
      clearInterval(intervalId);

      element.click();
    }
  }, 500);
}

/******************************************************************************* */

async function handleRemoveRewardButtonClick(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: remove_stage0,
  });

  // below is the code which is open dialog, so need use interval to check if the dialog open.
  await chrome.scripting.executeScript({
    target: { tabId },
    func: submit,
  });
}

function remove_stage0() {
  let removeButton = document.querySelector("#modmenu > a:nth-child(29)");
  if (!removeButton || removeButton.innerHTML != "移除悬赏") {
    alert("移除悬赏按钮未找到！");
    return;
  }
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
      case 5:
        chrome.storage.sync.get("quickReplyData5", (data) => {
          textArea.value += data.quickReplyData5;
        });
        break;
      case 6:
        chrome.storage.sync.get("quickReplyData6", (data) => {
          textArea.value += data.quickReplyData6;
        });
        break;
      default:
        break;
    }
  } else {
    chrome.scripting.executeScript({
      target: { tabId },
      func: fastPostMessageNotFoundAlert,
    });
  }
}

/******************************************************************************* */

function fastPostMessageNotFoundAlert() {
  alert("未找到指定元素！(#fastpostmessage)");
}

function submit() {
  let selector = "#modsubmit";
  let intervalId = setInterval(() => {
    let element = document.querySelector(selector);
    console.log(`Checking ${selector} element...`);

    if (element) {
      clearInterval(intervalId);

      element.click();
    }
  }, 500);
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

function getFormattedTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

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
