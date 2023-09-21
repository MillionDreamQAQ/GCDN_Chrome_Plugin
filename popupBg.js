window.setInterval(function () {
  let refreshHours = new Date().getHours();
  let refreshMin = new Date().getMinutes();
  let refreshSec = new Date().getSeconds();
  if (refreshHours == "12" && refreshMin == "0" && refreshSec == "0") {
    chrome.notifications.clear("EmailNotification");
    chrome.notifications.create("EmailNotification", {
      type: "basic",
      iconUrl: "img/warn.png",
      title: "授权发送提醒",
      message: "客户很着急，请检查是否还有未发送的授权，谢谢！",
      requireInteraction: true,
    });
  }
  if (refreshHours == "17" && refreshMin == "30" && refreshSec == "0") {
    chrome.notifications.clear("EmailNotification");
    chrome.notifications.create("EmailNotification", {
      type: "basic",
      iconUrl: "img/warn.png",
      title: "授权发送提醒",
      message: "客户很着急，请检查是否还有未发送的授权，谢谢！",
      requireInteraction: true,
    });
  }
}, 1000);
