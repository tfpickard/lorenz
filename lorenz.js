// Lorenz Attractor Visualization
class LorenzAttractor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Lorenz system parameters
        this.sigma = 10.0;
        this.rho = 28.0;
        this.beta = 8.0 / 3.0;

        // Integration parameters
        this.dt = 0.002;
        this.stepsPerFrame = 10;

        // Current state
        this.x = 0.1;
        this.y = 0.0;
        this.z = 0.0;

        // Trajectory points
        this.points = [];
        this.maxPoints = 5000;

        // Animation control
        this.isPaused = false;
        this.animationId = null;

        // Visual parameters
        this.hue = 0.0;
        this.colorShift = true;
        this.scale = 8.0;
        this.rotationAngle = 0.3;
        this.speedMultiplier = 1.0;

        // Start animation
        this.animate();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // Adjust scale based on canvas size
        this.scale = Math.min(this.canvas.width, this.canvas.height) / 80.0;
    }

    // Runge-Kutta 4th order integration
    updateLorenzSystem() {
        const { x, y, z, dt, sigma, rho, beta } = this;

        // k1
        const k1x = sigma * (y - x);
        const k1y = x * (rho - z) - y;
        const k1z = x * y - beta * z;

        // k2
        const x2 = x + 0.5 * dt * k1x;
        const y2 = y + 0.5 * dt * k1y;
        const z2 = z + 0.5 * dt * k1z;

        const k2x = sigma * (y2 - x2);
        const k2y = x2 * (rho - z2) - y2;
        const k2z = x2 * y2 - beta * z2;

        // k3
        const x3 = x + 0.5 * dt * k2x;
        const y3 = y + 0.5 * dt * k2y;
        const z3 = z + 0.5 * dt * k2z;

        const k3x = sigma * (y3 - x3);
        const k3y = x3 * (rho - z3) - y3;
        const k3z = x3 * y3 - beta * z3;

        // k4
        const x4 = x + dt * k3x;
        const y4 = y + dt * k3y;
        const z4 = z + dt * k3z;

        const k4x = sigma * (y4 - x4);
        const k4y = x4 * (rho - z4) - y4;
        const k4z = x4 * y4 - beta * z4;

        // Update state
        this.x += dt * (k1x + 2 * k2x + 2 * k3x + k4x) / 6.0;
        this.y += dt * (k1y + 2 * k2y + 2 * k3y + k4y) / 6.0;
        this.z += dt * (k1z + 2 * k2z + 2 * k3z + k4z) / 6.0;
    }

    // Project 3D coordinates to 2D screen space
    projectTo2D(x, y, z) {
        // Rotate around Y axis for better view
        const angle = this.rotationAngle;
        const rotatedX = x * Math.cos(angle) - z * Math.sin(angle);
        const rotatedZ = x * Math.sin(angle) + z * Math.cos(angle);

        // Project to screen
        const screenX = this.canvas.width / 2 + rotatedX * this.scale;
        const screenY = this.canvas.height / 2 + y * this.scale;

        return { x: screenX, y: screenY };
    }

    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw trajectory
        if (this.points.length > 1) {
            for (let i = 1; i < this.points.length; i++) {
                const prev = this.points[i - 1];
                const curr = this.points[i];

                // Calculate color based on position in trail
                const progress = i / this.maxPoints;
                const hue = this.colorShift ? (this.hue + progress * 0.3) % 1.0 : 0.6;
                const alpha = 0.3 + 0.7 * progress;

                // Draw line segment
                this.ctx.beginPath();
                this.ctx.moveTo(prev.x, prev.y);
                this.ctx.lineTo(curr.x, curr.y);
                this.ctx.strokeStyle = `hsla(${hue * 360}, 80%, 60%, ${alpha})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
            }
        }
    }

    animate() {
        if (!this.isPaused) {
            // Integrate multiple steps per frame
            const steps = Math.floor(this.stepsPerFrame * this.speedMultiplier);
            for (let i = 0; i < steps; i++) {
                this.updateLorenzSystem();
            }

            // Add new point
            const point = this.projectTo2D(this.x, this.y, this.z);
            this.points.push(point);

            // Limit trajectory length
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }

            // Update hue for color animation
            if (this.colorShift) {
                this.hue += 0.0005;
                if (this.hue > 1.0) this.hue -= 1.0;
            }

            // Draw frame
            this.draw();
        }

        // Continue animation loop
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    reset() {
        this.x = 0.1;
        this.y = 0.0;
        this.z = 0.0;
        this.points = [];
        this.hue = 0.0;
    }

    pause() {
        this.isPaused = !this.isPaused;
    }

    setParameter(param, value) {
        this[param] = parseFloat(value);
    }

    randomizeParameters() {
        this.sigma = Math.random() * 20;
        this.rho = Math.random() * 50;
        this.beta = Math.random() * 10;
        this.reset();
        return { sigma: this.sigma, rho: this.rho, beta: this.beta };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lorenzCanvas');
    const attractor = new LorenzAttractor(canvas);

    // Parameter controls
    const sigmaSlider = document.getElementById('sigma');
    const rhoSlider = document.getElementById('rho');
    const betaSlider = document.getElementById('beta');
    const speedSlider = document.getElementById('speed');
    const trailSlider = document.getElementById('trailLength');
    const colorShiftCheckbox = document.getElementById('colorShift');

    const sigmaValue = document.getElementById('sigmaValue');
    const rhoValue = document.getElementById('rhoValue');
    const betaValue = document.getElementById('betaValue');
    const speedValue = document.getElementById('speedValue');
    const trailValue = document.getElementById('trailValue');

    // Update sigma
    sigmaSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        attractor.setParameter('sigma', value);
        sigmaValue.textContent = value.toFixed(1);
    });

    // Update rho
    rhoSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        attractor.setParameter('rho', value);
        rhoValue.textContent = value.toFixed(1);
    });

    // Update beta
    betaSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        attractor.setParameter('beta', value);
        betaValue.textContent = value.toFixed(2);
    });

    // Update speed
    speedSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        attractor.setParameter('speedMultiplier', value);
        speedValue.textContent = value.toFixed(1) + 'x';
    });

    // Update trail length
    trailSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        attractor.setParameter('maxPoints', value);
        trailValue.textContent = value;
    });

    // Toggle color shift
    colorShiftCheckbox.addEventListener('change', (e) => {
        attractor.colorShift = e.target.checked;
    });

    // Button controls
    const resetBtn = document.getElementById('resetBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const randomBtn = document.getElementById('randomBtn');

    resetBtn.addEventListener('click', () => {
        attractor.reset();
    });

    pauseBtn.addEventListener('click', () => {
        attractor.pause();
        pauseBtn.textContent = attractor.isPaused ? 'Resume' : 'Pause';
    });

    randomBtn.addEventListener('click', () => {
        const params = attractor.randomizeParameters();

        // Update sliders and displays
        sigmaSlider.value = params.sigma;
        sigmaValue.textContent = params.sigma.toFixed(1);

        rhoSlider.value = params.rho;
        rhoValue.textContent = params.rho.toFixed(1);

        betaSlider.value = params.beta;
        betaValue.textContent = params.beta.toFixed(2);
    });
});
