const LS_PROFILE = "worker_profile_v1";
const LS_ONLINE  = "worker_online_v1";
let requests = [];

window.addEventListener("load", () => {
  loadWorker();
  renderRequests();
  setStatus("جاهز ✅");
});

function setStatus(text){
  document.getElementById("wStatus").innerText = text;
}

function saveWorker(){
  const profile = {
    name: document.getElementById("wName").value.trim(),
    phone: document.getElementById("wPhone").value.trim(),
    service: document.getElementById("wService").value,
    area: document.getElementById("wArea").value.trim()
  };

  localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
  setStatus("✅ تم حفظ بيانات العامل");
}

function loadWorker(){
  const p = JSON.parse(localStorage.getItem(LS_PROFILE) || "{}");

  document.getElementById("wName").value = p.name || "";
  document.getElementById("wPhone").value = p.phone || "";
  document.getElementById("wService").value = p.service || "تحميل أثاث";
  document.getElementById("wArea").value = p.area || "";

  const online = localStorage.getItem(LS_ONLINE) === "1";
  document.getElementById("wOnline").checked = online;
}

function toggleOnline(){
  const online = document.getElementById("wOnline").checked;
  localStorage.setItem(LS_ONLINE, online ? "1" : "0");
  setStatus(online ? "🟢 أنت الآن متاح لاستقبال الطلبات" : "⚫ أنت الآن غير متاح");
}

function getWorkerLocation(){
  if(!navigator.geolocation){
    setStatus("❌ جهازك لا يدعم GPS");
    return;
  }

  setStatus("📡 جاري تحديد موقعك...");

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const pretty = await reverseGeocodePretty(lat, lng);
      document.getElementById("wArea").value = pretty;
      setStatus("✅ تم تحديث موقعك");
    },
    () => setStatus("❌ لم يتم السماح بالموقع"),
    { enableHighAccuracy:true, timeout:12000, maximumAge:0 }
  );
}

async function reverseGeocodePretty(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers:{ "Accept":"application/json" } });
    const data = await res.json();
    const a = data.address || {};

    const road = a.road || a.pedestrian || a.path || "";
    const area = a.suburb || a.neighbourhood || a.city_district || "";
    const city = a.city || a.town || a.village || a.state || "";

    const part1 = [road, area].filter(Boolean).join("، ");
    const finalText = [part1, city].filter(Boolean).join(" - ");
    return finalText || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }catch(e){
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

function mockNewRequest(){
  const online = localStorage.getItem(LS_ONLINE) === "1";
  if(!online){
    setStatus("⚠️ فعل (متاح الآن) أولاً عشان تستقبل طلبات");
    return;
  }

  const service = document.getElementById("wService").value;
  const area = document.getElementById("wArea").value || "دبي";
  const minutes = Math.floor(5 + Math.random()*12);

  const req = {
    id: Date.now(),
    service,
    area,
    eta: minutes
  };

  requests.unshift(req);
  renderRequests();
  setStatus("📥 وصلك طلب جديد!");
}

function renderRequests(){
  const box = document.getElementById("requests");

  if(requests.length === 0){
    box.innerHTML = `<div class="req"><div class="meta"><b>لا توجد طلبات حالياً</b><div>اضغط “طلب تجريبي” للتجربة</div></div></div>`;
    return;
  }

  box.innerHTML = requests.map(r => `
    <div class="req" id="req-${r.id}">
      <div class="meta">
        <b>طلب: ${r.service}</b>
        <div>الموقع: ${r.area}</div>
        <div>وقت الوصول المتوقع: ${r.eta} دقيقة</div>
      </div>
      <div class="actions">
        <button class="accept" onclick="acceptRequest(${r.id})">قبول</button>
        <button class="reject" onclick="rejectRequest(${r.id})">رفض</button>
      </div>
    </div>
  `).join("");
}

function acceptRequest(id){
  const p = JSON.parse(localStorage.getItem(LS_PROFILE) || "{}");
  const phone = (p.phone || "971500000000").replaceAll(" ", "");

  const r = requests.find(x => x.id === id);
  if(!r) return;

  setStatus("✅ تم قبول الطلب (تجريبي)");
  document.getElementById(`req-${id}`).style.opacity = "0.55";

  const msg = `مرحبا، أنا العامل ${p.name || ""}\nتم قبول طلبك ✅\nالخدمة: ${r.service}\nالمنطقة: ${r.area}\nوقت الوصول: ${r.eta} دقيقة`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function rejectRequest(id){
  requests = requests.filter(x => x.id !== id);
  renderRequests();
  setStatus("تم رفض الطلب ❌");
}
