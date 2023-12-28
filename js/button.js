function createButton(innerText, top, selector, clickMessage, clickAction) {
  let button = document.createElement("button");
  button.innerText = innerText;
  button.style.position = "fixed";
  button.style.top = top + "px";
  button.style.left = "40px";
  button.style.width = "100px";
  button.style.height = "40px";
  document.body.appendChild(button);

  button.addEventListener("click", function () {
    let element = document.querySelector(selector);
    if (element) {
      element.click();
    } else {
      alert(clickMessage);
    }
  });
  return button;
}

let editButton = createButton(
  "编辑帖子",
  80,
  "#viewthread_foot\\ cl > div > div > em > a.times_editp",
  "未找到编辑按钮！",
  null
);
let beforePageButton = createButton(
  "上一页",
  130,
  "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.prev",
  "已经是第一页了！",
  null
);
let nextPageButton = createButton(
  "下一页",
  180,
  "#ct > div.cl > div.mn > div:nth-child(3) > div.pgs.mtm.mbm.cl > div > a.nxt",
  "已经是最后一页了！",
  null
);
