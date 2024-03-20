window.onload = function () {
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

  let editButton = createButton(
    "编辑帖子",
    "#viewthread_foot\\ cl > div > div > em > a.times_editp",
    "未找到编辑按钮！",
    false
  );
  let beforePageButton = createButton(
    "上一页",
    "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.prev",
    "未找到按钮或已经是第一页了！",
    false
  );
  let nextPageButton = createButton(
    "下一页",
    "#ct > div.cl > div.mn > div.box.cl > div.pgs.mtm.mbm.cl > div > a.nxt",
    "未找到按钮或已经是最后一页了！",
    false
  );
  let editArea = createButton(
    "跳转回复",
    "#fastpostform > table > tbody > tr > td",
    "未找到按钮！",
    true
  );
};

function createButton(innerText, targetSelector, clickMessage, isScroll) {
  let button = document.createElement("button");
  button.innerText = innerText;
  button.style.marginBottom = "10px";
  button.style.width = "70px";
  button.style.height = "25px";
  document.querySelector("#chrome-plugin-popup").appendChild(button);

  button.addEventListener("click", function () {
    let element = document.querySelector(targetSelector);
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
