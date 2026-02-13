let userLocation = "";

function getLocation(){
  const status = document.getElementById("status");

  if(!navigator.geolocation){
    status.innerText = "❌ جهازك لا يدعم GPS";
    return;
  }

  status.innerText = "📡 جاري تحديد موقعك...";

  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      userLocation = `${lat}, ${lng}`;
      document.getElementById("location").value = userLocation;
      status.innerText = "✅ تم تحديد موقعك";
    },
    ()=>{
      status.innerText = "❌ لم يتم السماح بتحديد الموقع";
    }
  );
}

function orderWorker(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value;
  const status = document.getElementById("status");

  if(location === ""){
    status.innerText = "⚠️ يرجى تحديد الموقع أولاً";
    return;
  }

  status.innerText = "✅ تم العثور على عامل قريب 🚶‍♂️\n⏱️ وقت الوصول: 9 دقائق";
  document.getElementById("whatsappBtn").style.display = "block";
}

function openWhatsApp(){
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value;

  const msg = `مرحبا، أحتاج عامل خدمة\nالخدمة: ${service}\nالموقع: ${location}`;
  const url = `https://wa.me/971500000000?text=${encodeURIComponent(msg)}`;

  window.open(url,"_blank");
}
