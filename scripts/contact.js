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
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
      alert("Please fill in all fields.");
      return;
    }

    // יצירת מערך לידים אם אין
    if (!campaign.leads) {
      campaign.leads = [];
    }

    campaign.leads.push({ name, email, date: new Date().toLocaleString() });

    localStorage.setItem("campaigns", JSON.stringify(campaigns));

    alert("Your details have been submitted. Thank you!");
    form.reset();
  });
});
