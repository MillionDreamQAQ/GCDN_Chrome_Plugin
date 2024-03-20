window.onload = function () {
  let pattern = /(DOCXLS|SJS)-\d+/g;

  if (window.location.href.includes("mod=viewthread") || window.location.href.includes("showforum") || window.location.href.includes("showtopic")) {
    let pageHTML = document.body.innerHTML;

    let matches = pageHTML.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const jiraLink = `<a target="_blank" href="https://grapecity.atlassian.net/browse/${match}">${match}</a>`;
        pageHTML = pageHTML.replace(match, jiraLink);
      });
      document.body.innerHTML = pageHTML;
    }
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
  }
};
