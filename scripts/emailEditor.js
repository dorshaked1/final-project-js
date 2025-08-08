const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  localStorage.setItem("redirectAfterLogin", window.location.href);
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const templateSelect = document.getElementById("template-select");
  const titleInput = document.getElementById("email-title");
  const paragraphInput = document.getElementById("email-paragraph");
  const imageUrlInput = document.getElementById("image-url");
  const bgColorInput = document.getElementById("bg-color");
  const fontSelect = document.getElementById("font-family");
  const preview = document.getElementById("email-preview");

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

  function updatePreview() {
    preview.className = `email-preview ${templateSelect.value}`;
    preview.style.backgroundColor = bgColorInput.value;
    preview.style.fontFamily = fontSelect.value;

    preview.querySelector("h1").textContent = titleInput.value || "Email Title";
    preview.querySelector("p").textContent = paragraphInput.value || "Paragraph text";

    const img = preview.querySelector("img");
    if (imageUrlInput.value.trim()) {
      img.src = imageUrlInput.value.trim();
      img.style.display = "block";
    } else {
      img.src = "";
      img.style.display = "none";
    }
  }

  // מאזינים לכל השדות
  [templateSelect, titleInput, paragraphInput, imageUrlInput, bgColorInput, fontSelect].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  updatePreview();

  // טעינת מייל שמור אם קיים
  if (campaign.email) {
    const emailData = campaign.email;
    templateSelect.value = emailData.template || "template1";
    titleInput.value = emailData.title || "";
    paragraphInput.value = emailData.paragraph || "";
    imageUrlInput.value = emailData.imageUrl || "";
    bgColorInput.value = emailData.backgroundColor || "#ffffff";
    fontSelect.value = emailData.font || "Arial";
    updatePreview();

    // הצגת המייל השמור
    const savedContainer = document.getElementById("saved-email-preview");
    savedContainer.innerHTML = "<h3>Saved Email:</h3>" + preview.outerHTML;
  }

  // כפתור שמירה
  document.getElementById("save-btn").addEventListener("click", () => {
    campaign.email = {
      template: templateSelect.value,
      title: titleInput.value,
      paragraph: paragraphInput.value,
      imageUrl: imageUrlInput.value,
      backgroundColor: bgColorInput.value,
      font: fontSelect.value
    };

    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Email saved successfully!");

    // עדכון תצוגה של המייל השמור
    const savedContainer = document.getElementById("saved-email-preview");
    savedContainer.innerHTML = "<h3>Saved Email:</h3>" + preview.outerHTML;
  });

  // כפתור מחיקה
  document.getElementById("delete-email-btn").addEventListener("click", () => {
    if (!campaign.email) {
      alert("No email to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete the email?")) return;

    delete campaign.email;
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    alert("Email deleted.");
    location.reload();
  });
});
