window.onload = function () {
  let pattern = /(DOCXLS|SJS)-\d+/g;

  let pageHTML = document.body.innerHTML;

  let matches = pageHTML.match(pattern);

  if (matches) {
    matches.forEach((match) => {
      const jiraLink = `<a target="_blank" href="https://grapecity.atlassian.net/browse/${match}">${match}</a>`;
      pageHTML = pageHTML.replace(match, jiraLink);
    });
    document.body.innerHTML = pageHTML;
  }

  let crmButton = document.querySelector("#postauthor");
  if (crmButton) {
    crmButton.appendChild(document.createElement("a"));
    crmButton.style.marginLeft = "10px";
    crmButton.style.color = "#0078d4";
    crmButton.style.textDecoration = "underline";
    crmButton.setAttribute(
      "href",
      "https://developersolutions.crm5.dynamics.com/main.aspx?appid=69dffb8e-ae36-e811-817f-e0071b6927a1&forceUCI=1&pagetype=search&searchText=" +
        document.querySelector("#postauthor").innerText
    );
    crmButton.setAttribute("target", "_blank");
    crmButton.innerText = "CRM查找此ID";
  }
};
