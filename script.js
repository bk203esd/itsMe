window.i18nReady.then(() => {
const terminalCanvas = document.querySelector(".terminal-rain");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const counterValues = document.querySelectorAll("[data-counter]");

if (counterValues.length > 0) {
    const startTime = Date.UTC(2018, 0, 1);
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    const updateExperienceCounter = () => {
        const now = new Date();
        const years = now.getUTCFullYear() - 2018;
        const anniversary = Date.UTC(2018 + years, 0, 1);
        let remainingTime = now.getTime() - anniversary;

        const days = Math.floor(remainingTime / dayInMilliseconds);
        remainingTime %= dayInMilliseconds;

        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        remainingTime %= 60 * 60 * 1000;

        const minutes = Math.floor(remainingTime / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        const values = { years, days, hours, minutes, seconds };

        for (const counter of counterValues) {
            const value = values[counter.dataset.counter];

            if (value !== undefined) {
                counter.textContent = String(value).padStart(counter.dataset.counter === "days" ? 3 : 2, "0");
            }
        }
    };

    if (Date.now() >= startTime) {
        updateExperienceCounter();
        window.setInterval(updateExperienceCounter, 1000);
    }
}

if (terminalCanvas && !prefersReducedMotion.matches) {
    const context = terminalCanvas.getContext("2d");

    if (context) {
        const particles = [];
        let canvasWidth = 0;
        let canvasHeight = 0;
        let lastFrameTime = 0;

        const resizeCanvas = () => {
            const bounds = terminalCanvas.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

            canvasWidth = bounds.width;
            canvasHeight = bounds.height;
            terminalCanvas.width = Math.round(canvasWidth * pixelRatio);
            terminalCanvas.height = Math.round(canvasHeight * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            const particleCount = Math.ceil(canvasWidth / 22);
            particles.length = 0;

            for (let index = 0; index < particleCount; index += 1) {
                particles.push({
                    x: Math.random() * canvasWidth,
                    y: Math.random() * canvasHeight,
                    size: 2 + Math.random() * 3,
                    speed: 12 + Math.random() * 24,
                    opacity: 0.12 + Math.random() * 0.2
                });
            }
        };

        const animateRain = (time) => {
            const elapsed = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
            lastFrameTime = time;
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            for (const particle of particles) {
                particle.y += particle.speed * elapsed;

                if (particle.y > canvasHeight) {
                    particle.y = -particle.size;
                    particle.x = Math.random() * canvasWidth;
                }

                context.fillStyle = `rgb(166 240 176 / ${particle.opacity})`;
                context.fillRect(particle.x, particle.y, particle.size, particle.size);
            }

            window.requestAnimationFrame(animateRain);
        };

        new ResizeObserver(resizeCanvas).observe(terminalCanvas);
        window.requestAnimationFrame(animateRain);
    }
}
});
