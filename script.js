let lastService = "";
let lastLocationText = "";
let lastReqId = null;

window.addEventListener("load", () => {
  getLocation(true);
});

function setStatus(text){
  document.getElementById("status").innerText = text;
}

function getLocation(isAuto=false){
  const btn = document.getElementById("gpsBtn");
  const locInput = document.getElementById("location");

  if(!navigator.geolocation){
    setStatus("❌ جهازك لا يدعم GPS");
    return;
  }

  setStatus(isAuto ? "📡 جاري تحديد موقعك تلقائيًا..." : "📡 جاري تحديد موقعك...");
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const pretty = await reverseGeocodePretty(lat, lng);
      locInput.value = pretty;
      lastLocationText = pretty;

      setStatus("✅ تم تحديد موقعك");
      btn.disabled = false;
    },
    () => {
      setStatus("❌ لم يتم السماح بالموقع");
      btn.disabled = false;
    },
    { enableHighAccuracy:true, timeout:12000, maximumAge:0 }
  );
}

async function reverseGeocodePretty(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
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

function orderWorker(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value.trim();

  if(!location){
    setStatus("⚠️ حدد موقعك أولاً (اضغط 📍 أو اسمح بالموقع)");
    return;
  }

  lastService = service;
  lastLocationText = location;

  const req = {
    id: Date.now(),
    service,
    location,
    status: "NEW",
    eta: 9,
    createdAt: new Date().toISOString()
  };

  addRequest(req);
  lastReqId = req.id;

  setStatus("✅ تم إرسال الطلب للعامل 👷‍♂️\n⏱️ وقت الوصول المتوقع: 9 دقائق");
  document.getElementById("whatsappBtn").style.display = "none";

  watchStatus();
}

function watchStatus(){
  const timer = setInterval(() => {
    const req = getRequests().find(r => r.id === lastReqId);
    if(!req) return;

    if(req.status === "ACCEPTED"){
      setStatus("✅ تم قبول طلبك ✅\n🚗 العامل في الطريق");
      document.getElementById("whatsappBtn").style.display = "block";
      clearInterval(timer);
    }

    if(req.status === "REJECTED"){
      setStatus("❌ تم رفض الطلب");
      clearInterval(timer);
    }
  }, 1000);
}

function openWhatsApp(){
  const phone = "971500000000"; // حط رقم العامل/الشركة
  const msg = `مرحبا، هذا طلب خدمة\nالخدمة: ${lastService}\nالموقع: ${lastLocationText}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}
