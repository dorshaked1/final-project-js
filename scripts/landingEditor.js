const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // שליפת האלמנטים
  const templateSelect = document.getElementById("template-select");
  const titleInput = document.getElementById("landing-title");
  const subtitleInput = document.getElementById("landing-subtitle");
  const paragraphInput = document.getElementById("landing-paragraph");
  const imageUrlInput = document.getElementById("image-url");
  const ctaTextInput = document.getElementById("cta-text");
  const bgColorInput = document.getElementById("bg-color");
  const fontSelect = document.getElementById("font-family");
  const preview = document.getElementById("landing-preview");

  // שליפת הקמפיין מה-URL
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
  document.getElementById("campaign-title").textContent = `Editing: ${campaign.name}`;

  // פונקציה לעדכון התצוגה החיה
  function updatePreview() {
    preview.className = `landing-preview ${templateSelect.value}`;
    preview.style.backgroundColor = bgColorInput.value;
    preview.style.fontFamily = fontSelect.value;

    preview.querySelector("h1").textContent = titleInput.value || "Main Title";
    preview.querySelector("h3").textContent = subtitleInput.value || "Subtitle";
    preview.querySelector("p").textContent = paragraphInput.value || "Landing page text";

    const img = preview.querySelector("img");
    if (imageUrlInput.value.trim()) {
      img.src = imageUrlInput.value.trim();
      img.style.display = "block";
    } else {
      img.src = "";
      img.style.display = "none";
    }

    preview.querySelector(".cta-btn").textContent = ctaTextInput.value || "Sign Up Now!";
  }

  // מאזינים לכל השדות
  [
    templateSelect,
    titleInput,
    subtitleInput,
    paragraphInput,
    imageUrlInput,
    ctaTextInput,
    bgColorInput,
    fontSelect
  ].forEach(el => el.addEventListener("input", updatePreview));

  // הפעלה ראשונית
  updatePreview();

  // טעינת דף נחיתה שמור אם קיים
  if (campaign.landing) {
    const landingData = campaign.landing;
    templateSelect.value = landingData.template || "template1";
    titleInput.value = landingData.title || "";
    subtitleInput.value = landingData.subtitle || "";
    paragraphInput.value = landingData.paragraph || "";
    imageUrlInput.value = landingData.imageUrl || "";
    ctaTextInput.value = landingData.ctaText || "";
    bgColorInput.value = landingData.backgroundColor || "#ffffff";
    fontSelect.value = landingData.font || "Arial";
    updatePreview();

    // הצגת הדף השמור
    const savedContainer = document.getElementById("saved-landing-preview");
    savedContainer.innerHTML = "<h3>Saved Landing Page:</h3>" + preview.outerHTML;
  }

  // כפתור שמירה
  document.getElementById("save-btn").addEventListener("click", () => {
    campaign.landing = {
      template: templateSelect.value,
      title: titleInput.value,
      subtitle: subtitleInput.value,
      paragraph: paragraphInput.value,
      imageUrl: imageUrlInput.value,
      ctaText: ctaTextInput.value,
      backgroundColor: bgColorInput.value,
      font: fontSelect.value
    };

    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Landing Page saved successfully!");

    // עדכון התצוגה השמורה
    const savedContainer = document.getElementById("saved-landing-preview");
    savedContainer.innerHTML = "<h3>Saved Landing Page:</h3>" + preview.outerHTML;
  });

  // כפתור מחיקה
  document.getElementById("delete-landing-btn").addEventListener("click", () => {
    if (!campaign.landing) {
      alert("No landing page to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete the landing page?")) return;

    delete campaign.landing;
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Landing Page deleted.");
    location.reload();
  });
  // פאנל "נכסי הקמפיין" + קיצורי עריכה
const assets = document.getElementById("campaign-assets");
assets.innerHTML = `
  <h3>Campaign Assets</h3>
  <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
    <li>
      ${campaign.banner ? "✅ Banner saved" : "❌ No banner"}
      <button class="btn-secondary" style="margin-inline-start:8px"
        onclick="location.href='banner-editor.html?id=${campaignId}'">Edit Banner</button>
    </li>
    <li>
      ${campaign.email ? "✅ Email saved" : "❌ No email"}
      <button class="btn-secondary" style="margin-inline-start:8px"
        onclick="location.href='email.editor.html?id=${campaignId}'">Edit Email</button>
    </li>
    <li>
      ${campaign.landing ? "✅ Landing saved" : "❌ No landing yet"}
      <!-- אתה כבר בעמוד הלנדינג, אז אין צורך בכפתור כאן -->
    </li>
  </ul>
`;
});
