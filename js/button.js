function createButton(innerText, top, selector, clickMessage, isScroll) {
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
      if (isScroll) {
        element.scrollIntoView(false);
      } else {
        element.click();
      }
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
  false
);
let beforePageButton = createButton(
  "上一页",
  130,
  "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.prev",
  "未找到按钮或已经是第一页了！",
  false
);
let nextPageButton = createButton(
  "下一页",
  180,
  "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.nxt",
  "未找到按钮或已经是最后一页了！",
  false
);
let editArea = createButton(
  "跳转回复",
  230,
  "#fastpostform > table > tbody > tr > td",
  "未找到按钮！",
  true
);
