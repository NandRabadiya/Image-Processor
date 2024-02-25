function toggleCompressionOptions() {
  var compressionOptions = document.getElementById("compressionOptions");
  compressionOptions.style.display = document.getElementById("compressCheckbox").checked? "block" : "none";
}

function toggleConversionOptions() {
  var formatSelect = document.getElementById("formatSelect");
  formatSelect.disabled = !document.getElementById("convertCheckbox").checked;
}

function dataURLToBlob(dataURL) {
   var parts = dataURL.split(";base64,");
   var contentType = parts[0].split(":")[1];
   var raw = window.atob(parts[1]);
   var rawLength = raw.length;
   var uInt8Array = new Uint8Array(rawLength);
  
   for (var i = 0; i < rawLength; ++i) {
     uInt8Array[i] = raw.charCodeAt(i);
   }
  
  return new Blob([uInt8Array], { type: contentType });
}

function previewImage(event) {
  var input = event.target;
  var image = document.getElementById("preview");

  if (input.files && input.files[0]) 
  {
    var reader = new FileReader();
    reader.onload = function (e) 
    {
      image.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function processImage() {
  var fileInput = document.getElementById("imageInput");

  var compressCheckbox = document.getElementById("compressCheckbox");
  var convertCheckbox = document.getElementById("convertCheckbox");

  var startButton = document.getElementById("startButton");
  var downloadButton = document.getElementById("downloadButton");

  var imageFile = fileInput.files[0];
  var inputSize = imageFile.size / 1000;
  //console.log("Original size: " + inputSize);
  var compressionQuality = 100; // Default compression quality
  var expectedSize = inputSize;

  if (compressCheckbox.checked) 
  {
    var compressionOption = document.querySelector(
      'input[name="compression"]:checked'
    ).value;

    if (compressionOption === "low")       //low => low quality & more compression
    {
      compressionPercentage = 80;
      expectedSize = inputSize * (1 - compressionPercentage / 100); // Reduce by 80%
    } 
    else if (compressionOption === "high")       //high => high quality & less compression
    {
      compressionPercentage = 30;
      expectedSize = inputSize * (1 - compressionPercentage / 100); // Reduce by 30%
    } 
    else if (compressionOption === "custom") 
    {
      compressionPercentage = document.getElementById("customCompression").value;
      expectedSize = inputSize * (1 - compressionPercentage / 100); // Reduce by custom percentage
    }
  }
  //console.log("Expected size: " + expectedSize);
  
  var targetFormate;
  if (convertCheckbox.checked) 
  {
    targetFormate = document.getElementById("formatSelect").value;
  }
  // console.log("Target format: " + targetFormat);
  //console.log("Compression quality: " + compressionQuality);

}
