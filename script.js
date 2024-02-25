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

const rangeInput = document.getElementById("customCompression");
const rangeValue = document.getElementById("range-value");
rangeInput.addEventListener("input", function () {
  rangeValue.textContent = this.value + "%";
});

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

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();

  img.onload = function () 
  {
    var inputFormat = imageFile.type.split("/")[1];
    //console.log("input format: " + inputFormat);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (!convertCheckbox.checked) 
    {
      targetFormate = inputFormat;
      //console.log("target formate" + targetFormate);
    }
    var string = "image/" + targetFormate;
    //console.log("Target format: " + string);
    //console.log("Compression quality: " + compressionQuality / 100);
    var processedImageData = canvas.toDataURL(string, compressionQuality / 100);
    var processedImage = dataURLToBlob(processedImageData);

    // Trigger the download
    downloadImage(processedImage, expectedSize, compressionQuality, targetFormate);
  };

  img.src = URL.createObjectURL(imageFile);

  // Disable start button while processing
  startButton.disabled = true;
}

function downloadImage(image, expectedSize, compressionQuality, targetFormate) 
{
  var downloadButton = document.getElementById("downloadButton");
  var url = URL.createObjectURL(image);
  var outputSize = image.size / 1000;
  
  if (compressCheckbox.checked) {
    if (outputSize > expectedSize && compressionQuality > 5) 
    {
      //console.log("Output size still larger than expected, further compressing...");
      // Recursive call with decreased compression quality
      processImageWithQualityAdjustment(image, expectedSize, compressionQuality - 5, targetFormate);
    } 
    else 
    {
      //console.log("Output size within acceptable range.");
      // Set the URL as the href attribute of the download button
      downloadButton.setAttribute("href", url);
      downloadButton.setAttribute("download", "Output_img");
            
      // Show the download button
      downloadButton.style.display = "inline-block";

      // Re-enable start button
      document.getElementById("startButton").disabled = false;
    }
  } 
  else 
  {
    // Set the URL as the href attribute of the download button
    downloadButton.setAttribute("href", url);
    downloadButton.setAttribute("download", "Output_img");

    // Show the download button
    downloadButton.style.display = "inline-block";
    
    // Re-enable start button
    document.getElementById("startButton").disabled = false;
  }
}

function processImageWithQualityAdjustment(image, expectedSize, newQuality, targetFormate) 
{
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();

  img.onload = function () 
  {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (targetFormate == "png") targetFormate = "jpeg";
    var string = "image/" + targetFormate;
    // console.log("Target format: " + string);
    //console.log("Compression quality: " + newQuality / 100);
   
    var processedImageData = canvas.toDataURL(string, newQuality / 100);
    var processedImage = dataURLToBlob(processedImageData);

     // Trigger the download
    downloadImage(processedImage, expectedSize, newQuality, targetFormate);
  };
    img.src = URL.createObjectURL(image);

}
