class Clock {
    constructor() {
        this.intervalId = null;
        this.clock = {};
    }

    init() {
        [".hour-hand", ".minute-hand", ".second-hand"].forEach(selector => {
            this.clock[selector] = document.querySelector(selector);
        });
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const secondDeg = 6 * seconds;
        const minuteDeg = 6 * minutes + 0.1 * seconds;
        const hourDeg = 30 * (hours % 12) + 0.5 * minutes;
        
        this.clock[".hour-hand"].style.transform = `rotate(${hourDeg}deg)`;
        this.clock[".minute-hand"].style.transform = `rotate(${minuteDeg}deg)`;
        this.clock[".second-hand"].style.transform = `rotate(${secondDeg}deg)`;
    }

    startClock() {
        if (!this.intervalId) {
            this.updateClock();
            this.intervalId = setInterval(this.updateClock.bind(this), 1000);
        }
    }

    pauseClock() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

const clock = new Clock();
clock.init();

document.getElementById('startBtn').addEventListener('click', () => clock.startClock());
document.getElementById('pauseBtn').addEventListener('click', () => clock.pauseClock());