function orderWorker() {
  document.getElementById("status").innerText =
    "🔍 جاري البحث عن أقرب عامل...";
  
  setTimeout(() => {
    document.getElementById("status").innerText =
      "✅ تم العثور على عامل وسيصل خلال 10 دقائق";
  }, 2000);
}
