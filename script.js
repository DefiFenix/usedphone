// Create an audio element
var audio = new Audio("nokia_ringtone.mp3");

document.getElementById("copyButton").addEventListener("click", function () {
  var text = document.getElementById("textToCopy").innerText;
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  // Play the sound
  audio.play();

  // Show notification
  var notification = document.getElementById("notification");
  notification.style.display = "block";
  notification.style.opacity = "1";

  // Hide notification after 3 seconds
  setTimeout(function () {
    notification.style.opacity = "0";
    setTimeout(function () {
      notification.style.display = "none";
    }, 500); // Wait for the fade out to finish before hiding the element
  }, 3000);
});
