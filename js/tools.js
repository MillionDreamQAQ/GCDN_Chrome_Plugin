window.onload = function () {
  const regex = /(DOCXLS|SJS)-\d+/g;

  let domClone = document.body.cloneNode(true);
  domClone
    .querySelector(".gcdn_author_info")
    .removeChild(domClone.querySelector(".gcdn_author_info_3"));

  let matches = domClone.innerText.match(regex);
  matches = [...new Set(matches)];

  if (matches) {
    matches.forEach((match) => {
      let jiraButton = document.createElement("a");
      jiraButton.style.marginLeft = "6px";
      jiraButton.style.color = "#0078d4";
      jiraButton.style.textDecoration = "underline";
      jiraButton.innerText = match;
      jiraButton.target = "_blank";
      jiraButton.href = "https://grapecity.atlassian.net/browse/" + match;

      let dom = document.querySelector("#topicreplies").parentElement;
      if (dom) {
        dom.appendChild(jiraButton);
      }
    });
  }

  let posterName = document.querySelector("#postauthor");
  if (posterName) {
    let posterNameText = posterName.innerText;
    let crmButton = posterName.appendChild(document.createElement("a"));
    crmButton.style.marginLeft = "10px";
    crmButton.style.color = "#0078d4";
    crmButton.style.textDecoration = "underline";
    crmButton.innerText = "CRM查找此ID";
    crmButton.target = "_blank";
    crmButton.href =
      "https://developersolutions.crm5.dynamics.com/main.aspx?appid=69dffb8e-ae36-e811-817f-e0071b6927a1&forceUCI=1&pagetype=search&searchText=" +
      encodeURI(posterNameText);

    let customerExcel = posterName.appendChild(document.createElement("a"));
    customerExcel.style.marginLeft = "10px";
    customerExcel.style.color = "#0078d4";
    customerExcel.style.textDecoration = "underline";
    customerExcel.innerText = "CRM里没找到？去这找找...";
    customerExcel.target = "_blank";
    customerExcel.href =
      "https://grapecityglobal.sharepoint.com/:x:/r/sites/gcscn/_layouts/15/Doc.aspx?sourcedoc=%7B8DC832FD-A95D-4E10-93A0-CB806CCCDAD9%7D&file=%E9%87%91%E7%89%8C%E8%B4%A6%E5%8F%B7%E7%BB%B4%E6%8A%A4%E8%AE%B0%E5%BD%95.xlsx&action=default&mobileredirect=true";
  }

  /**************************************************************************************************************************************/

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

    let postReplyElement = document.querySelector("#f_pst .plc");
    for (let i = 0; i < 6; i++) {
      createReplyElement(postReplyElement, i);
    }
  });

  function createReplyElement(parentElement, index) {
    let testButton = parentElement.appendChild(document.createElement("div"));
    testButton.innerHTML = `${hints[index]}`;
    testButton.id = index + 1;
    testButton.style.display = "inline-block";
    testButton.style.height = "30px";
    testButton.style.lineHeight = "30px";
    testButton.style.width = "60px";
    testButton.style.textAlign = "center";
    testButton.style.border = "1px solid gray";
    testButton.style.borderRadius = "6px";
    testButton.style.marginRight = "36px";
    testButton.style.color = "gray";
    testButton.style.cursor = "pointer";

    testButton.addEventListener("mouseover", function () {
      testButton.style.backgroundColor = "lightgrey";
      testButton.style.color = "red";
    });

    testButton.addEventListener("mouseout", function () {
      testButton.style.backgroundColor = "white";
      testButton.style.color = "gray";
    });

    testButton.addEventListener("click", () => {
      console.log("click");

      let textArea = document.querySelector("#fastpostmessage");
      if (textArea) {
        switch (parseInt(testButton.id)) {
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
        alert("未找到指定元素！(#fastpostmessage)");
      }
    });
  }

  /**************************************************************************************************************************************/

  let mainButton = document.createElement("button");
  mainButton.innerHTML = "→";
  mainButton.style.position = "fixed";
  mainButton.style.top = "100px";
  mainButton.style.left = "8px";
  mainButton.style.width = "70px";
  mainButton.style.height = "25px";

  document.body.appendChild(mainButton);

  let popup = document.createElement("div");
  popup.id = "chrome-plugin-popup";
  popup.style.display = "none";
  popup.style.position = "fixed";
  popup.style.top = "100px";
  popup.style.left = "86px";
  popup.style.width = "100px";
  popup.style.height = "200px";
  popup.style.backgroundColor = "transparent";

  mainButton.addEventListener("mouseover", function () {
    popup.style.display = "block";
  });

  document.body.addEventListener("click", function () {
    popup.style.display = "none";
  });

  document.body.appendChild(popup);

  createButton(
    popup,
    "编辑帖子",
    "#viewthread_foot\\ cl > div > div > em > a.times_editp",
    "未找到编辑按钮！",
    false
  );
  createButton(
    popup,
    "上一页",
    "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.prev",
    "未找到按钮或已经是第一页了！",
    false
  );
  createButton(
    popup,
    "下一页",
    "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.nxt",
    "未找到按钮或已经是最后一页了！",
    false
  );
  createButton(
    popup,
    "跳转回复",
    "#fastpostform > table > tbody > tr > td",
    "未找到按钮！",
    true
  );
};

function createButton(
  parentElement,
  innerText,
  targetSelector,
  errorMessage,
  isScroll
) {
  let button = document.createElement("button");
  button.innerText = innerText;
  button.style.marginBottom = "10px";
  button.style.width = "70px";
  button.style.height = "25px";

  parentElement.appendChild(button);

  button.addEventListener("click", function () {
    let element = document.querySelector(targetSelector);
    if (element) {
      if (isScroll) {
        element.scrollIntoView(false);
      } else {
        element.click();
      }
    } else {
      alert(errorMessage);
    }
  });
  return button;
}
