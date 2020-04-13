import FitParser from "fit-file-parser";
var fs = require("fs");

const processFile = (file) => {
  var fr = new FileReader();
  let dataUrl;

  fr.readAsArrayBuffer(file);
  // Handle progress, success, and errors
  // fr.onprogress = updateProgress;
  fr.onerror = errorHandler;
  fr.onabort = () => changeStatus("Start Loading");
  fr.onloadstart = () => changeStatus("Start Loading");
  fr.onload = () => {
    changeStatus("Loaded");
  };
  fr.onloadend = (a) => {
    console.log(a);
    dataUrl = a.target.result;

    var fitParser = new FitParser({
      force: true,
      speedUnit: "km/h",
      lengthUnit: "km",
      temperatureUnit: "kelvin",
      elapsedRecordField: true,
      mode: "cascade",
    });

    // Parse your file
    fitParser.parse(dataUrl, function (error, data) {
      // Handle result of parse method
      if (error) {
        console.log(error);
      } else {
        console.log(JSON.stringify(data));
      }
    });
  };
  // Here you can perform some operations on the data asynchronously
  fr.onprogress = setProgress;

  // Updates the value of the progress bar
  const setProgress = (e) => {
    // The target is the file reader
    const fr = e.target;
    const loadingPercentage = (100 * e.loaded) / e.total;
    document.getElementById("progress-bar").value = loadingPercentage;
  };

  const changeStatus = (status) => {
    document.getElementById("status").innerHTML = status;
  };

  const loaded = (e) => {
    changeStatus("Load ended!");
    const fr = e.target;
    var result = fr.result;
    console.log("result:");
    console.log(result);
    // Here we can send the result to a server for example
  };

  const errorHandler = (e) => {
    changeStatus("Error: " + e.target.error.name);
  };

  // // Create a FitParser instance (options argument is optional)
};

document.getElementById("input").addEventListener("change", (e) => {
  const file = document.getElementById("input").files[0];
  if (file) {
    processFile(file);
  }
});
