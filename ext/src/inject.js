var control;

function updateCastVolumeAvailability() {
  var volumeBar = document.querySelector('.volume-bar');

  // Remove volumeChange event listener when cast is not connected
  volumeBar.removeEventListener('click', OnVolumeChange);

  if(!window.cast) return;

  var instance = window.cast.framework.CastContext.getInstance();
  if(instance.P != "CONNECTED") return;

  control = instance.getCurrentSession();
  if(!control) return;

  // Enable volume bar and listen on click events
  volumeBar.classList.remove("volume-bar--disabled");
  volumeBar.addEventListener('click', OnVolumeChange);

  // Show current volume in progress bar
  LoadCurrentVolume();
}

function OnVolumeChange() {
  // Base chosen volume on ui
  var volumeBarFg = document.querySelector('.volume-bar .progress-bar .progress-bar__fg');
  var transform = volumeBarFg.style.transform;
  if(!transform) return;
  
  var percentage = transform.replace("translateX(", "").replace("%)", "");
  var newVolume = 1 - Math.abs(percentage / 100);

  control.setVolume(newVolume); // Promise
}

function LoadCurrentVolume() {
  var volume = control.getVolume();
  var percentage = Math.abs(-volume) * 100 - 100;

  var volumeBarFg = document.querySelector('.volume-bar .progress-bar .progress-bar__fg');
  volumeBarFg.style.transform = "translateX(" + percentage + "%)";
}

setInterval(updateCastVolumeAvailability, 100);