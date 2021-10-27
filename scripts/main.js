const songs=["media/AC-DC.mp3","media/Aretha.mp3","media/BobMarley.mp3","media/RedHotChiliPeppers.mp3"];
const imgsSongs=["images/RAc-DC.png","images/Raretha.png","images/RBob-Marley.png","images/RRedHotChiliPeppers.png"];
const fondo=["background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 30%, rgba(255,255,255,1) 100%)","background: radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,159,255,1) 50%, rgba(0,0,0,1) 90%)","background: radial-gradient(circle, rgba(36,150,0,1) 15%, rgba(255,252,0,1) 40%, rgba(255,0,0,1) 80%)","background: radial-gradient(circle, rgba(0,0,0,1) 5%, rgba(255,0,0,1) 50%, rgba(212,212,211,1) 75%)"]
const audioEl= document.querySelector("#audio");
let current=0;
const playAudio=(id)=>{
    current=id;
    audioEl.querySelector("source").src=songs[current];
    audioEl.load();
    audioEl.play();
    document.body.style=fondo[current];
    document.getElementById("imgCancion").src=imgsSongs[current];

}
document.querySelector('#control-previous').addEventListener('click',(ev)=>{ev.preventDefault();playAudio(current === 0 ? 3 : current - 1);document.getElementById("imgCancion").src=imgsSongs[current];document.body.style=fondo[current];});
document.querySelector('#control-next').addEventListener('click',(ev)=>{ev.preventDefault();playAudio(current === 3 ? 0 : current + 1);document.getElementById("imgCancion").src=imgsSongs[current];document.body.style=fondo[current];});
document.querySelector('#control-stop').addEventListener('click',(ev)=>{ev.preventDefault();audioEl.currentTime=0;audioEl.pause();document.getElementById("imgCancion").src=imgsSongs[current];document.body.style=fondo[current];});
document.querySelector('#control-play').addEventListener('click',(ev)=>{
    ev.preventDefault();
    console.log('paused ?',audioEl.paused);
    if (audioEl.paused){
        console.log('estaba en pausa');
        audioEl.play();
    }else{
        audioEl.pause();
    }
    document.getElementById("imgCancion").src=imgsSongs[current];
    document.body.style=fondo[current];
})
audioEl.addEventListener('play',(ev)=>{
    console.log('playing',ev.target);
    document.querySelector('#control-play').textContent="pause";
})
audioEl.addEventListener('pause',(ev)=>{
    console.log('pausing',ev.target);
    document.querySelector('#control-play').textContent="play_arrow";
})
const neatTime = (time) => {
    // const hours = Math.floor((time % 86400) / 3600)
    const minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;

    return `${minutes}:${seconds}`;
};

const progressFill = document.querySelector('.progress-filled');
const textCurrent = document.querySelector('.time-current');

audioEl.addEventListener('timeupdate', (ev) => {
    progressFill.style.width = `${audioEl.currentTime / audioEl.duration * 100}%`;
    textCurrent.textContent = `${neatTime(audioEl.currentTime)} / ${neatTime(audioEl.duration)}`;
});
const progressSlider = document.querySelector('.progress');
progressSlider.addEventListener('click', ({offsetX}) => {
    const newTime = offsetX / progressSlider.offsetWidth;
    progressFill.style.width = `${newTime * 100}%`;
    audioEl.currentTime = newTime * audioEl.duration;
});
const speedBtns = document.querySelectorAll('.speed-item');

speedBtns.forEach(speedBtn => {
    speedBtn.addEventListener('click', (ev) => {
        audioEl.playbackRate = ev.target.dataset.speed;
        speedBtns.forEach((item) => item.classList.remove('active'));
        ev.target.classList.add('active');
    });
});

window.addEventListener('keydown', (ev) => {
    switch (ev.key) {
        case ' ':
            if (audioEl.paused) {
                audioEl.play();
            } else {
                audioEl.pause();
            }
            break;
        case 'ArrowRight':
            audioEl.currentTime += 5;
            break;
        case 'ArrowLeft':
            audioEl.currentTime -= 5;
            break;
    }
});
const volumeBtn = document.querySelector('#control-volume');
const volumeSlider = document.querySelector('.volume-slider');
const volumeFill = document.querySelector('.volume-filled');
let lastVolume = 1;

const syncVolume = (volume) => {
    if (volume > 0.5) {
        volumeBtn.textContent = 'volume_up';
    } else if (volume < 0.5 && volume > 0) {
        volumeBtn.textContent = 'volume_down';
    } else if (volume === 0) {
        volumeBtn.textContent = 'volume_mute';
    }
};

volumeBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (audioEl.volume) {
        lastVolume = audioEl.volume;
        audioEl.volume = 0;
        volumeBtn.textContent = 'volume_mute';
        volumeFill.style.width = '0';
    } else {
        audioEl.volume = lastVolume;
        syncVolume(audioEl.volume);
        volumeFill.style.width = `${audioEl.volume * 100}%`;
    }
});

volumeSlider.addEventListener('click', (ev) => {
    let volume = ev.offsetX / volumeSlider.offsetWidth;
    volume < 0.1 ? volume = 0 : volume;
    volumeFill.style.width = `${volume * 100}%`;
    audioEl.volume = volume;
    syncVolume(volume);
    lastVolume = volume;
});