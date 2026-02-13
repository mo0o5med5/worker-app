let userLocationText = "";
let userCoords = "";

window.addEventListener("load", () => {
  // GPS تلقائي أول ما تفتح الصفحة
  getLocation(true);
});

function getLocation(isAuto = false){
  const status = document.getElementById("status");
  const btn = document.getElementById("gpsBtn");

  if(!navigator.geolocation){
    status.innerText = "❌ جهازك لا يدعم GPS";
    return;
  }

  status.innerText = isAuto ? "📡 جاري تحديد موقعك تلقائيًا..." : "📡 جاري تحديد موقعك...";
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      userCoords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      // تحويل الإحداثيات إلى اسم مكان (مجاني عبر OpenStreetMap Nominatim)
      const place = await reverseGeocode(lat, lng);

      userLocationText = place || userCoords;
      document.getElementById("location").value = userLocationText;

      status.innerText = "✅ تم تحديد موقعك";
      btn.disabled = false;
    },
    (err) => {
      let msg = "❌ ما قدرنا نحدد موقعك";
      if(err.code === 1) msg = "❌ لازم تسمح بالموقع (Allow Location)";
      if(err.code === 3) msg = "❌ انتهى وقت تحديد الموقع";
      status.innerText = msg;
      btn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

async function reverseGeocode(lat, lng){
  try{
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await res.json();

    // display_name يعطيك اسم طويل (منطقة/شارع/مدينة)
    // نختصره لأفضل شكل
    if(data && data.address){
      const a = data.address;
      const area = a.suburb || a.neighbourhood || a.district || "";
      const city = a.city || a.town || a.village || a.state || "";
      const country = a.country || "";

      const nice = [area, city, country].filter(Boolean).join(" - ");
      return nice || data.display_name || "";
    }

    return data.display_name || "";
  }catch(e){
    return "";
  }
}

function orderWorker(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value.trim();
  const status = document.getElementById("status");

  if(location === ""){
    status.innerText = "⚠️ يرجى تحديد الموقع أولاً (اضغط 📍 أو اسمح بالموقع)";
    return;
  }

  status.innerText = "✅ تم العثور على عامل قريب 🚶‍♂️\n⏱️ وقت الوصول: 9 دقائق";
  document.getElementById("whatsappBtn").style.display = "block";
}

function openWhatsApp(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value.trim();

  const msg = `مرحبا، أحتاج عامل خدمة\nالخدمة: ${service}\nالموقع: ${location}`;
  const url = `https://wa.me/971500000000?text=${encodeURIComponent(msg)}`;

  window.open(url,"_blank");
}
