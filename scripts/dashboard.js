const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  // נשמור את העמוד שרצו להיכנס אליו
  localStorage.setItem("redirectAfterLogin", window.location.href);

  // נעביר ל־login
  alert("You must be logged in to access this page.");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const campaignInfoDiv = document.getElementById("campaign-info");
  const addBtn = document.getElementById("add-campaign");

  // שליפת כל הקמפיינים
  const stored = localStorage.getItem("campaigns");
  const campaigns = stored ? JSON.parse(stored) : [];

  // הצגת קמפיינים קיימים
  if (campaigns.length > 0) {
    let html = "<h2>All Campaigns:</h2>";

    campaigns.forEach((c, index) => {
      html += `
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

          <div class="editor-buttons">
            <button onclick="location.href='banner-editor.html?id=${index}'">🖼️ Edit Banner</button>
            <button onclick="location.href='email.editor.html?id=${index}'">📧 Edit Email</button>
            <button onclick="location.href='landing-editor.html?id=${index}'">🌐 Edit Landing</button>
            <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
          </div>
        </div>
      `;
    });

    campaignInfoDiv.innerHTML = html;

    // האזנה למחיקת קמפיינים (הצלה של אירועים)
    campaignInfoDiv.addEventListener("click", function (e) {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;

      const indexToDelete = parseInt(btn.getAttribute("data-index"));

      const confirmDelete = confirm("Are you sure you want to delete this campaign?");
      if (!confirmDelete) return;

      campaigns.splice(indexToDelete, 1);
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
      location.reload();
    });

    // האזנה לשינוי סטטוס
    document.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", function () {
        const index = this.getAttribute("data-index");
        const newStatus = this.value;

        campaigns[index].status = newStatus;
        localStorage.setItem("campaigns", JSON.stringify(campaigns));

        this.classList.remove("status-draft", "status-active", "status-expired");
        this.classList.add(`status-${newStatus.toLowerCase()}`);
      });
    });

  } else {
    campaignInfoDiv.innerHTML = "<p>No campaigns found.</p>";
  }

  // הוספת קמפיין חדש
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      const name = prompt("Enter campaign name:");
      if (!name) return;

      const newCampaign = {
        name,
        type: "Email",
        date: new Date().toLocaleDateString(),
        status: "Draft"
      };

      campaigns.push(newCampaign);
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
      location.reload();
    });
  }

  // הצגת לידים
  const btnShow = document.getElementById("btn-show-leads");
  const btnHide = document.getElementById("btn-hide-leads");
  const panel = document.getElementById("leads-panel");
  const table = document.getElementById("leads-table");
  const tbody = table?.querySelector("tbody");
  const empty = document.getElementById("leads-empty");

  if (!btnShow || !panel || !tbody) return;

  function getLeads() {
    try { return JSON.parse(localStorage.getItem("leads") || "[]"); }
    catch { return []; }
  }

  function fmt(ts) {
    if (!ts) return "";
    try { return new Date(ts).toLocaleString(); } catch { return String(ts); }
  }

  function renderLeads() {
    const leads = getLeads();
    tbody.innerHTML = "";

    if (!leads.length) {
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";

    leads.forEach(l => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${l.name ?? ""}</td>
        <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${l.email ?? ""}</td>
        <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${l.phone ?? ""}</td>
        <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${l.source ?? ""}</td>
        <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${l.createdAt ? fmt(l.createdAt) : (l.date ?? "")}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  btnShow.addEventListener("click", () => {
    renderLeads();
    panel.style.display = "block";
    btnShow.style.display = "none";
    btnHide.style.display = "inline-block";
  });

  btnHide.addEventListener("click", () => {
    panel.style.display = "none";
    btnShow.style.display = "inline-block";
    btnHide.style.display = "none";
  });
});



/**

 * תרשים זרימה  של התנהגות הדף:
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 1) בדיקת התחברות                                                   │
 *  │    - קורא localStorage.currentUser                                  │
 *  │    - אם אין: שומר redirectAfterLogin ומפנה ל-login.html             │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 2) DOMContentLoaded                                                 │
 *  │    - שליפת campaigns מ-localStorage (או [])                         │
 *  │    - אחיזות ל-DOM: #campaign-info, #add-campaign, כפתורי leads     │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 3) רנדר קמפיינים                                                   │
 *  │    - בניית HTML של כרטיסים + select לסטטוס + כפתור Delete         │
 *  │    - הצבה בבת אחת עם innerHTML                                     │
 *  │    - חיבור מאזין change לכל select כדי:                             │
 *  │        * לעדכן campaigns[idx].status                                │
 *  │        * לשמור ל-localStorage                                       │
 *  │        * לעדכן קלאס צבע (status-*)                                  │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 4) מחיקת קמפיין (האצלת אירועים)                                    │
 *  │    - מאזין click אחד על #campaign-info                              │
 *  │    - בודק closest('.delete-btn')                                    │
 *  │    - מאשר מחיקה → splice מהמערך → שמירה ל-localStorage             │
 *  │    - רענון/רנדר מחדש (בגרסה הנוכחית: location.reload)              │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 5) הוספת קמפיין                                                    │
 *  │    - בלחיצה על #add-campaign: prompt לשם                            │
 *  │    - דוחף אובייקט חדש {name,type,date,status:"Draft"}              │
 *  │    - שמירה ל-localStorage + רענון/רנדר                              │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 *  ┌─────────────────────────────────────────────────────────────────────┐
 *  │ 6) הצגת/הסתרת לידים                                                │
 *  │    - Show: קורא leads מ-localStorage, מרנדר לטבלה, מציג פאנל        │
 *  │    - Hide: מחביא פאנל ומחזיר מצב כפתורים                           │
 *  └─────────────────────────────────────────────────────────────────────┘
 *
 * הערות:
 * - האצלת אירועים למחיקה מונעת כפילויות מאזינים.
 * - שמירת מצב תמיד דרך localStorage לשחזור מלא ברענון.
 * - ניתן להחליף location.reload() בקריאה ל-render כדי להימנע מרענון מלא.
 */
