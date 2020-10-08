const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j'];

const keys = document.querySelectorAll('.key');
const whiteKeys = document.querySelectorAll('.key.white');
const blackKeys = document.querySelectorAll('.key.black');
const slider = document.querySelector('input');
const volume = document.querySelector('#volumeTag');
const audios = document.querySelectorAll('audio');
const incrementers = document.querySelectorAll('.increments');


incrementers[0].addEventListener('click', function() {
	var currentVolumeIncrementer = incrementers[0].innerText;
	slider.value--;
	if (volume.innerText == 0) return
	volume.innerText--;
	audios.forEach(function(audio) {
		console.log(audio)
		audio.volume = volume.innerText / 100;
	})
})

incrementers[1].addEventListener('click', function() {
	var currentVolumeIncrementer = incrementers[1].innerText;
	slider.value++;
	if (volume.innerText == 100) return
	volume.innerText++;
	audios.forEach(function(audio) {
		audio.volume = volume.innerText / 100;
	})
})

slider.oninput = function() {
	var currentValue = this.value;
	volume.innerHTML = currentValue;
	audios.forEach(function(audio) {
		audio.volume = currentValue / 100;
	})
}

keys.forEach(key => {
	key.addEventListener('click', () => playNote(key))
})

document.addEventListener('keydown', e => {
	if (e.repeat) return;

	const key = e.key;
	const whiteKeyIndex = WHITE_KEYS.indexOf(key);
	const blackKeyIndex = BLACK_KEYS.indexOf(key);

	if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex]);
	if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex]);
})

function playNote(key) {
	const noteAudio = document.getElementById(key.dataset.note);
	noteAudio.currentTime = 0;
	noteAudio.play();
	key.classList.add('active');
	noteAudio.addEventListener('ended', () => {
		key.classList.remove('active');
	})
}

var isRecording = true
var mediaRecorder
var audioChunks
var recordButton = document.getElementById('record')

function recorToggle() {
  if (isRecording) {
    isRecording = false
    recordButton.style.background = "red"
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()

        audioChunks = []
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data)
        })
      })
  } else {
    isRecording = true
    recordButton.style.background = "white"
    mediaRecorder.stop()
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    })
  }
}

