window.addEventListener("load", () => {
  renderRequests();
  setInterval(renderRequests, 1200);
});

function setStatus(text){
  document.getElementById("wStatus").innerText = text;
}

function renderRequests(){
  const box = document.getElementById("requests");
  const list = getRequests().filter(r => r.status === "NEW");

  if(list.length === 0){
    box.innerHTML = `<div class="req"><b>لا توجد طلبات جديدة</b><div>افتح صفحة العميل وسوِّ طلب</div></div>`;
    return;
  }

  box.innerHTML = list.map(r => `
    <div class="req">
      <b>طلب: ${r.service}</b>
      <div>الموقع: ${r.location}</div>
      <div>وقت الوصول المتوقع: ${r.eta} دقائق</div>
      <div class="actions">
        <button class="accept" onclick="acceptRequest(${r.id})">قبول</button>
        <button class="reject" onclick="rejectRequest(${r.id})">رفض</button>
      </div>
    </div>
  `).join("");
}

function acceptRequest(id){
  updateRequest(id, { status:"ACCEPTED", acceptedAt:new Date().toISOString() });
  setStatus("✅ تم قبول الطلب");
}

function rejectRequest(id){
  updateRequest(id, { status:"REJECTED", rejectedAt:new Date().toISOString() });
  setStatus("❌ تم رفض الطلب");
}
