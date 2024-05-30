window.onload = function() {
    document.getElementById("download").addEventListener("click", () => {
      var element = document.getElementById('invoiceTable');
  
      var opt = {
        margin: [5.5, 4.5, 5.5, 4.5],
        filename: 'Proforma-invoice.pdf',  
        image: { type: 'jpeg', quality: 0.20 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      html2pdf().from(element).set(opt).save();
    });
  };
  