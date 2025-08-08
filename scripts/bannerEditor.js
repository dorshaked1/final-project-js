const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("banner-text");
  const bgColorInput = document.getElementById("bg-color");
  const textColorInput = document.getElementById("text-color");
  const fontSelect = document.getElementById("font-family");
  const sizeSelect = document.getElementById("banner-size");
  const preview = document.getElementById("banner-preview");

  function updatePreview() {
    preview.textContent = textInput.value || "Your text here";
    preview.style.backgroundColor = bgColorInput.value;
    preview.style.color = textColorInput.value;
    preview.style.fontFamily = fontSelect.value;
    preview.classList.remove("square", "vertical");
    preview.classList.add(sizeSelect.value);
  }

  [textInput, bgColorInput, textColorInput, fontSelect, sizeSelect].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  updatePreview();

  const params = new URLSearchParams(window.location.search);
  const campaignId = parseInt(params.get("id"));
  const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
  const campaign = campaigns[campaignId];

  if (!campaign) {
    alert("Campaign not found.");
    window.location.href = "dashboard.html";
    return;
  }

  // הצגת שם הקמפיין
  const campaignTitle = document.getElementById("campaign-title");
  campaignTitle.textContent = `Editing: ${campaign.name}`;

  // אם יש באנר שמור – נטען אותו
  if (campaign.banner) {
    const bannerData = campaign.banner;
    textInput.value = bannerData.text || "";
    bgColorInput.value = bannerData.backgroundColor || "#ffffff";
    textColorInput.value = bannerData.textColor || "#000000";
    fontSelect.value = bannerData.font || "Arial";
    sizeSelect.value = bannerData.size || "square";
    updatePreview();

    // נציג את הבאנר השמור
    const previewCopy = preview.cloneNode(true);
    const savedContainer = document.getElementById("saved-banner-preview");
    savedContainer.innerHTML = "<h3>Saved Banner:</h3>";
    savedContainer.appendChild(previewCopy);
  }

  // כפתור שמירה
  const saveBtn = document.getElementById("save-btn");
  saveBtn.addEventListener("click", () => {
    campaign.banner = {
      text: textInput.value,
      backgroundColor: bgColorInput.value,
      textColor: textColorInput.value,
      font: fontSelect.value,
      size: sizeSelect.value
    };

    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Banner saved successfully!");

    // עדכון תצוגת הבאנר השמור
    const previewCopy = preview.cloneNode(true);
    const savedContainer = document.getElementById("saved-banner-preview");
    savedContainer.innerHTML = "<h3>Saved Banner:</h3>";
    savedContainer.appendChild(previewCopy);
  });

  // כפתור מחיקה
  const deleteBtn = document.getElementById("delete-banner-btn");
  deleteBtn.addEventListener("click", () => {
    if (!campaign.banner) {
      alert("No banner to delete.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete the banner?");
    if (!confirmDelete) return;

    delete campaign.banner;
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Banner deleted.");
    location.reload();
  });
});
