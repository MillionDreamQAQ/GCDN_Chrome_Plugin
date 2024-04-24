// condition format styles
const CFStyle1 = new GC.Spread.Sheets.Style();
CFStyle1.backColor = "#FB6573";
const CFStyle2 = new GC.Spread.Sheets.Style();
CFStyle2.backColor = "#C6E7EC";
const CFStyle3 = new GC.Spread.Sheets.Style();
CFStyle3.backColor = "#64E834";
const CFStyle4 = new GC.Spread.Sheets.Style();
CFStyle4.backColor = "#6A5ACD";
const CFStyle5 = new GC.Spread.Sheets.Style();
CFStyle5.foreColor = "#5b457c";
const CFStyle6 = new GC.Spread.Sheets.Style();
CFStyle6.foreColor = "#FFCB6C";

// dev list
const sjs_developer = [
  "夏莫听雨",
  "阿花",
  "trace",
  "AKA_HSTS",
  "香香",
  "summer_",
  "前端小白",
  "yankfu",
  "刘刁强谢双王",
  "wainwell",
  "OTimeCoder",
  "Michael.Lu",
  "刘老太",
  "不吐葡萄皮",
];

const gc_developer = [
  "Lewis",
  "三火",
  "RoyAji",
  "放浪雀士",
  "baiyuan",
  "游侠",
  "WhiteSong",
  "小七2704",
  "Sophia",
  "天天向上Sun",
];

window.onload = function () {
  addMessageListener();
  attachEvent();
  setDefaultData();
  initSpread();
};

function addMessageListener() {
  chrome.runtime.onMessage.addListener(messageReceived);
  function messageReceived(data) {
    if (data.msg == "refresh") {
      location?.reload();
    }
  }
}

function attachEvent() {
  document.getElementById("setBoard").addEventListener("click", boardChange);
  document
    .getElementById("updateTime")
    .addEventListener("change", updateTimeChange);
  document
    .getElementById("notifyTime")
    .addEventListener("change", notifyTimeChange);
  document.getElementById("openNewTab").addEventListener("click", openNewTab);
  document.getElementById("export").addEventListener("click", exportExcel);
  document.getElementById("setGold").addEventListener("click", showAll);
  document.getElementById("setArea").addEventListener("click", showArea);

  document
    .getElementById("setBugBoard")
    .addEventListener("click", bugBoardChange);
  document
    .getElementById("setStartTime")
    .addEventListener("click", startTimeChange);

  document
    .getElementById("setReviewBoard")
    .addEventListener("click", reviewBoardChange);
  document
    .getElementById("setReviewStartTime")
    .addEventListener("click", reviewStartTimeChange);
  document
    .getElementById("setReviewEndTime")
    .addEventListener("click", reviewEndTimeChange);

  document
    .getElementById("confirm-button")
    .addEventListener("click", confirmExport);
  document
    .getElementById("cancel-button")
    .addEventListener("click", closeExport);
}

function setDefaultData() {
  chrome.storage.sync.get(
    [
      "board",
      "notifyTime",
      "updateTime",
      "setGold",
      "setArea",
      "bugBoard",
      "startTime",
      "reviewBoard",
      "reviewStartTime",
      "reviewEndTime",
    ],
    function (result) {
      if (result?.board) {
        document.getElementById("board").value = result.board;
      }
      if (result?.updateTime) {
        document.getElementById("updateTime").value = result.updateTime;
      }
      if (result?.notifyTime) {
        document.getElementById("notifyTime").value = result.notifyTime;
      }
      if (result?.setGold) {
        document.getElementById("setGold").value = result.setGold;
      }
      if (result?.setArea) {
        document.getElementById("setArea").value = result.setArea;
      }
      if (result?.bugBoard) {
        document.getElementById("bugBoard").value = result.bugBoard;
      }
      if (result?.startTime) {
        document.getElementById("startTime").value = result.startTime;
      }
      if (result?.reviewBoard) {
        document.getElementById("reviewBoard").value = result.reviewBoard;
      }
      if (result?.reviewStartTime) {
        document.getElementById("reviewStartTime").value =
          result.reviewStartTime;
      }
      if (result?.reviewEndTime) {
        document.getElementById("reviewEndTime").value = result.reviewEndTime;
      }
    }
  );
}

function initSpread() {
  let spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"));
  let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(document.getElementById('statusBar'));
  statusBar.bind(spread);
  spread.addSheet(1, new GC.Spread.Sheets.Worksheet("Bug"));
  spread.addSheet(2, new GC.Spread.Sheets.Worksheet("Review-Yesterday"));
  spread.addSheet(3, new GC.Spread.Sheets.Worksheet("Review-Custom"));
  spread.bind(
    GC.Spread.Sheets.Events.ActiveSheetChanged,
    function (sender, args) {
      let numElement = document.getElementById("num");
      let count = spread.getActiveSheet().getRowCount();
      if (count == 0) {
        numElement.innerText = "没帖子了，你很强，我知道~";
      } else {
        numElement.innerText =
          "你关注的版块还有" + count + "个帖子待处理。加油，胜利在望！";
      }

      let newSheetIndex = spread.getSheetIndex(args.newSheet.name());
      configPanelShow(newSheetIndex);
    }
  );

  chrome.storage.sync.get(["template"], function (result) {
    if (result?.template) {
      spread.fromJSON(JSON.parse(result.template));
      let sheet = spread.getSheet(0);
      sheet.setDataSource([]);

      let bugSheet = spread.getSheet(1);
      bugSheet.setDataSource([]);
      bugSheet.options.sheetTabColor = "red";

      let reviewSheet = spread.getSheet(2);
      reviewSheet.setDataSource([]);
      reviewSheet.options.sheetTabColor = "Honeydew";

      let reviewSheet7Days = spread.getSheet(3);
      reviewSheet7Days.setDataSource([]);
      reviewSheet7Days.options.sheetTabColor = "AliceBlue";
    } else {
      spread.options.scrollbarMaxAlign = true;
      spread.options.newTabVisible = false;

      let sheet = spread.getSheet(0);
      sheet.name("待回复的帖子");
      let colInfos = [
        { name: "板块", displayName: "板块", size: 180 },
        { name: "帖子标题", displayName: "帖子标题", size: 300 },
        { name: "处理状态", displayName: "处理状态", size: 80 },
        { name: "倒数第二层回复用户", displayName: "上次回帖用户", size: 120 },
        { name: "发帖用户用户组", displayName: "发帖用户组", size: 110 },
        { name: "客户类型", displayName: "", size: 100 },
        {
          name: "发帖时间",
          displayName: "发帖时间",
          size: 100,
          formatter: "MM-dd hh:mm",
        },
        {
          name: "回帖间隔时长",
          displayName: "回帖间隔时长",
          size: 40,
          value: function (item, newValue) {
            if (arguments.length == 1) {
              return parseInt(item["回帖间隔时长"]);
            } else {
              item["回帖间隔时长"] = newValue;
            }
          },
        },
        { name: "发帖用户", displayName: "发帖用户", size: 100 },
        { name: "最后回帖用户", displayName: "最后回帖用户", size: 100 },
        { name: "回帖用户用户组", displayName: "回帖用户组", size: 100 },
        { name: "发帖区域", displayName: "发帖区域", size: 100 },
        { name: "最后发帖地址", displayName: "最后发帖地址", size: 150 },
        { name: "最后发帖IP", displayName: "最后发帖IP", size: 100 },
      ];
      sheet.autoGenerateColumns = false;
      sheet.bindColumns(colInfos);

      let bugSheet = spread.getSheet(1);
      let bugColInfos = [
        {
          name: "主题发布时间",
          displayName: "发帖时间",
          size: 80,
          formatter: "yyyy-MM-dd",
        },
        { name: "帖子标题", displayName: "帖子标题", size: 300 },
        { name: "处理状态", displayName: "处理状态", size: 100 },
        { name: "发帖用户用户组", displayName: "发帖用户组", size: 120 },
        { name: "发帖用户", displayName: "发帖用户", size: 100 },
        { name: "主题类型", displayName: "帖子类型", size: 100 },
      ];
      bugSheet.autoGenerateColumns = false;
      bugSheet.bindColumns(bugColInfos);
      bugSheet.options.sheetTabColor = "red";

      let reviewColInfo = [
        { name: "forumname", displayName: "板块", size: 180 },
        { name: "subject", displayName: "帖子标题", size: 300 },
        { name: "name", displayName: "处理状态", size: 100 },
        { name: "author", displayName: "发帖用户", size: 100 },
        { name: "authorgroup", displayName: "发帖用户组", size: 120 },
        {
          name: "postdate",
          displayName: "发帖时间",
          size: 100,
          formatter: "MM-dd hh:mm",
        },
        {
          name: "lastpostdate",
          displayName: "最后回复时间",
          size: 100,
          formatter: "MM-dd hh:mm",
        },
        { name: "lastposter", displayName: "最后回帖用户", size: 100 },
      ];

      let reviewSheet = spread.getSheet(2);
      reviewSheet.autoGenerateColumns = false;
      reviewSheet.bindColumns(reviewColInfo);
      reviewSheet.options.sheetTabColor = "Honeydew";

      let reviewSheetCustom = spread.getSheet(3);
      reviewSheetCustom.autoGenerateColumns = false;
      reviewSheetCustom.bindColumns(reviewColInfo);
      reviewSheetCustom.options.sheetTabColor = "lavender";
    }

    fetchHelpData();
    fetchBugData();
    fetchReviewData();
    fetchReviewCustomData();
  });
}

/**********************Sheet1 Post****************** */

function fetchHelpData() {
  let numElement = document.getElementById("num");
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://gcdn.grapecity.com.cn/api/forummasterreply.php",
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      try {
        let resp = JSON.parse(xhr.responseText);

        if (resp instanceof Array) {
          if (resp.length) {
            if (document.getElementById("board").value) {
              let board = document.getElementById("board").value.split(",");
              resp = resp
                .filter((topic) => board.includes(topic.fid))
                .filter((node) => node["最后回帖用户"] != "Lay.Li");
            }
            numElement.innerText = "辛苦啦，帖子已被你清空！！！";
            bindingHelpData(resp);
            fetchCustomerType();
            document.querySelector(".loading")?.remove();
            document.querySelector(".text")?.remove();

            let spread = GC.Spread.Sheets.findControl("ss");
            spread.options.scrollIgnoreHidden = true;
            let sheet = spread.getActiveSheet();

            let setGold = parseFloat(document.getElementById("setGold").value);
            filterByGold(setGold, sheet);

            let setArea = parseFloat(document.getElementById("setArea").value);
            filterByArea(setArea, sheet);
          } else {
            document.querySelector(".loading")?.remove();
            document.querySelector(".text")?.remove();
          }
        }
      } catch (e) {
        document.querySelector(".loading")?.remove();
        document.querySelector(".text")?.remove();
      }
    }
  };
  xhr.send();
}

function fetchCustomerType() {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://xa-gcscn-sys/gc_worksupport/ServerCommand/getGCDNInfo",
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      try {
        let resp = JSON.parse(xhr.response);
        let spread = GC.Spread.Sheets.findControl("ss");
        let sheet = spread.getActiveSheet();

        let partnerList = [],
          importantCustomerList = [];
        let resResult = resp.partnerGCDN;
        if (!resResult || resResult.length == 0) {
          return;
        }
        resResult.forEach((item) => {
          if (item["关系类型"] == "合作伙伴") {
            partnerList.push(item["账号"]);
          } else if (item["关系类型"] == "重点客户") {
            let current = item["账号"];
            let tempArr = [];
            if (current.indexOf("/") != -1) {
              tempArr = current.split("/");
              importantCustomerList.push(tempArr);
            } else if (current.indexOf(",") != -1) {
              tempArr = current.split(",");
              importantCustomerList.push(tempArr);
            } else if (current.indexOf("，") != -1) {
              tempArr = current.split("，");
              importantCustomerList.push(tempArr);
            } else {
              importantCustomerList.push(item["账号"]);
            }
          }
        });

        for (let i = 0; i < sheet.getRowCount(); i++) {
          let GCDN_ID = sheet.getValue(i, 9);
          for (const element of partnerList) {
            if (GCDN_ID == element) {
              sheet.setValue(i, 5, "合作伙伴");
              let style = new GC.Spread.Sheets.Style();
              style.decoration = {
                icons: [
                  {
                    src: "../images/partner.png",
                    width: 16,
                    height: 16,
                    position: GC.Spread.Sheets.IconPosition.right,
                  },
                ],
              };
              sheet.getCell(i, 5).setStyle(style);
              break;
            }
          }
          let needBreak = false;
          for (const element of importantCustomerList) {
            let current = element;
            if (GCDN_ID == current) {
              sheet.setValue(i, 5, "重点客户");
              break;
            } else if (Array.isArray(current)) {
              for (const element of current) {
                if (GCDN_ID == element) {
                  sheet.setValue(i, 5, "重点客户");
                  needBreak = true;
                  break;
                }
              }
            }
            if (needBreak) {
              break;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  xhr.send();
}

function bindingHelpData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  sheet.suspendPaint();

  sheet.setDataSource(data);

  let area = ["华北区", "华东区及其他", "华南区"];
  let north = ["北京", "天津", "山西", "河北", "山东", "河南", "吉林", "陕西"];
  let east = ["上海", "江苏", "浙江", "安徽", "湖北"];
  let south = ["广东", "深圳", "福建", "湖南", "云南", "重庆", "四川"];

  let addressIndex = 12;
  let areaIndex = 11;

  for (let i = 0; i < sheet.getRowCount(); i++) {
    let value = sheet.getValue(i, addressIndex);
    for (const province of north) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, areaIndex, area[0]);
      }
    }
    for (const province of east) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, areaIndex, area[1]);
      }
    }
    for (const province of south) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, areaIndex, area[2]);
      }
    }
  }

  for (let i = 0; i < sheet.getRowCount(); i++) {
    let value = sheet.getValue(i, areaIndex);
    if (value !== "华北区" && value !== "华东区及其他" && value !== "华南区") {
      sheet.setValue(i, areaIndex, area[1]);
    }
  }

  let row = sheet.getRowCount();
  setConditionFormat(sheet, row, null, null);
  bindDecoration(sheet, row, 4, 3, 9);
  setHyperlink(sheet, data, "帖子链接", "帖子标题");

  sheet.resumePaint();
}

function boardChange() {
  chrome.storage.sync.set({ board: document.getElementById("board").value });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  sheet.setDataSource([]);
  let template = JSON.stringify(spread.toJSON());
  chrome.storage.sync.set({ template: template });

  fetchHelpData();
}

/************************************************* */

/**********************Sheet2 Bug****************** */

function fetchBugData() {
  let bugBoard = document.getElementById("bugBoard").value;
  let startTime = document.getElementById("startTime").value;

  fetch("https://gcdn.grapecity.com.cn/api/forumbugfeeds.php", {
    method: "POST",
    body: JSON.stringify({
      begin: startTime,
      fid: [bugBoard],
      code: "vbA3i=rtiEG",
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => bindingBugData(response));
}

function bindingBugData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(1);

  sheet.suspendPaint();

  sheet.setDataSource(data);

  let row = sheet.getRowCount();
  setConditionFormat(sheet, row, null, [
    new GC.Spread.Sheets.Range(0, 3, row, 1),
  ]);
  bindDecoration(sheet, row, 3, null, null);
  setHyperlink(sheet, data, "tid", "帖子标题");

  sheet.resumePaint();
}

function bugBoardChange() {
  chrome.storage.sync.set({
    bugBoard: document.getElementById("bugBoard").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(1);
  sheet.setDataSource([]);

  fetchBugData();
}

function startTimeChange() {
  chrome.storage.sync.set({
    startTime: document.getElementById("startTime").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(1);
  sheet.setDataSource([]);

  fetchBugData();
}

/************************************************* */

/**********************Sheet3/4 Review****************** */

function fetchReviewData() {
  let reviewBoard = document.getElementById("reviewBoard").value;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let startTime = yesterday.toLocaleDateString();
  let endTime = yesterday.toLocaleDateString();

  fetch("https://gcdn.grapecity.com.cn/api/forumpoststatus.php", {
    method: "POST",
    body: JSON.stringify({
      fid: reviewBoard,
      startdate: startTime,
      enddate: endTime,
      key: "J5yP7hL8mK",
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => bindingReviewData(response));
}

function bindingReviewData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(2);

  sheet.suspendPaint();

  sheet.setDataSource(data);

  let row = sheet.getRowCount();
  setConditionFormat(sheet, row, null, null);
  bindDecoration(sheet, row, 4, null, null);
  setHyperlink(sheet, data, "tid", "subject");

  sheet.resumePaint();
}

function reviewBoardChange() {
  chrome.storage.sync.set({
    reviewBoard: document.getElementById("reviewBoard").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let reviewOneDaySheet = spread.getSheet(2);
  reviewOneDaySheet.setDataSource([]);
  let reviewCustomSheet = spread.getSheet(3);
  reviewCustomSheet.setDataSource([]);

  fetchReviewData();
  fetchReviewCustomData();
}

/************************************************* */

/**********************Sheet4 Review-Custom****************** */

function fetchReviewCustomData() {
  let reviewBoard = document.getElementById("reviewBoard").value;
  let startTime = document.getElementById("reviewStartTime").value;
  let endTime = document.getElementById("reviewEndTime").value;

  fetch("https://gcdn.grapecity.com.cn/api/forumpoststatus.php", {
    method: "POST",
    body: JSON.stringify({
      fid: reviewBoard,
      startdate: startTime,
      enddate: endTime,
      key: "J5yP7hL8mK",
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => bindingReviewCustomData(response));
}

function bindingReviewCustomData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(3);

  sheet.suspendPaint();

  sheet.setDataSource(data);

  let row = sheet.getRowCount();
  setConditionFormat(sheet, row, null, null);
  bindDecoration(sheet, row, 4, null, null);
  setHyperlink(sheet, data, "tid", "subject");

  sheet.resumePaint();
}

function reviewStartTimeChange() {
  chrome.storage.sync.set({
    reviewStartTime: document.getElementById("reviewStartTime").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(3);
  sheet.setDataSource([]);

  fetchReviewCustomData();
}

function reviewEndTimeChange() {
  chrome.storage.sync.set({
    reviewEndTime: document.getElementById("reviewEndTime").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(3);
  sheet.setDataSource([]);

  fetchReviewCustomData();
}

/************************************************* */

/**********************Others*********************** */
function setHyperlink(sheet, data, fieldName, fieldName2) {
  let titleIndex = -1;
  for (let i = 0; i < sheet.getColumnCount(); i++) {
    if (
      sheet.getText(0, i, GC.Spread.Sheets.SheetArea.colHeader) === "帖子标题"
    ) {
      titleIndex = i;
      break;
    }
  }
  if (titleIndex >= 0) {
    for (let i = 0; i < data.length; i++) {
      sheet.setHyperlink(
        i,
        titleIndex,
        {
          url:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i][fieldName],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i][fieldName],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i][fieldName2]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);
}

function bindDecoration(
  sheet,
  row,
  goldenIndex,
  lastReplyIndex,
  lastReplyIndex2
) {
  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, goldenIndex).value() == "金牌服务用户") {
      let style = new GC.Spread.Sheets.Style();
      style.decoration = {
        icons: [
          {
            src: "../images/golden.png",
            width: 16,
            height: 16,
            position: GC.Spread.Sheets.IconPosition.right,
          },
        ],
      };
      sheet.getCell(i, goldenIndex).setStyle(style);
    }

    if (!lastReplyIndex && !lastReplyIndex2) {
      continue;
    }

    if (sjs_developer.includes(sheet.getCell(i, lastReplyIndex).value())) {
      let style = new GC.Spread.Sheets.Style();
      style.decoration = {
        icons: [
          {
            src: "../images/sjs.jpg",
            width: 16,
            height: 16,
            position: GC.Spread.Sheets.IconPosition.right,
          },
        ],
      };
      sheet.getCell(i, lastReplyIndex).setStyle(style);
    }
    if (gc_developer.includes(sheet.getCell(i, lastReplyIndex).value())) {
      let style = new GC.Spread.Sheets.Style();
      style.decoration = {
        icons: [
          {
            src: "../images/gcexcel.png",
            width: 16,
            height: 16,
            position: GC.Spread.Sheets.IconPosition.right,
          },
        ],
      };
      sheet.getCell(i, lastReplyIndex).setStyle(style);
    }

    if (sjs_developer.includes(sheet.getCell(i, lastReplyIndex2).value())) {
      let style = new GC.Spread.Sheets.Style();
      style.decoration = {
        icons: [
          {
            src: "../images/sjs.jpg",
            width: 16,
            height: 16,
            position: GC.Spread.Sheets.IconPosition.right,
          },
        ],
      };
      sheet.getCell(i, lastReplyIndex2).setStyle(style);
    }
    if (gc_developer.includes(sheet.getCell(i, lastReplyIndex2).value())) {
      let style = new GC.Spread.Sheets.Style();
      style.decoration = {
        icons: [
          {
            src: "../images/gcexcel.png",
            width: 16,
            height: 16,
            position: GC.Spread.Sheets.IconPosition.right,
          },
        ],
      };
      sheet.getCell(i, lastReplyIndex2).setStyle(style);
    }
  }
}

function setConditionFormat(sheet, row, statusRanges, userTypeRanges) {
  if (!statusRanges) {
    statusRanges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  }
  if (!userTypeRanges) {
    userTypeRanges = [new GC.Spread.Sheets.Range(0, 4, row, 1)];
  }

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    CFStyle1,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "暂不采纳",
    CFStyle1,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    CFStyle2,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "沟通中",
    CFStyle2,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已采纳",
    CFStyle2,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    CFStyle4,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    CFStyle3,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已支持",
    CFStyle3,
    statusRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    CFStyle5,
    userTypeRanges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    CFStyle6,
    userTypeRanges
  );
}

function updateTimeChange() {
  chrome.storage.sync.set({
    updateTime: document.getElementById("updateTime").value,
  });
  let updateTime = parseFloat(document.getElementById("updateTime").value);
  chrome.alarms.clear("UpdateCountTimer");
  if (updateTime > 0) {
    chrome.alarms.create("UpdateCountTimer", { periodInMinutes: updateTime });
  }
}

function notifyTimeChange() {
  chrome.storage.sync.set({
    notifyTime: document.getElementById("notifyTime").value,
  });
  let notifyTime = parseFloat(document.getElementById("notifyTime").value);
  chrome.alarms.clear("UserReplyTimer");
  if (notifyTime > 0) {
    chrome.alarms.create("UserReplyTimer", { periodInMinutes: notifyTime });
  }
}

async function openNewTab() {
  chrome.tabs.create({
    url: window.location.href,
  });
}

function exportExcel() {
  let spread = GC.Spread.Sheets.findControl(document.getElementById("ss"));
  // Review
  if (spread.getActiveSheetIndex() > 1) {
    showExportDialog();
    return;
  }
  // Others
  spread.export(
    function (blob) {
      saveAs(blob, "forum.xlsx");
    },
    function (e) {
      console.log(e);
    },
    {
      fileType: GC.Spread.Sheets.FileType.excel,
      includeBindingSource: true,
    }
  );
}

function dailyReviewExport(spread, name) {
  let exportSpread = new GC.Spread.Sheets.Workbook();
  fetch("../template/template2.sjs")
    .then((response) => response.blob())
    .then((blob) => {
      exportSpread.open(
        blob,
        function () {
          let sheet = exportSpread.getActiveSheet();
          sheet.setValue(1, 3, name);

          sheet.tables.findByName("考勤记录").expandBoundRows(true);
          let dataSource = {
            record: [],
          };
          spread
            .getActiveSheet()
            .getDataSource()
            .forEach((data) => {
              dataSource.record.push({
                帖子链接: `http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=${data.tid}`,
                负责人: data.lastposter,
                详情: data.name == "已处理" ? "本帖已处理。" : "",
              });
            });

          let source = new GC.Spread.Sheets.Bindings.CellBindingSource(
            dataSource
          );
          sheet.setDataSource(source);

          let rowHeight = sheet.getRowHeight(3);
          for (let i = 0; i < dataSource.record.length; i++) {
            sheet.setRowHeight(3 + i, rowHeight);
            let urlCell = sheet.getCell(3 + i, 1);
            urlCell.font("14pt Microsoft YaHei UI");
            let posterCell = sheet.getCell(3 + i, 2);
            posterCell.font("14pt Microsoft YaHei UI");
            let detailCell = sheet.getCell(3 + i, 3);
            detailCell.font("14pt Microsoft YaHei UI");
            let markCell = sheet.getCell(3 + i, 4);
            markCell.font("14pt Microsoft YaHei UI");
            let commentCell = sheet.getCell(3 + i, 5);
            commentCell.font("14pt Microsoft YaHei UI");
            let urlValue = urlCell.value();
            sheet.setHyperlink(
              3 + i,
              1,
              {
                url: urlValue,
                tooltip: urlValue,
                linkColor: "#0066cc",
                visitedLinkColor: "#3399ff",
              },
              GC.Spread.Sheets.SheetArea.viewport
            );
          }

          exportSpread.export(
            function (blob) {
              saveAs(
                blob,
                `(${new Date().toLocaleDateString()})DailyReviewExport.xlsx`
              );
            },
            function (e) {
              console.log(e);
            },
            {
              fileType: GC.Spread.Sheets.FileType.excel,
              includeBindingSource: true,
            }
          );
        },
        function (e) {
          console.log(e);
        }
      );
    });
}

function showExportDialog() {
  let dialog = document.querySelector("#export-dialog");
  dialog.showModal();
}

function confirmExport() {
  let spread = GC.Spread.Sheets.findControl(document.getElementById("ss"));

  let selectBox = document.querySelector("#export-select");
  let selectedOption = selectBox.options[selectBox.selectedIndex].text;
  dailyReviewExport(spread, selectedOption);

  closeExport();
}

function closeExport() {
  let dialog = document.querySelector("#export-dialog");
  dialog.close();
}

function showAll() {
  chrome.storage.sync.set({
    setGold: document.getElementById("setGold").value,
  });

  chrome.storage.sync.get({ setGold }, function (result) {
    if (result["setGold"] == 1) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().filterButtonVisible(false);
      let conditionG = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*金牌服务用户*",
        }
      );

      let conditionG1 = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*伙伴/重要客户*",
        }
      );

      sheet.rowFilter().addFilterItem(4, conditionG);
      sheet.rowFilter().addFilterItem(4, conditionG1);
      sheet.rowFilter().filter(4);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setGold"] == 0) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(4);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    }
  });
}

function showArea() {
  chrome.storage.sync.set({
    setArea: document.getElementById("setArea").value,
  });

  chrome.storage.sync.get({ setArea }, function (result) {
    let spread = GC.Spread.Sheets.findControl("ss");
    let sheet = spread.getActiveSheet();
    if (result["setArea"] == 0) {
      sheet.rowFilter().unfilter(11);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 1) {
      sheet.rowFilter().removeFilterItems(11);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*华北区*",
        }
      );
      sheet.rowFilter().addFilterItem(11, condition);
      sheet.rowFilter().filter(11);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 2) {
      sheet.rowFilter().removeFilterItems(11);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*华东区及其他*",
        }
      );
      sheet.rowFilter().addFilterItem(11, condition);
      sheet.rowFilter().filter(11);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 3) {
      sheet.rowFilter().removeFilterItems(11);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*华南区*",
        }
      );
      sheet.rowFilter().addFilterItem(11, condition);
      sheet.rowFilter().filter(11);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    }
  });
}

function filterByGold(setGold, sheet) {
  sheet.rowFilter().filterButtonVisible(true);
  sheet.rowFilter().unfilter(4);
  sheet.rowFilter().unfilter(5);
  if (setGold == 0) {
    countRow();
    return;
  }
  sheet.rowFilter().filterButtonVisible(false);
  sheet.rowFilter().removeFilterItems(4);
  sheet.rowFilter().removeFilterItems(5);

  let conditionG = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*金牌服务用户*",
    }
  );
  let conditionN1 = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*合作伙伴*",
    }
  );
  let conditionN2 = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*重点客户*",
    }
  );

  if (setGold == 1) {
    sheet.rowFilter().addFilterItem(4, conditionG);
    sheet.rowFilter().filter(4);
  } else if (setGold == 2) {
    sheet.rowFilter().addFilterItem(5, conditionN1);
    sheet.rowFilter().filter(5);
  } else if (setGold == 3) {
    sheet.rowFilter().addFilterItem(5, conditionN2);
    sheet.rowFilter().filter(5);
  }

  sheet.rowFilter().filterButtonVisible(true);
  countRow();
}

function filterByArea(setArea, sheet) {
  sheet.rowFilter().filterButtonVisible(true);
  sheet.rowFilter().removeFilterItems(11);
  if (setArea == 0) {
    countRow();
    return;
  }
  sheet.rowFilter().filterButtonVisible(false);
  sheet.rowFilter().unfilter(11);
  let northCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*华北区*",
    }
  );
  let eastCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*华东区及其他*",
    }
  );
  let southCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*华南区*",
    }
  );
  switch (setArea) {
    case 1:
      sheet.rowFilter().addFilterItem(11, northCondition);
      break;
    case 2:
      sheet.rowFilter().addFilterItem(11, eastCondition);
      break;
    case 3:
      sheet.rowFilter().addFilterItem(11, southCondition);
      break;
    case 4:
      sheet.rowFilter().addFilterItem(11, westCondition);
      break;
  }

  sheet.rowFilter().filter(11);
  sheet.rowFilter().filterButtonVisible(true);
  countRow();
}

function countRow() {
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  let j = 0;
  for (let i = 0; i < sheet.getRowCount(); i++) {
    if (sheet.getRowVisible(i) === true) {
      j++;
    }
  }
  let numElement = document.getElementById("num");
  chrome.action.setBadgeBackgroundColor({ color: "#CCCCFF" });
  if (j === 0) {
    numElement.innerText = "没帖子了，你很强，我知道~";
    chrome.action.setBadgeText({
      text: "",
    });
  } else {
    numElement.innerText =
      "你关注的版块还有" + j + "个帖子待处理。加油，胜利在望！";
    chrome.action.setBadgeText({
      text: j.toString(),
    });
  }
}

function configPanelShow(index) {
  let checkPanel = document.querySelector(".check-container");
  let bugPanel = document.querySelector(".bug-container");
  let reviewPanel = document.querySelector(".review-container");

  switch (index) {
    case 0:
      checkPanel.style.display = "flex";
      bugPanel.style.display = "none";
      reviewPanel.style.display = "none";
      break;
    case 1:
      checkPanel.style.display = "none";
      bugPanel.style.display = "flex";
      reviewPanel.style.display = "none";
      break;
    case 2:
    case 3:
      checkPanel.style.display = "none";
      bugPanel.style.display = "none";
      reviewPanel.style.display = "flex";
    default:
      break;
  }
}

/************************************************* */
