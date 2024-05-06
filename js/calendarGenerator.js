document
  .getElementById("calendar")
  .addEventListener("click", showCalendarDialog);
document
  .getElementById("calendar-confirm-button")
  .addEventListener("click", calendarConfirm);
document
  .getElementById("calendar-cancel-button")
  .addEventListener("click", closeCalendarDialog);

function showCalendarDialog() {
  let dialog = document.querySelector("#calendar-dialog");
  dialog.showModal();
}

function closeCalendarDialog() {
  let dialog = document.querySelector("#calendar-dialog");
  dialog.close();
}

function calendarConfirm() {
  let year = document.querySelector("#calendarYear").value;
  let month = document.querySelector("#calendarMonth").value;
  let selectBox = document.querySelector("#calendar-select");
  let startPersonName = selectBox.options[selectBox.selectedIndex].text;
  generator(year, month, startPersonName);
}

function generator(year, month, startPersonName) {
  // let year = 2024;
  // let month = 2;
  // let startPersonName = "许秦俊豪";

  let spread = new GC.Spread.Sheets.Workbook();

  let sheet = spread.getActiveSheet();

  sheet.suspendPaint();
  // header
  let person = ["许秦俊豪", "窦梦林", "潘达威", "黄学雷", "段函", "马黎鑫"];
  let new_person = ["许秦俊豪", "潘达威", "黄学雷", "段函", "马黎鑫"];

  sheet.setValue(0, 0, "Review日历");
  sheet.addSpan(0, 0, 1, 7);
  sheet.getCell(0, 0).font("bold 16pt Calibri");
  sheet.getCell(0, 0).hAlign(GC.Spread.Sheets.HorizontalAlign.center);
  sheet.autoFitRow(0);

  sheet.setArray(1, 0, [["一", "二", "三", "四", "五", "六", "日"]]);
  sheet.getRange(1, 0, 1, 7).hAlign(GC.Spread.Sheets.HorizontalAlign.center);
  sheet.getRange(1, 0, 1, 7).backColor("LightGrey");

  // body
  let daysInMonth = new Date(year, month, 0).getDate();
  let firstDay = new Date(year, month - 1, 1).getDay();
  let personIndex = new_person.findIndex((e) => e == startPersonName);
  let row = 2;
  let col = firstDay - 1; // minus one to let sunday shows at the end.
  for (let day = 1; day <= daysInMonth; day++) {
    sheet.setColumnWidth(col, 91);
    sheet.setValue(row, col, day);
    sheet.getCell(row, col).hAlign(GC.Spread.Sheets.HorizontalAlign.center);

    if (col < 5) {
      sheet.setValue(row + 1, col, new_person[personIndex % 5]);
      sheet
        .getCell(row + 1, col)
        .hAlign(GC.Spread.Sheets.HorizontalAlign.center);
      sheet.getCell(row + 1, col).font("bold 11pt Calibri");

      // if monday, skip saturday % sunday.
      let review1DateString =
        new Date(year, month - 1, day - 1).getDay() == 0
          ? new Date(year, month - 1, day - 3).toLocaleDateString()
          : new Date(year, month - 1, day - 1).toLocaleDateString();
      let review7DateString =
        new Date(year, month - 1, day - 8).getDay() == 0
          ? new Date(year, month - 1, day - 10).toLocaleDateString()
          : new Date(year, month - 1, day - 8).toLocaleDateString();
      sheet.setValue(
        row + 2,
        col,
        review1DateString + "\n" + review7DateString
      );
      sheet.getCell(row + 2, col).wordWrap(true);
      sheet
        .getCell(row + 2, col)
        .hAlign(GC.Spread.Sheets.HorizontalAlign.center);
      sheet.autoFitRow(row + 2);

      personIndex++;
    }
    col++;
    sheet.getRange(row + 1, 0, 1, 7).backColor("LightGrey");
    if (col > 6) {
      col = 0;
      row = row + 3;
    }
  }

  let lineStyle = GC.Spread.Sheets.LineStyle.thin;
  let lineBorder = new GC.Spread.Sheets.LineBorder("black", lineStyle);
  sheet
    .getRange(0, 0, col == 0 ? row : row + 3, 7)
    .setBorder(lineBorder, { all: true }, GC.Spread.Sheets.SheetArea.viewport);

  sheet.resumePaint();

  spread.export(
    function (blob) {
      saveAs(blob, "calendar.xlsx");
    },
    function (e) {
      console.log(e);
    },
    {
      fileType: GC.Spread.Sheets.FileType.excel,
    }
  );
}
