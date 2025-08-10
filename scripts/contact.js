document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const campaignId = parseInt(params.get("id"));
  const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];
  const campaign = campaigns[campaignId];

  if (!campaign) {
    alert("Campaign not found.");
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (form.name?.value || "").trim();
    const email = (form.email?.value || "").trim();
    const phone = (form.phone?.value || "").trim();

    if (!name || !email) {
      alert("נא למלא שם ואימייל");
      return;
    }

    // שמירה במערך הלידים של הקמפיין
    if (!campaign.leads) {
      campaign.leads = [];
    }
    campaign.leads.push({ name, email, phone, date: new Date().toLocaleString() });
    localStorage.setItem("campaigns", JSON.stringify(campaigns));

    // שמירה גם במערך לידים כללי
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    leads.push({ name, email, phone, createdAt: Date.now(), source: "contact" });
    localStorage.setItem("leads", JSON.stringify(leads));

    alert("הפרטים נשמרו בהצלחה!");
    form.reset();
    window.location.href = "../pages/dashboard.html";
  });
});
