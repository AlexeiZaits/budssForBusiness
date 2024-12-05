class Clock {
    constructor() {
        this.intervalId = null;
        this.clock = {};
        this.rotation = { hour: 0, minute: 0, second: 0 };
    }

    init() {
        [".hour-hand", ".minute-hand", ".second-hand"].forEach(selector => {
            this.clock[selector] = document.querySelector(selector);
        });
    }

    normalizeRotation(currentDeg, newDeg) {
        const diff = (newDeg - currentDeg + 360) % 360;
        return diff > 180 ? currentDeg - (360 - diff) : currentDeg + diff;
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const secondDeg = 6 * seconds;
        const minuteDeg = 6 * minutes + 0.1 * seconds;
        const hourDeg = 30 * (hours % 12) + 0.5 * minutes;
        
        this.rotation.second = this.normalizeRotation(this.rotation.second, secondDeg);
        this.rotation.minute = this.normalizeRotation(this.rotation.minute, minuteDeg);
        this.rotation.hour = this.normalizeRotation(this.rotation.hour, hourDeg);

        this.clock[".hour-hand"].style.transform = `rotate(${this.rotation.hour}deg)`;
        this.clock[".minute-hand"].style.transform = `rotate(${this.rotation.minute}deg)`;
        this.clock[".second-hand"].style.transform = `rotate(${this.rotation.second}deg)`;
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
