document.addEventListener('DOMContentLoaded', function() {

    let audioContext;

    function playUiSound(type) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioContext = audioContext || new AudioContext();
        if (audioContext.state === 'suspended') audioContext.resume();

        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const settings = {
            pop: { start: 520, end: 110, duration: .16, wave: 'sine', volume: .12 },
            blast: { start: 240, end: 55, duration: .34, wave: 'sawtooth', volume: .14 },
            paper: { start: 360, end: 190, duration: .22, wave: 'triangle', volume: .08 },
            click: { start: 300, end: 180, duration: .1, wave: 'square', volume: .06 },
            sparkle: { start: 760, end: 980, duration: .18, wave: 'sine', volume: .1 }
        }[type] || { start: 300, end: 180, duration: .1, wave: 'sine', volume: .06 };

        oscillator.type = settings.wave;
        oscillator.frequency.setValueAtTime(settings.start, now);
        oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration);
        gain.gain.setValueAtTime(settings.volume, now);
        gain.gain.exponentialRampToValueAtTime(.001, now + settings.duration);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + settings.duration);
    }

    document.addEventListener('click', (event) => {
        const control = event.target.closest('button, a');
        if (!control) return;
        if (control.classList.contains('story-balloon')) {
            playUiSound('blast');
        } else if (control.id === 'envelope') {
            playUiSound('paper');
        } else if (control.id === 'heart-target' || control.id === 'blow-candle-button') {
            playUiSound('sparkle');
        } else if (control.classList.contains('page-nav-next')) {
            if (control.getAttribute('href') === 'index.html') {
                sessionStorage.removeItem(musicStartedKey);
                sessionStorage.removeItem(musicTimeKey);
            } else if (typeof saveMusicState === 'function') {
                saveMusicState();
            }
        } else {
            playUiSound('click');
        }
    });

    document.querySelectorAll('.page-nav-next').forEach((link) => {
        if (link.getAttribute('href') !== 'index.html') {
            link.textContent = 'Continue';
        }
    });

    document.querySelectorAll('.story-balloon').forEach((balloon) => {
        balloon.addEventListener('click', () => {
            if (balloon.classList.contains('is-popped')) return;
            const message = document.getElementById(balloon.getAttribute('aria-controls'));
            const isExpanded = balloon.getAttribute('aria-expanded') === 'true';
            if (!message) return;
            balloon.setAttribute('aria-expanded', String(!isExpanded));
            message.classList.toggle('is-visible', !isExpanded);
            balloon.classList.add('is-popped');
            window.setTimeout(() => balloon.classList.add('is-gone'), 420);
        });
    });

    const envelope = document.getElementById('envelope');
    const letterPrompt = document.getElementById('letter-prompt');
    if (envelope) {
        const closeEnvelope = () => {
            envelope.setAttribute('aria-expanded', 'false');
            if (letterPrompt) {
                letterPrompt.textContent = 'Open to see a sweet message';
            }
        };

        envelope.addEventListener('click', () => {
            const isOpen = envelope.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeEnvelope();
                return;
            }
            envelope.setAttribute('aria-expanded', 'true');
            if (letterPrompt) letterPrompt.textContent = 'A little message, just for you';
        });

        document.addEventListener('click', (event) => {
            if (envelope.getAttribute('aria-expanded') === 'true' && !envelope.contains(event.target)) {
                closeEnvelope();
            }
        });
    }

    const heartGate = document.getElementById('heart-gate');
    const heartTarget = document.getElementById('heart-target');
    const heartPrompt = document.getElementById('heart-prompt');
    const cakeWelcome = document.getElementById('cake-welcome');
    const cakeNavigation = document.getElementById('cake-navigation');

    if (heartTarget && heartGate && cakeWelcome && cakeNavigation) {
        heartTarget.addEventListener('click', () => {
            if (heartGate.classList.contains('is-blasting')) return;
            heartGate.classList.add('is-blasting');
            heartTarget.disabled = true;
            if (heartPrompt) heartPrompt.textContent = 'Surprise unlocked!';
            window.setTimeout(() => {
                heartGate.hidden = true;
                cakeWelcome.hidden = false;
                cakeNavigation.hidden = false;
                document.body.classList.add('cake-revealed');
                if (window.AOS) AOS.refresh();
            }, 700);
        });
    }

    // --- Birthday Celebration ---
    const blowCandleButton = document.getElementById('blow-candle-button');
    const balloonShower = document.getElementById('balloon-shower');
    const candleFlame = document.getElementById('candle-flame');
    const blowCountdown = document.getElementById('blow-countdown');
    const musicStartedKey = 'birthdayMusicStarted';
    const musicTimeKey = 'birthdayMusicTime';
    const musicSource = new URL('./background sound/Aoi Teshima - Mori No Chiisana Restaurant Lyrics (KANROMENG).mp3', window.location.href).href;
    const backgroundMusic = new Audio(musicSource);
    backgroundMusic.loop = true;
    backgroundMusic.preload = 'auto';
    backgroundMusic.volume = 0.35;
    let celebrationStarted = false;
    let countdownStarted = false;

    if (blowCandleButton && cakeWelcome && cakeWelcome.hidden) {
        localStorage.removeItem(musicStartedKey);
        localStorage.removeItem(musicTimeKey);
    }

    function saveMusicState() {
        try {
            if (backgroundMusic && Number.isFinite(backgroundMusic.currentTime)) {
                localStorage.setItem(musicTimeKey, String(backgroundMusic.currentTime));
            }
            if (celebrationStarted) {
                localStorage.setItem(musicStartedKey, 'true');
            }
        } catch (error) {
            // Ignore storage issues on restricted browsers.
        }
    }

    function ensureMusicPlays() {
        backgroundMusic.muted = false;
        backgroundMusic.volume = 0.35;
        const playPromise = backgroundMusic.play();

        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => {
                localStorage.setItem(musicStartedKey, 'true');
            }).catch(() => {
                const resumeOnInteraction = () => {
                    backgroundMusic.play().catch(() => {});
                    document.removeEventListener('pointerdown', resumeOnInteraction);
                    document.removeEventListener('keydown', resumeOnInteraction);
                    document.removeEventListener('touchstart', resumeOnInteraction);
                };
                document.addEventListener('pointerdown', resumeOnInteraction, { once: true });
                document.addEventListener('keydown', resumeOnInteraction, { once: true });
                document.addEventListener('touchstart', resumeOnInteraction, { once: true });
            });
        }
    }

    function resumeBackgroundMusic() {
        try {
            const savedTime = Number(localStorage.getItem(musicTimeKey));
            if (Number.isFinite(savedTime) && savedTime > 0) {
                backgroundMusic.currentTime = savedTime;
            }
        } catch (error) {
            // Ignore storage issues on restricted browsers.
        }
        ensureMusicPlays();
    }

    const musicSaveTimer = () => {
        if (!window.__birthdayMusicSaveTimer) {
            window.__birthdayMusicSaveTimer = window.setInterval(saveMusicState, 500);
        }
    };

    if (localStorage.getItem(musicStartedKey) === 'true') {
        resumeBackgroundMusic();
        musicSaveTimer();
        window.addEventListener('pagehide', saveMusicState);
        window.addEventListener('beforeunload', saveMusicState);
    }

    function blowCandle() {
        if (celebrationStarted) return;
        celebrationStarted = true;
        localStorage.setItem(musicStartedKey, 'true');
        ensureMusicPlays();
        musicSaveTimer();
        window.addEventListener('pagehide', saveMusicState);
        window.addEventListener('beforeunload', saveMusicState);
        if (candleFlame) candleFlame.classList.add('is-blown-out');
        if (blowCountdown) blowCountdown.innerHTML = 'Make a wish! <strong>Happy Birthday!</strong>';
        if (blowCandleButton) {
            blowCandleButton.textContent = 'Candle Blown!';
            blowCandleButton.disabled = true;
        }
        document.body.classList.add('celebration-started');
        createBalloons();
    }

    if (blowCandleButton) {
        blowCandleButton.addEventListener('click', () => {
            if (countdownStarted || celebrationStarted) return;
            countdownStarted = true;
            blowCandleButton.disabled = true;
            backgroundMusic.muted = true;
            backgroundMusic.play().catch(() => {});
            let countdownValue = 3;
            if (blowCountdown) {
                blowCountdown.innerHTML = `Blow the candle in <strong>${countdownValue}</strong> seconds`;
            }
            const countdownTimer = window.setInterval(() => {
                countdownValue -= 1;
                if (countdownValue > 0) {
                    blowCountdown.innerHTML = `Blow the candle in <strong>${countdownValue}</strong> second${countdownValue === 1 ? '' : 's'}`;
                } else {
                    window.clearInterval(countdownTimer);
                    blowCandle();
                }
            }, 1000);
        });
    }

    function createBalloons() {
        const colors = ['#ff7f9c', '#ffd166', '#7bdff2', '#b8f2e6', '#cdb4db'];
        for (let index = 0; index < 18; index++) {
            const balloon = document.createElement('span');
            balloon.className = 'balloon';
            balloon.style.setProperty('--balloon-color', colors[index % colors.length]);
            balloon.style.setProperty('--balloon-left', `${4 + Math.random() * 92}%`);
            balloon.style.setProperty('--balloon-delay', `${Math.random() * 1.8}s`);
            balloon.style.setProperty('--balloon-duration', `${5 + Math.random() * 4}s`);
            balloonShower.appendChild(balloon);
        }
    }

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Initialize LightGallery ---
    const gallery = document.getElementById('lightgallery');
    if (gallery) {
        lightGallery(gallery, {
            speed: 500,
            download: false
        });
    }

    // --- Hall of Fame Scroller ---
    const scroller = document.getElementById('hall-of-fame-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        const card = scroller.querySelector('.snap-center');
        const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);

        scrollRightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        scrollLeftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // --- Video Uploader ---
    const videoUploadInput = document.getElementById('video-upload');
    const videoPlayer = document.getElementById('video-player');
    const videoUploadLabel = document.getElementById('video-upload-label');

    if(videoUploadInput && videoPlayer && videoUploadLabel) {
        videoUploadLabel.addEventListener('click', () => {
            videoUploadInput.click();
        });

        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                videoPlayer.src = videoURL;
                videoPlayer.classList.remove('hidden');
                videoUploadLabel.classList.add('hidden');
                videoPlayer.play();
            }
        });
    }


    // --- Sakura Petal Animation ---
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let petals = [];
        const numPetals = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Petal() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.w = 25 + Math.random() * 15;
            this.h = 20 + Math.random() * 10;
            this.opacity = this.w / 40;
            this.flip = Math.random();
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flipSpeed = Math.random() * 0.03;
        }

        Petal.prototype.draw = function() {
            if (this.y > canvas.height || this.x > canvas.width) {
                this.x = -this.w;
                this.y = Math.random() * canvas.height * 2 - canvas.height;
                this.xSpeed = 1.5 + Math.random() * 2;
                this.ySpeed = 1 + Math.random() * 1;
                this.flip = Math.random();
            }
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
            ctx.bezierCurveTo(this.x, this.y + this.h, this.x - this.w / 2, this.y, this.x, this.y);
            ctx.closePath();
            ctx.fillStyle = '#FFB7C5';
            ctx.fill();
        }

        Petal.prototype.update = function() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.flip += this.flipSpeed;
            this.draw();
        }

        function createPetals() {
            petals = [];
            for (let i = 0; i < numPetals; i++) {
                petals.push(new Petal());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (celebrationStarted) {
                petals.forEach(petal => petal.update());
            }
            requestAnimationFrame(animate);
        }

        createPetals();
        animate();
    }
});

