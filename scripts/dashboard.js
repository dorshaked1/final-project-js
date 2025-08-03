document.addEventListener("DOMContentLoaded", function () {
  const campaignInfoDiv = document.getElementById("campaign-info");
  const campaignData = localStorage.getItem("campaign");
  const campaign = campaignData ? JSON.parse(campaignData) : null;

  if (campaign) {
    campaignInfoDiv.innerHTML = `
      <h3>${campaign.name}</h3>
      <p><strong>Type:</strong> ${campaign.type}</p>
      <p><strong>Date:</strong> ${campaign.date}</p>
      <p><strong>Status:</strong> ${campaign.status}</p>
    `;
  } else {
    campaignInfoDiv.innerHTML = `<p>No campaigns found.</p>`;
  }
//הוספת קמפיין חדש 
  const addBtn = document.getElementById("add-campaign");
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

    // קבלת קמפיינים קודמים
    const stored = localStorage.getItem("campaigns");
    const campaigns = stored ? JSON.parse(stored) : [];

    // הוספת החדש
    campaigns.push(newCampaign);
    localStorage.setItem("campaigns", JSON.stringify(campaigns));

    location.reload();
  });
  //סיום טווח בוספת קמפיין חדש 
}
//עדכון קמפיינים 
  const campaignInfoDiv = document.getElementById("campaign-info");
const stored = localStorage.getItem("campaigns");
const campaigns = stored ? JSON.parse(stored) : [];

if (campaigns.length > 0) {
  campaignInfoDiv.innerHTML = "<h2>All Campaigns:</h2>";
  campaigns.forEach((c, index) => {
    campaignInfoDiv.innerHTML += `
      <div class="campaign-card">
        <h3>${c.name}</h3>
        <p><strong>Type:</strong> ${c.type}</p>
        <p><strong>Date:</strong> ${c.date}</p>
        <p><strong>Status:</strong> ${c.status}</p>
      </div>
      <hr/>
    `;
  });
} else {
  campaignInfoDiv.innerHTML = `<p>No campaigns found.</p>`;
}
//סיום טווח עדכון קמפיינים 
});
