const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const textInput      = document.getElementById("banner-text");
  const bgColorInput   = document.getElementById("bg-color");
  const textColorInput = document.getElementById("text-color");
  const fontSelect     = document.getElementById("font-family");
  const sizeSelect     = document.getElementById("banner-size");     // square | vertical
  const templateSelect = document.getElementById("banner-template"); // t1 | t2 | t3
  const useCustom      = document.getElementById("use-custom-colors"); // ← חדש
  const preview        = document.getElementById("banner-preview");

  function toggleColorInputs() {
    if (!useCustom) return;
    const on = !!useCustom.checked;
    bgColorInput.disabled = !on;
    textColorInput.disabled = !on;
    
  }

  function updatePreview() {
    if (!preview) return;

    // טקסט
    preview.textContent = textInput.value?.trim() || "Your text here";

    // גודל + תבנית
    preview.classList.remove("square","vertical","t1","t2","t3");
    preview.classList.add(sizeSelect.value || "square");
    preview.classList.add((templateSelect?.value || "t1").trim());

    // אפס inline כדי שהתבנית תשפיע כברירת מחדל
    preview.style.backgroundColor = "";
    preview.style.color = "";

    // צבעים מותאמים אישית – רק אם מסומן
    if (useCustom?.checked) {
      if (bgColorInput.value)   preview.style.backgroundColor = bgColorInput.value;
      if (textColorInput.value) preview.style.color = textColorInput.value;
    }

    // פונט תמיד אפשר לעדכן
    preview.style.fontFamily = fontSelect.value || "Arial";
  }

  [textInput, bgColorInput, textColorInput, fontSelect, sizeSelect, templateSelect, useCustom]
    .forEach(el => el && el.addEventListener("input", () => {
      if (el === useCustom) toggleColorInputs();
      updatePreview();
    }));

  // --- Load campaign ---
  const params = new URLSearchParams(window.location.search);
  const campaignId = parseInt(params.get("id"));
  const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
  const campaign = campaigns[campaignId];

  if (!campaign) {
    alert("Campaign not found.");
    window.location.href = "dashboard.html";
    return;
  }

  // כותרת דף
  const campaignTitle = document.getElementById("campaign-title");
  if (campaignTitle) campaignTitle.textContent = `Editing: ${campaign.name}`;

  // טען באנר קיים
  if (campaign.banner) {
    const b = campaign.banner;
    textInput.value      = b.text || "";
    fontSelect.value     = b.font || "Arial";
    sizeSelect.value     = b.size || "square";
    if (templateSelect) templateSelect.value = b.template || "t1";

    // אם נשמרו צבעים – הפעל custom
    const hasCustom = !!(b.backgroundColor || b.textColor);
    if (useCustom) useCustom.checked = hasCustom;
    bgColorInput.value   = hasCustom ? (b.backgroundColor || "#ffffff") : "#ffffff";
    textColorInput.value = hasCustom ? (b.textColor || "#000000")       : "#000000";
  } else {
    if (templateSelect) templateSelect.value = "t1";
    if (useCustom) useCustom.checked = false;
    bgColorInput.value   = "#ffffff";
    textColorInput.value = "#000000";
  }

  toggleColorInputs();
  updatePreview();

  function renderSavedSnapshot() {
    const savedContainer = document.getElementById("saved-banner-preview");
    if (!savedContainer) return;
    savedContainer.innerHTML = "";

    if (!campaign.banner) return;

    const b = campaign.banner;
    const div = document.createElement("div");
    div.className = `banner-preview ${b.size || "square"} ${b.template || "t1"}`;
    div.textContent = b.text || "Your text here";

    // אם שמרנו Custom – ניישם אותם על ה־snapshot
    if (b.backgroundColor) div.style.backgroundColor = b.backgroundColor;
    if (b.textColor)       div.style.color = b.textColor;
    if (b.font)            div.style.fontFamily = b.font;

    const meta = document.createElement("div");
    meta.style.marginTop = "8px";
    meta.style.opacity = "0.7";
    meta.style.fontSize = ".85rem";
    meta.textContent = `Last saved: ${b.updatedAt || "-"}`;

    savedContainer.appendChild(div);
    savedContainer.appendChild(meta);
  }
  renderSavedSnapshot();

  // Save
  const saveBtn = document.getElementById("save-btn");
  saveBtn.addEventListener("click", () => {
    campaign.banner = {
      text: textInput.value,
      font: fontSelect.value,
      size: sizeSelect.value,
      template: (templateSelect?.value || "t1").trim(),
      // שומרים צבעים רק אם מסומן custom
      backgroundColor: useCustom?.checked ? bgColorInput.value : "",
      textColor:       useCustom?.checked ? textColorInput.value : "",
      updatedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Banner saved successfully!");
    renderSavedSnapshot();
  });

  // Delete
  const deleteBtn = document.getElementById("delete-banner-btn");
  deleteBtn.addEventListener("click", () => {
    if (!campaign.banner) {
      alert("No banner to delete.");
      return;
    }
    if (!confirm("Are you sure you want to delete the banner?")) return;

    delete campaign.banner;
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Banner deleted.");
    location.reload();
  });
});
