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
  spread.addSheet(1, new GC.Spread.Sheets.Worksheet("Bug"));
  spread.addSheet(2, new GC.Spread.Sheets.Worksheet("Review-1"));
  spread.addSheet(3, new GC.Spread.Sheets.Worksheet("Review-7"));
  spread.addSheet(4, new GC.Spread.Sheets.Worksheet("Review-Custom"));
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

      let reviewSheetCustom = spread.getSheet(4);
      reviewSheetCustom.setDataSource([]);
      reviewSheetCustom.options.sheetTabColor = "lavender";
    } else {
      spread.options.scrollbarMaxAlign = true;
      spread.options.newTabVisible = false;

      let sheet = spread.getSheet(0);
      sheet.name("待回复的帖子");
      let colInfos = [
        { name: "板块", displayName: "板块", size: 180 },
        { name: "帖子标题", displayName: "帖子标题", size: 300 },
        { name: "处理状态", displayName: "处理状态", size: 100 },
        { name: "倒数第二层回复用户", displayName: "上次回帖用户", size: 120 },
        { name: "发帖用户用户组", displayName: "发帖用户组", size: 120 },
        { name: "客户类型", displayName: "", size: 120 },
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
          size: 100,
          formatter: "MM-dd hh:mm",
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

      let reviewSheet7Days = spread.getSheet(3);
      reviewSheet7Days.autoGenerateColumns = false;
      reviewSheet7Days.bindColumns(reviewColInfo);
      reviewSheet7Days.options.sheetTabColor = "AliceBlue";

      let reviewSheetCustom = spread.getSheet(4);
      reviewSheetCustom.autoGenerateColumns = false;
      reviewSheetCustom.bindColumns(reviewColInfo);
      reviewSheetCustom.options.sheetTabColor = "lavender";
    }

    fetchHelpData();
    fetchBugData();
    fetchReviewData();
    fetchReview7Data();
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
            document.querySelector('.loading').remove();
            document.querySelector('.text').remove();

            let spread = GC.Spread.Sheets.findControl("ss");
            spread.options.scrollIgnoreHidden = true;
            let sheet = spread.getActiveSheet();

            let setGold = parseFloat(document.getElementById("setGold").value);
            filterByGold(setGold, sheet);

            let setArea = parseFloat(document.getElementById("setArea").value);
            filterByArea(setArea, sheet);
          } else {
            document.querySelector('.loading').remove();
            document.querySelector('.text').remove();
          }
        }
      } catch (e) {
        document.querySelector('.loading').remove();
        document.querySelector('.text').remove();
      }
    }
  };
  xhr.send();
}

function fetchCustomerType() {
  let xhr1 = new XMLHttpRequest();
  xhr1.open(
    "GET",
    "http://xa-gcscn-sys/gc_worksupport/ServerCommand/getGCDNInfo",
    true
  );

  xhr1.onreadystatechange = function () {
    if (xhr1.readyState == 4) {
      try {
        let resp = JSON.parse(xhr1.response);
        let spread = GC.Spread.Sheets.findControl("ss");
        let sheet = spread.getActiveSheet();
        let img1 = null;

        function PartnerCellType() {}
        PartnerCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
        PartnerCellType.prototype.paint = function (
          ctx,
          value,
          x,
          y,
          width,
          height,
          style,
          context
        ) {
          GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(
            this,
            arguments
          );

          if (img1) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.drawImage(
              img1,
              x + (sheet.getColumnWidth(4) / 7) * 5.8,
              y,
              20,
              20
            );
            ctx.restore();
            return;
          }

          img1 = new Image();
          img1.src = "../images/partner.png";
          img1.onload = function () {
            context.sheet.repaint();
          };
        };

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
              sheet.setCellType(i, 5, new PartnerCellType());
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
  xhr1.send();
}

function bindingHelpData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  sheet.suspendPaint();

  sheet.setDataSource(data);

  let area = ["北方区", "华东区", "南方区", "西部区"];
  let north = [
    "北京",
    "天津",
    "山西",
    "河北",
    "山东",
    "内蒙古",
    "河南",
    "黑龙江",
    "吉林",
    "辽宁",
  ];
  let east = ["上海", "江苏", "浙江", "安徽", "湖北"];
  let south = ["广东", "广西", "海南", "福建", "江西", "湖南"];
  let west = [
    "陕西",
    "甘肃",
    "青海",
    "宁夏",
    "新疆",
    "四川",
    "贵州",
    "云南",
    "重庆",
    "西藏",
    "香港",
    "台湾",
    "澳门",
    "澳大利亚",
  ];

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
    for (const province of west) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, areaIndex, area[3]);
      }
    }
  }

  for (let i = 0; i < sheet.getRowCount(); i++) {
    let value = sheet.getValue(i, areaIndex);
    if (
      value !== "北方区" &&
      value !== "华东区" &&
      value !== "南方区" &&
      value !== "西部区"
    ) {
      sheet.setValue(i, areaIndex, area[2]);
    }
  }

  let style1 = new GC.Spread.Sheets.Style();
  style1.backColor = "#FB6573";

  let style2 = new GC.Spread.Sheets.Style();
  style2.backColor = "#C6E7EC";

  let style3 = new GC.Spread.Sheets.Style();
  style3.backColor = "#64E834";

  let style4 = new GC.Spread.Sheets.Style();
  style4.backColor = "#6A5ACD";

  let style5 = new GC.Spread.Sheets.Style();
  style5.foreColor = "#5b457c";

  let style6 = new GC.Spread.Sheets.Style();
  style6.foreColor = "#FFCB6C";

  let row = sheet.getRowCount();
  if (row >= 1) {
    document.getElementById("num").innerText =
      "注意，还有" + row + "个帖子待处理。加油，胜利在望！！！";
  }

  let ranges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  let ranges1 = [new GC.Spread.Sheets.Range(0, 4, row, 1)];

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    style1,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    style2,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    style5,
    ranges1
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    style6,
    ranges1
  );

  let img = null;
  let w =
    sheet.getColumnWidth(0) +
    sheet.getColumnWidth(1) +
    sheet.getColumnWidth(2) +
    sheet.getColumnWidth(3) +
    (sheet.getColumnWidth(4) / 7) * 5.8;
  function GoldenUserCellType() {}
  GoldenUserCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
  GoldenUserCellType.prototype.paint = function (
    ctx,
    value,
    x,
    y,
    width,
    height,
    style,
    context
  ) {
    GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.drawImage(img, x + w, y, 20, 20);
      ctx.restore();
      return;
    }
    img = new Image();
    img.src = "../images/golden.png";
    img.onload = function () {
      context.sheet.repaint();
    };
  };

  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, 4).value() == "金牌服务用户") {
      sheet.setCellType(i, 0, new GoldenUserCellType());
    }
  }

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
            data[i]["帖子链接"],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i]["帖子链接"],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i]["帖子标题"]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);

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

  let excelIo = new GC.Spread.Excel.IO();
  let serializationOption = {
    includeBindingSource: true,
    columnHeadersAsFrozenRows: true,
  };
  let json = spread.toJSON(serializationOption);
  let fileName = "forum.xlsx";
  excelIo.save(
    json,
    function (blob) {
      saveAs(blob, fileName);
    },
    function (e) {
      console.log(e);
    }
  );
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
          expected: "*北方区*",
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
          expected: "*华东区*",
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
          expected: "*南方区*",
        }
      );
      sheet.rowFilter().addFilterItem(11, condition);
      sheet.rowFilter().filter(11);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 4) {
      sheet.rowFilter().removeFilterItems(11);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*西部区*",
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
      expected: "*北方区*",
    }
  );
  let eastCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*华东区*",
    }
  );
  let southCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*南方区*",
    }
  );
  let westCondition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
    GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
    {
      compareType:
        GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
      expected: "*西部区*",
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

  let style1 = new GC.Spread.Sheets.Style();
  style1.backColor = "#FB6573";

  let style2 = new GC.Spread.Sheets.Style();
  style2.backColor = "#C6E7EC";

  let style3 = new GC.Spread.Sheets.Style();
  style3.backColor = "#64E834";

  let style4 = new GC.Spread.Sheets.Style();
  style4.backColor = "#6A5ACD";

  let style5 = new GC.Spread.Sheets.Style();
  style5.foreColor = "#5b457c";

  let style6 = new GC.Spread.Sheets.Style();
  style6.foreColor = "#FFCB6C";

  let row = sheet.getRowCount();

  let ranges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  let ranges1 = [new GC.Spread.Sheets.Range(0, 3, row, 1)];

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    style1,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    style2,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    style5,
    ranges1
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    style6,
    ranges1
  );

  let img = null;
  let w =
    sheet.getColumnWidth(0) +
    sheet.getColumnWidth(1) +
    sheet.getColumnWidth(2) +
    (sheet.getColumnWidth(3) / 7) * 5.8;
  function GoldenUserCellType() {}
  GoldenUserCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
  GoldenUserCellType.prototype.paint = function (
    ctx,
    value,
    x,
    y,
    width,
    height,
    style,
    context
  ) {
    GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.drawImage(img, x + w, y, 20, 20);
      ctx.restore();
      return;
    }
    img = new Image();
    img.src = "../images/golden.png";
    img.onload = function () {
      context.sheet.repaint();
    };
  };

  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, 3).value() == "金牌服务用户") {
      sheet.setCellType(i, 0, new GoldenUserCellType());
    }
  }

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
            data[i]["tid"],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i]["tid"],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i]["帖子标题"]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);

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

/**********************Sheet3 Review-1****************** */

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

  let style1 = new GC.Spread.Sheets.Style();
  style1.backColor = "#FB6573";

  let style2 = new GC.Spread.Sheets.Style();
  style2.backColor = "#C6E7EC";

  let style3 = new GC.Spread.Sheets.Style();
  style3.backColor = "#64E834";

  let style4 = new GC.Spread.Sheets.Style();
  style4.backColor = "#6A5ACD";

  let style5 = new GC.Spread.Sheets.Style();
  style5.foreColor = "#5b457c";

  let style6 = new GC.Spread.Sheets.Style();
  style6.foreColor = "#FFCB6C";

  let row = sheet.getRowCount();

  let ranges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  let ranges1 = [new GC.Spread.Sheets.Range(0, 4, row, 1)];

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    style1,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    style2,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    style5,
    ranges1
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    style6,
    ranges1
  );

  let img = null;
  let w =
    sheet.getColumnWidth(0) +
    sheet.getColumnWidth(1) +
    sheet.getColumnWidth(2) +
    sheet.getColumnWidth(3) +
    (sheet.getColumnWidth(4) / 7) * 5.8;
  function GoldenUserCellType() {}
  GoldenUserCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
  GoldenUserCellType.prototype.paint = function (
    ctx,
    value,
    x,
    y,
    width,
    height,
    style,
    context
  ) {
    GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.drawImage(img, x + w, y, 20, 20);
      ctx.restore();
      return;
    }
    img = new Image();
    img.src = "../images/golden.png";
    img.onload = function () {
      context.sheet.repaint();
    };
  };

  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, 4).value() == "金牌服务用户") {
      sheet.setCellType(i, 0, new GoldenUserCellType());
    }
  }

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
            data[i]["tid"],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i]["tid"],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i]["subject"]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);

  sheet.resumePaint();
}

function reviewBoardChange() {
  chrome.storage.sync.set({
    reviewBoard: document.getElementById("reviewBoard").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(2);
  sheet.setDataSource([]);
  let sheet2 = spread.getSheet(3);
  sheet2.setDataSource([]);
  let sheet3 = spread.getSheet(4);
  sheet3.setDataSource([]);

  fetchReviewData();
  fetchReview7Data();
  fetchReviewCustomData();
}

/************************************************* */

/**********************Sheet4 Review-7****************** */

function fetchReview7Data() {
  let reviewBoard = document.getElementById("reviewBoard").value;

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  let startTime = lastWeek.toLocaleDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
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
    .then((response) => bindingReview7Data(response));
}

function bindingReview7Data(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(3);

  sheet.suspendPaint();

  sheet.setDataSource(data);

  let style1 = new GC.Spread.Sheets.Style();
  style1.backColor = "#FB6573";

  let style2 = new GC.Spread.Sheets.Style();
  style2.backColor = "#C6E7EC";

  let style3 = new GC.Spread.Sheets.Style();
  style3.backColor = "#64E834";

  let style4 = new GC.Spread.Sheets.Style();
  style4.backColor = "#6A5ACD";

  let style5 = new GC.Spread.Sheets.Style();
  style5.foreColor = "#5b457c";

  let style6 = new GC.Spread.Sheets.Style();
  style6.foreColor = "#FFCB6C";

  let row = sheet.getRowCount();

  let ranges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  let ranges1 = [new GC.Spread.Sheets.Range(0, 4, row, 1)];

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    style1,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    style2,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    style5,
    ranges1
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    style6,
    ranges1
  );

  let img = null;
  let w =
    sheet.getColumnWidth(0) +
    sheet.getColumnWidth(1) +
    sheet.getColumnWidth(2) +
    sheet.getColumnWidth(3) +
    (sheet.getColumnWidth(4) / 7) * 5.8;
  function GoldenUserCellType() {}
  GoldenUserCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
  GoldenUserCellType.prototype.paint = function (
    ctx,
    value,
    x,
    y,
    width,
    height,
    style,
    context
  ) {
    GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.drawImage(img, x + w, y, 20, 20);
      ctx.restore();
      return;
    }
    img = new Image();
    img.src = "../images/golden.png";
    img.onload = function () {
      context.sheet.repaint();
    };
  };

  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, 4).value() == "金牌服务用户") {
      sheet.setCellType(i, 0, new GoldenUserCellType());
    }
  }

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
            data[i]["tid"],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i]["tid"],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i]["subject"]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);

  sheet.resumePaint();
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
  let sheet = spread.getSheet(4);

  sheet.suspendPaint();

  sheet.setDataSource(data);

  let style1 = new GC.Spread.Sheets.Style();
  style1.backColor = "#FB6573";

  let style2 = new GC.Spread.Sheets.Style();
  style2.backColor = "#C6E7EC";

  let style3 = new GC.Spread.Sheets.Style();
  style3.backColor = "#64E834";

  let style4 = new GC.Spread.Sheets.Style();
  style4.backColor = "#6A5ACD";

  let style5 = new GC.Spread.Sheets.Style();
  style5.foreColor = "#5b457c";

  let style6 = new GC.Spread.Sheets.Style();
  style6.foreColor = "#FFCB6C";

  let row = sheet.getRowCount();

  let ranges = [new GC.Spread.Sheets.Range(0, 2, row, 1)];
  let ranges1 = [new GC.Spread.Sheets.Range(0, 4, row, 1)];

  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "未处理",
    style1,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "处理中",
    style2,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "调研中",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "合作伙伴",
    style5,
    ranges1
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "金牌服务用户",
    style6,
    ranges1
  );

  let img = null;
  let w =
    sheet.getColumnWidth(0) +
    sheet.getColumnWidth(1) +
    sheet.getColumnWidth(2) +
    sheet.getColumnWidth(3) +
    (sheet.getColumnWidth(4) / 7) * 5.8;
  function GoldenUserCellType() {}
  GoldenUserCellType.prototype = new GC.Spread.Sheets.CellTypes.Text();
  GoldenUserCellType.prototype.paint = function (
    ctx,
    value,
    x,
    y,
    width,
    height,
    style,
    context
  ) {
    GC.Spread.Sheets.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.drawImage(img, x + w, y, 20, 20);
      ctx.restore();
      return;
    }
    img = new Image();
    img.src = "../images/golden.png";
    img.onload = function () {
      context.sheet.repaint();
    };
  };

  for (let i = 0; i < row; i++) {
    if (sheet.getCell(i, 4).value() == "金牌服务用户") {
      sheet.setCellType(i, 0, new GoldenUserCellType());
    }
  }

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
            data[i]["tid"],
          tooltip:
            "http://gcdn.grapecity.com.cn/forum.php?mod=viewthread&tid=" +
            data[i]["tid"],
          linkColor: "#0066cc",
          visitedLinkColor: "#3399ff",
        },
        GC.Spread.Sheets.SheetArea.viewport
      );
      sheet.setText(i, titleIndex, data[i]["subject"]);
    }
  }
  let range = new GC.Spread.Sheets.Range(-1, 0, -1, sheet.getColumnCount());
  let rowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(range);
  sheet.rowFilter(rowFilter);

  sheet.resumePaint();
}

function reviewStartTimeChange() {
  chrome.storage.sync.set({
    reviewStartTime: document.getElementById("reviewStartTime").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(4);
  sheet.setDataSource([]);

  fetchReviewCustomData();
}

function reviewEndTimeChange() {
  chrome.storage.sync.set({
    reviewEndTime: document.getElementById("reviewEndTime").value,
  });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getSheet(4);
  sheet.setDataSource([]);

  fetchReviewCustomData();
}

/************************************************* */

/**********************统计隐藏行****************** */

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

/************************************************* */
