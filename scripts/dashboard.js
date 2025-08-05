document.addEventListener("DOMContentLoaded", function () {
  const campaignInfoDiv = document.getElementById("campaign-info");
  const addBtn = document.getElementById("add-campaign");

  // שליפת כל הקמפיינים
  const stored = localStorage.getItem("campaigns");
  const campaigns = stored ? JSON.parse(stored) : [];

  // הצגת קמפיינים קיימים
  if (campaigns.length > 0) {
    campaignInfoDiv.innerHTML = "<h2>All Campaigns:</h2>";
    campaigns.forEach((c, index) => {
      campaignInfoDiv.innerHTML += `
        <div class="campaign-card">
          <h3>${c.name}</h3>
          <p><strong>Type:</strong> ${c.type}</p>
          <p><strong>Date:</strong> ${c.date}</p>
          <label for="status-${index}"><strong>Status:</strong></label>
          <select id="status-${index}" data-index="${index}" class="status-select status-${c.status.toLowerCase()}">
            <option value="Draft" ${c.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Active" ${c.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Expired" ${c.status === 'Expired' ? 'selected' : ''}>Expired</option>
          </select>
        </div>
      `;
    });

    // האזנה לשינוי סטטוס בכל תפריט select
    document.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", function () {
        const index = this.getAttribute("data-index"); // מאיזה קמפיין הגיע השינוי
        const newStatus = this.value; // מה הערך החדש שנבחר

        campaigns[index].status = newStatus; // מעדכן את הסטטוס של הקמפיין במערך
        localStorage.setItem("campaigns", JSON.stringify(campaigns)); // שומר את הכל

        // מחליף את הצבע של התפריט בלי לרענן
        this.classList.remove("status-draft", "status-active", "status-expired");
        this.classList.add(`status-${newStatus.toLowerCase()}`);
      });
    });

  } else {
    // אם אין קמפיינים בכלל
    campaignInfoDiv.innerHTML = "<p>No campaigns found.</p>";
  }

  // הוספת קמפיין חדש
  if (addBtn) { // התנאי פה - אם קיים כפתור כזה אז תריץ פונקציה שנכנסת לפעולה במקרה של לחיצה עליו
    addBtn.addEventListener("click", function () {
      const name = prompt("Enter campaign name:");
      if (!name) return; // אם המשתמש לא הכניס שם נצא מהפונקציה

      const newCampaign = { // יצירת אובייקט חדש עם פרטי הקמפיין
        name,
        type: "Email",
        date: new Date().toLocaleDateString(),
        status: "Draft"
      };

      campaigns.push(newCampaign); // נזרוק את האובייקט החדש למערך הקמפיינים שיצרנו
      localStorage.setItem("campaigns", JSON.stringify(campaigns)); // נעדכן את המערך ב-localStorage
      location.reload(); // נבצע רענון לדף כך שיציג את הקמפיינים המעודכנים
    });
  }
});
