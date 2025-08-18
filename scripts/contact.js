document.addEventListener("DOMContentLoaded", () => {

  const currentUser = localStorage.getItem("currentUser"); // המשתמש הנוכחי המחובר

  const params = new URLSearchParams(window.location.search); // ניצור אוביקט נוח לקריאת פרמטרים מ-URL

  const campaignId = parseInt(params.get("id")); // מוצא את הפרמטר id והופך אותו למספר שלם — זהו האינדקס של הקמפיין במערך

  const campaigns = JSON.parse(localStorage.getItem(`campaigns_${currentUser}`)) || []; // שולף את כל הקמפיינים מה-LocalStorage לפי המשתמש
  const campaign = campaigns[campaignId]; // בוחר את הקמפיין הספציפי לפי id שקיבלנו

  if (!campaign) {
    alert("Campaign not found.");
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("contact-form"); // יוצר הפנייה לטופס יצירת הקשר
  if (!form) return; // אם אין טופס – לא מתרחש כלום (יציאה מוקדמת)

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // מונע רענון של העמוד

    const name  = (form.name?.value || "").trim();
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
    campaign.leads.push({
      name,
      email,
      phone,
      date: new Date().toLocaleString()
    });
    localStorage.setItem(`campaigns_${currentUser}`, JSON.stringify(campaigns)); // שומר את הקמפיינים עם הלידים החדשים לפי יוזר

    // שמירה גם במערך לידים כללי לפי יוזר
    const allLeads = JSON.parse(localStorage.getItem(`leads_${currentUser}`) || "[]");
    allLeads.push({
      name,
      email,
      phone,
      createdAt: Date.now(),
      source: "contact"
    });
    localStorage.setItem(`leads_${currentUser}`, JSON.stringify(allLeads));

    alert("Lead saved successfully.");
    form.reset();
    window.location.href = "../pages/dashboard.html";
  });
});
