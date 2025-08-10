document.addEventListener("DOMContentLoaded", () => {
  
  const params = new URLSearchParams(window.location.search);//ניצור אוביקט נוח לקריאת פרמטרים מurl.

  const campaignId = parseInt(params.get("id"));//מוצא את הפרמטר id  , והופך אותו למספר שלם ,זהו האינדקס של הקמפיין במערך 
  
  const campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];//שולף את כל הקמפיינים מlocal 
  const campaign = campaigns[campaignId];//בוחר את הקמפיין הספציפי לפי id שקיבלנו 

  if (!campaign) {
    alert("Campaign not found.");
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("contact-form");//יוצר הפנייה לדף יצירת הקשר
  if (!form) return;//אם אין טופס -לא מתרחש כלום -יציאה מוקדמת 

  form.addEventListener("submit", (e) => {
    e.preventDefault();//מנסה למנוע רענון עמוד 

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



    alert("lead saved")
    form.reset();
    window.location.href = "../pages/dashboard.html";
  });
});
