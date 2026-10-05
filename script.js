const terminalCanvas = document.querySelector(".terminal-rain");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
