let lastService = "";
let lastLocationText = "";

window.addEventListener("load", () => {
  // GPS تلقائي أول ما يفتح
  getLocation(true);
});

function setStatus(text){
  document.getElementById("status").innerText = text;
}

function getLocation(isAuto = false){
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
    (err) => {
      let msg = "❌ ما قدرنا نحدد موقعك";
      if(err.code === 1) msg = "❌ لازم تسمح بالموقع (Allow Location)";
      if(err.code === 3) msg = "❌ انتهى وقت تحديد الموقع";
      setStatus(msg);
      btn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

/* تحويل الإحداثيات لاسم مكان مرتب:
   مثال: "شارع كذا، القرهود - دبي" */
async function reverseGeocodePretty(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers:{ "Accept":"application/json" } });
    const data = await res.json();
    const a = data.address || {};

    // شارع
    const road = a.road || a.pedestrian || a.path || a.cycleway || "";
    const house = a.house_number || "";
    const street = (house && road) ? `${road} ${house}` : (road || "");

    // منطقة
    const area = a.suburb || a.neighbourhood || a.quarter || a.city_district || "";

    // مدينة/إمارة
    const city = a.city || a.town || a.village || a.state || "";

    // شكل نهائي جميل
    const part1 = [street, area].filter(Boolean).join("، ");
    const part2 = [city].filter(Boolean).join("");

    const finalText = [part1, part2].filter(Boolean).join(" - ");
    return finalText || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }catch(e){
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

function orderWorker(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value.trim();

  if(!location){
    setStatus("⚠️ حدد موقعك أولاً (اضغط 📡 أو اسمح بالموقع)");
    return;
  }

  lastService = service;
  lastLocationText = location;

  setStatus("✅ تم العثور على عامل قريب 🚶‍♂️\n⏱️ وقت الوصول: 9 دقائق");
  document.getElementById("whatsappBtn").style.display = "block";
}

function openWhatsApp(){
  // غيّر الرقم هنا
  const phone = "971500000000";
  const msg = `مرحبا، أحتاج عامل خدمة\nالخدمة: ${lastService}\nالموقع: ${lastLocationText}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
