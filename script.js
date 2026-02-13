function orderWorker() {
  const status = document.getElementById("status");
  const service = document.querySelector("select").value;
  const location = document.querySelector("input").value || "غير محدد";

  status.innerHTML = "🔍 جاري البحث عن أقرب عامل...";

  setTimeout(() => {
    const eta = Math.floor(Math.random() * 8) + 5; // 5-12 دقائق
    const msg = `طلب خدمة: ${service}%0Aالموقع: ${location}%0Aالرجاء تأكيد التوفر والوقت.`;

    status.innerHTML = `
      ✅ تم العثور على عامل قريب<br>
      ⏱️ وقت الوصول المتوقع: <b>${eta} دقائق</b><br><br>
      <a class="wa" target="_blank"
         href="https://wa.me/971500000000?text=${msg}">
         تواصل واتساب مع العامل
      </a>
    `;
  }, 1500);
}
