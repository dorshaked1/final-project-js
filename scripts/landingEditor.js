// Auth guard
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

// Utilities
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
function getCampaigns() {
  try {
    return JSON.parse(localStorage.getItem(`campaigns_${currentUser}`) || "[]");
  } catch {
    return [];
  }
}
function saveCampaigns(campaigns) {
  localStorage.setItem(`campaigns_${currentUser}`, JSON.stringify(campaigns));
}
function clampText(str, max = 120) {
  if (!str) return "";
  return String(str).length > max ? String(str).slice(0, max) + "…" : str;
}

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const templateSelect   = document.getElementById("template-select");
  const titleInput       = document.getElementById("landing-title");
  const subtitleInput    = document.getElementById("landing-subtitle");
  const paragraphInput   = document.getElementById("landing-paragraph");
  const imageUrlInput    = document.getElementById("image-url");
  const ctaTextInput     = document.getElementById("cta-text");
  const bgColorInput     = document.getElementById("bg-color");
  const fontSelect       = document.getElementById("font-family");
  const preview          = document.getElementById("landing-preview");
  const saveBtn          = document.getElementById("save-btn");
  const deleteBtn        = document.getElementById("delete-landing-btn");
  const savedPreview     = document.getElementById("saved-landing-preview");
  const campaignTitleEl  = document.getElementById("campaign-title");
  const contactBtnCheckbox = document.getElementById("enable-contact-button"); // חדש (אופציונלי ב-HTML)

  // State
  const campaigns = getCampaigns();
  const campaignIdRaw = getParam("id");
  const campaignId = campaignIdRaw !== null ? Number(campaignIdRaw) : NaN;
  const hasValidId = Number.isInteger(campaignId) && campaignId >= 0 && campaignId < campaigns.length;
  const campaign = hasValidId ? campaigns[campaignId] : null;

  // Helpers
  function ensureValidCampaignOrWarn() {
    if (!hasValidId || !campaign) {
      alert("No campaign selected. Go back to Dashboard and open a specific campaign.");
      return false;
    }
    return true;
  }

  // Header
  if (campaignTitleEl) {
    campaignTitleEl.textContent = hasValidId && campaign?.name
      ? `Campaign: ${campaign.name}`
      : "Campaign: (none selected)";
  }

  // Preview element parts (לא חובה שיופיעו ב-DOM – נבדוק בנוכחות)
  const previewH1   = preview?.querySelector("h1");
  const previewH3   = preview?.querySelector("h3");
  const previewP    = preview?.querySelector("p");
  const previewImg  = preview?.querySelector("img");
  const previewBtn  = preview?.querySelector(".cta-btn");

  // Live preview
  function applyPreview() {
    if (!preview) return;

    // Template classes
    preview.classList.remove("template1", "template2", "template3");
    if (templateSelect?.value) preview.classList.add(templateSelect.value);

    // Styles
    preview.style.backgroundColor = bgColorInput?.value || "#ffffff";
    preview.style.fontFamily = fontSelect?.value || "Arial, sans-serif";

    // Texts
    if (previewH1) previewH1.textContent = titleInput?.value || "Main Title";
    if (previewH3) previewH3.textContent = subtitleInput?.value || "Subtitle";
    if (previewP)  previewP.textContent  = paragraphInput?.value || "Landing page text";

    // Image
    if (previewImg) {
      const src = (imageUrlInput?.value || "").trim();
      previewImg.style.display = src ? "block" : "none";
      previewImg.src = src || "";
    }

    // CTA button
    if (previewBtn) previewBtn.textContent = ctaTextInput?.value || "Sign Up Now!";

    // Contact button (נוסיף/נסיר לפי הצ'קבוקס)
    const oldContact = preview.querySelector(".contact-btn");
    if (oldContact) oldContact.remove();

    if (contactBtnCheckbox?.checked && hasValidId) {
      const a = document.createElement("a");
      a.className = "cta-btn contact-btn";
      a.textContent = "Contact Us";
      a.href = `contact.html?id=${campaignId}`;
      a.style.marginInlineStart = "8px";
      preview.appendChild(a);
    }
  }

  // Bind inputs to preview
  [
    templateSelect,
    titleInput, subtitleInput, paragraphInput,
    imageUrlInput, ctaTextInput,
    bgColorInput, fontSelect,
    contactBtnCheckbox
  ].forEach(el => el && el.addEventListener("input", applyPreview));

  // Load existing landing into form
  if (campaign?.landing) {
    const {
      template = "template1",
      title = "",
      subtitle = "",
      paragraph = "",
      imageUrl = "",
      ctaText = "",
      bgColor = "#ffffff",
      font = "Arial",
      contactButtonEnabled = false
    } = campaign.landing;

    if (templateSelect) templateSelect.value = template;
    if (titleInput) titleInput.value = title;
    if (subtitleInput) subtitleInput.value = subtitle;
    if (paragraphInput) paragraphInput.value = paragraph;
    if (imageUrlInput) imageUrlInput.value = imageUrl;
    if (ctaTextInput) ctaTextInput.value = ctaText;
    if (bgColorInput) bgColorInput.value = bgColor;
    if (fontSelect)  fontSelect.value = font;
    if (contactBtnCheckbox) contactBtnCheckbox.checked = !!contactButtonEnabled;
  }
  applyPreview();

  // Saved snapshot (read-only)
  function renderSavedSnapshot() {
    if (!savedPreview) return;
    savedPreview.innerHTML = "";
    if (!campaign?.landing) return;

    const l = campaign.landing;
    const wrapper = document.createElement("div");
    wrapper.className = `landing-preview ${l.template || "template1"}`;
    wrapper.style.backgroundColor = l.bgColor || "#ffffff";
    wrapper.style.fontFamily = l.font || "Arial, sans-serif";
    wrapper.style.border = "1px solid #ddd";
    wrapper.style.marginTop = "16px";
    wrapper.style.padding = "16px";

    const contactBadge = l.contactButtonEnabled ? `<span style="margin-left:8px;font-size:.85rem;">(Contact button enabled)</span>` : "";

    wrapper.innerHTML = `
      <h1>${clampText(l.title || "Main Title", 60)}</h1>
      <h3>${clampText(l.subtitle || "Subtitle", 80)}</h3>
      <p>${clampText(l.paragraph || "Landing page text", 180)}</p>
      ${l.imageUrl ? `<img src="${l.imageUrl}" alt="Landing Image" style="max-width:100%;height:auto;">` : ""}
      <div style="margin-top:8px;">
        <button class="cta-btn">${clampText(l.ctaText || "Sign Up Now!", 32)}</button>
        ${contactBadge}
      </div>
      <div style="margin-top:8px;font-size:.85rem;opacity:.7">Last saved: ${l.updatedAt || "-"}</div>
    `;
    savedPreview.appendChild(wrapper);
  }
  renderSavedSnapshot();

  // Save
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!ensureValidCampaignOrWarn()) return;

      // מינימום ולידציה
      if (!titleInput.value.trim()) {
        alert("Please provide a main title.");
        titleInput.focus();
        return;
      }

      const payload = {
        template: templateSelect?.value || "template1",
        title: titleInput?.value.trim() || "",
        subtitle: subtitleInput?.value.trim() || "",
        paragraph: paragraphInput?.value.trim() || "",
        imageUrl: imageUrlInput?.value.trim() || "",
        ctaText: ctaTextInput?.value.trim() || "",
        bgColor: bgColorInput?.value || "#ffffff",
        font: fontSelect?.value || "Arial",
        contactButtonEnabled: !!contactBtnCheckbox?.checked,
        updatedAt: new Date().toLocaleString(),
      };

      campaigns[campaignId].landing = payload;
      saveCampaigns(campaigns);
      alert("Landing page saved.");
      renderSavedSnapshot();
    });
  }

  // Delete
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (!ensureValidCampaignOrWarn()) return;
      if (!campaigns[campaignId].landing) {
        alert("No landing page to delete.");
        return;
      }
      if (!confirm("Delete landing page for this campaign?")) return;

      delete campaigns[campaignId].landing;
      saveCampaigns(campaigns);
      alert("Landing page deleted.");

      // Clear form & preview
      if (templateSelect) templateSelect.value = "template1";
      if (titleInput) titleInput.value = "";
      if (subtitleInput) subtitleInput.value = "";
      if (paragraphInput) paragraphInput.value = "";
      if (imageUrlInput) imageUrlInput.value = "";
      if (ctaTextInput) ctaTextInput.value = "";
      if (bgColorInput) bgColorInput.value = "#ffffff";
      if (fontSelect)  fontSelect.value = "Arial";
      if (contactBtnCheckbox) contactBtnCheckbox.checked = false;

      applyPreview();
      renderSavedSnapshot();
    });
  }
});
