function getLocation() {
  const status = document.getElementById("status");

  if (!navigator.geolocation) {
    status.innerText = "❌ المتصفح لا يدعم GPS";
    return;
  }

  status.innerText = "📡 جاري تحديد موقعك...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById("location").value = `(${lat}, ${lng})`;
      status.innerText = "✅ تم تحديد موقعك";
    },
    () => {
      status.innerText = "❌ لم يتم السماح بالموقع";
    }
  );
}

function orderWorker() {
  const loc = document.getElementById("location").value;
  const status = document.getElementById("status");

  if (!loc) {
    status.innerText = "⚠️ حدد موقعك أولاً";
    return;
  }

  status.innerText = "🚚 تم إرسال الطلب بنجاح";
}
