
document.addEventListener("DOMContentLoaded", function () {
  const campaignInfoDiv = document.getElementById("campaign-info");
  const addBtn = document.getElementById("add-campaign");

  // שליפת כל הקמפיינים
  const stored = localStorage.getItem("campaigns");
  const campaigns = stored ? JSON.parse(stored) : [];

  // הצגת קמפיינים קיימים
  if (campaigns.length > 0) {
    campaignInfoDiv.innerHTML = "<h2>All Campaigns:</h2>";
    campaigns.forEach((c) => {
      campaignInfoDiv.innerHTML += `
        <div class="campaign-card">
          <h3>${c.name}</h3>
          <p><strong>Type:</strong> ${c.type}</p>
          <p><strong>Date:</strong> ${c.date}</p>
          <p><strong>Status:</strong> ${c.status}</p>
        </div>
      `;
    });
  } else {
    campaignInfoDiv.innerHTML = "<p>No campaigns found.</p>";
  }

  // הוספת קמפיין חדש
  if (addBtn) {//התנאי פה -אם קיים כפתור כזה אז תריץ פונקציה שנכנסת לפעולה במקרה של לחיצה עליו 
    addBtn.addEventListener("click", function () {
      const name = prompt("Enter campaign name:");
      if (!name) return;//אם המשתמש לא הכניס שם נצא מהפונקציה 

      const newCampaign = {//יצירת אוביקט חדש עם פרטי הקמפיין 
        name,
        type: "Email",
        date: new Date().toLocaleDateString(),
        status: "Draft"
      };

      campaigns.push(newCampaign);//נזרוק את האוביקט החדש למערך הקמפיינים שיצרנו 
      localStorage.setItem("campaigns", JSON.stringify(campaigns));//נעדכן את המערך בlocalstorage 
      location.reload();//נבצע רענון לדף כך שיציג את הקמפיינים המעודכנים 
    });
  }
});
//