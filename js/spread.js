window.onload = function () {
  attachEvent();
  setDefaultData();
  initSpread();
};

function attachEvent() {
  document.getElementById("setFids").addEventListener("click", updateAreaId);
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
}

function setDefaultData() {
  chrome.storage.sync.get(
    ["fids", "notifyTime", "updateTime", "setGold", "setArea"],
    function (result) {
      if (result?.fids) {
        document.getElementById("fids").value = result.fids;
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
    }
  );
}

function initSpread() {
  let spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"));
  chrome.storage.sync.get(["template"], function (result) {
    if (result?.template) {
      spread.fromJSON(JSON.parse(result.template));
      let sheet = spread.getActiveSheet();
      sheet.setDataSource([]);
    } else {
      spread.options.scrollbarMaxAlign = true;
      spread.options.newTabVisible = false;
      let sheet = spread.getActiveSheet();

      let colInfos = [
        { name: "板块", displayName: "板块", size: 180 },
        { name: "帖子标题", displayName: "帖子标题", size: 300 },
        { name: "处理状态", displayName: "处理状态", size: 100 },
        { name: "发帖用户用户组", displayName: "发帖用户组", size: 100 },
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
    }
    fetchData();
  });
}

function fetchData() {
  document.getElementById("forumdata").innerHTML = "加载中...";

  function gcdnListFun() {
    let xhr1 = new XMLHttpRequest();
    xhr1.open(
      "GET",
      "http://xa-gcscn-sys/gcdnApi/ServerCommand/getPartnerGCDN",
      true
    );

    xhr1.onreadystatechange = function () {
      if (xhr1.readyState == 4) {
        try {
          let resp = JSON.parse(xhr1.response);

          let spread = GC.Spread.Sheets.findControl("ss");

          let sheet = spread.getActiveSheet();

          let img1 = null;
          let w =
            sheet.getColumnWidth(0) +
            sheet.getColumnWidth(1) +
            sheet.getColumnWidth(2) +
            (sheet.getColumnWidth(3) / 7) * 5.8;
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
                x + (sheet.getColumnWidth(3) / 7) * 5.8,
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

          for (let i = 0; i < sheet.getRowCount(); i++) {
            let value = sheet.getValue(i, 6);

            for (const element of resp.gcdnList) {
              if (value.indexOf(element) != -1) {
                sheet.setValue(i, 3, "伙伴/重要客户");
              }
            }
          }

          for (let i = 0; i < sheet.getRowCount(); i++) {
            let value = sheet.getValue(i, 3);
            if (value === "伙伴/重要客户") {
              sheet.setCellType(i, 3, new PartnerCellType());
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    xhr1.send();
  }

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
            if (document.getElementById("fids").value) {
              let fids = document.getElementById("fids").value.split(",");
              resp = resp
                .filter((topic) => fids.includes(topic.fid))
                .filter((node) => node["最后回帖用户"] != "Lay.Li");
            }
            let obj1 = document.getElementById("num");
            obj1.innerText = "辛苦啦，帖子已被你清空！！！";
            bindingData(resp);
            gcdnListFun();
            document.getElementById("forumdata").innerHTML = "";

            let spread = GC.Spread.Sheets.findControl("ss");
            spread.options.scrollIgnoreHidden = true;
            let sheet = spread.getActiveSheet();

            let setGold = parseFloat(document.getElementById("setGold").value);
            if (setGold == 1) {
              sheet.rowFilter().unfilter(3);
              let conditionN =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*金牌服务用户*",
                  }
                );

              let conditionN1 =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*伙伴/重要客户*",
                  }
                );

              sheet.rowFilter().addFilterItem(3, conditionN);
              sheet.rowFilter().addFilterItem(3, conditionN1);
              sheet.rowFilter().filter(3);
              countRow();
            } else if (setGold == 0) {
              sheet.rowFilter().unfilter(3);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            }

            let setArea = parseFloat(document.getElementById("setArea").value);
            if (setArea === 0) {
              sheet.rowFilter().unfilter(9);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            } else if (setArea === 1) {
              sheet.rowFilter().removeFilterItems(9);
              sheet.rowFilter().filterButtonVisible(false);
              let condition =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*北方区*",
                  }
                );
              sheet.rowFilter().addFilterItem(9, condition);
              sheet.rowFilter().filter(9);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            } else if (setArea === 2) {
              sheet.rowFilter().removeFilterItems(9);
              sheet.rowFilter().filterButtonVisible(false);
              let condition =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*华东区*",
                  }
                );
              sheet.rowFilter().addFilterItem(9, condition);
              sheet.rowFilter().filter(9);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            } else if (setArea === 3) {
              sheet.rowFilter().removeFilterItems(9);
              sheet.rowFilter().filterButtonVisible(false);
              let condition =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*南方区*",
                  }
                );
              sheet.rowFilter().addFilterItem(9, condition);
              sheet.rowFilter().filter(9);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            } else if (setArea === 4) {
              sheet.rowFilter().removeFilterItems(9);
              sheet.rowFilter().filterButtonVisible(false);
              let condition =
                new GC.Spread.Sheets.ConditionalFormatting.Condition(
                  GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
                  {
                    compareType:
                      GC.Spread.Sheets.ConditionalFormatting.TextCompareType
                        .contains,
                    expected: "*西部区*",
                  }
                );
              sheet.rowFilter().addFilterItem(9, condition);
              sheet.rowFilter().filter(9);
              sheet.rowFilter().filterButtonVisible(true);
              countRow();
            }
          } else {
            document.getElementById("forumdata").innerHTML = "没有要处理的帖子";
          }
        }
      } catch (e) {
        document.getElementById("forumdata").innerHTML = "获取失败，请重新获取";
      }
    }
  };
  xhr.send();
}

function bindingData(data) {
  if (!data?.length) {
    return;
  }
  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  let spreadNS = GC.Spread.Sheets;

  sheet.suspendPaint();

  sheet.setDataSource(data);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 110);

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
  let ease = ["上海", "江苏", "浙江", "安徽", "湖北"];
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

  for (let i = 0; i < sheet.getRowCount(); i++) {
    let value = sheet.getValue(i, 10);
    for (const province of north) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, 9, area[0]);
      }
    }
    for (const province of ease) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, 9, area[1]);
      }
    }
    for (const province of south) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, 9, area[2]);
      }
    }
    for (const province of west) {
      if (value.indexOf(province) != -1) {
        sheet.setValue(i, 9, area[3]);
      }
    }
  }

  for (let i = 0; i < sheet.getRowCount(); i++) {
    let value = sheet.getValue(i, 9);
    if (
      value !== "北方区" &&
      value !== "华东区" &&
      value !== "南方区" &&
      value !== "西部区"
    ) {
      sheet.setValue(i, 9, area[2]);
    }
  }

  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 115);

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
  let obj = document.getElementById("num");
  if (row >= 1) {
    obj.innerText = "注意，还有" + row + "个帖子待处理。加油，胜利在望！！！";
  }

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
    "已处理",
    style3,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "保留处理",
    style4,
    ranges
  );
  sheet.conditionalFormats.addSpecificTextRule(
    GC.Spread.Sheets.ConditionalFormatting.TextComparisonOperators.contains,
    "伙伴/重要客户",
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
    spreadNS.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

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

function updateAreaId() {
  chrome.storage.sync.set({ fids: document.getElementById("fids").value });

  let spread = GC.Spread.Sheets.findControl("ss");
  let sheet = spread.getActiveSheet();
  sheet.setDataSource([]);
  let template = JSON.stringify(spread.toJSON());
  chrome.storage.sync.set({ template: template });

  fetchData();
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

      sheet.rowFilter().addFilterItem(3, conditionG);
      sheet.rowFilter().addFilterItem(3, conditionG1);
      sheet.rowFilter().filter(3);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setGold"] == 0) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(3);
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
    if (result["setArea"] == 0) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();

      sheet.rowFilter().unfilter(9);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 1) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(9);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*北方区*",
        }
      );
      sheet.rowFilter().addFilterItem(9, condition);
      sheet.rowFilter().filter(9);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 2) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(9);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*华东区*",
        }
      );
      sheet.rowFilter().addFilterItem(9, condition);
      sheet.rowFilter().filter(9);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 3) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(9);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*南方区*",
        }
      );
      sheet.rowFilter().addFilterItem(9, condition);
      sheet.rowFilter().filter(9);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    } else if (result["setArea"] == 4) {
      let spread = GC.Spread.Sheets.findControl("ss");
      let sheet = spread.getActiveSheet();
      sheet.rowFilter().removeFilterItems(9);
      sheet.rowFilter().filterButtonVisible(false);
      let condition = new GC.Spread.Sheets.ConditionalFormatting.Condition(
        GC.Spread.Sheets.ConditionalFormatting.ConditionType.textCondition,
        {
          compareType:
            GC.Spread.Sheets.ConditionalFormatting.TextCompareType.contains,
          expected: "*西部区*",
        }
      );
      sheet.rowFilter().addFilterItem(9, condition);
      sheet.rowFilter().filter(9);
      sheet.rowFilter().filterButtonVisible(true);
      countRow();
    }
  });
}

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
  let obj = document.getElementById("num");
  if (j === 0) {
    obj.innerText = "辛苦啦，你关注的版块已被你清空！";
  } else {
    obj.innerText = "你关注的版块还有" + j + "个帖子待处理。加油，胜利在望！";
  }
}

/************************************************* */

chrome.runtime.onMessage.addListener(messageReceived);
function messageReceived(data) {
  if (data.msg == "refresh") {
    location?.reload();
  }
}
