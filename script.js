function toggleCompressionOptions() {
  var compressionOptions = document.getElementById("compressionOptions");
  compressionOptions.style.display = document.getElementById("compressCheckbox").checked? "block" : "none";
}

function toggleConversionOptions() {
  var formatSelect = document.getElementById("formatSelect");
  formatSelect.disabled = !document.getElementById("convertCheckbox").checked;
}
