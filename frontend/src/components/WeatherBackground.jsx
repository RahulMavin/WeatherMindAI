import { useEffect, useRef } from "react";

function WeatherBackground({ type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set canvas to full window size
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let animationId;

    // Handle window resize
    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create particles based on weather type
    function createParticles() {
      particles = [];
      if (type === "rainy" || type === "stormy") {
        for (let i = 0; i < 120; i++) {
          particles.push({
            x:      Math.random() * canvas.width,
            y:      Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed:  Math.random() * 8 + 6,
            opacity: Math.random() * 0.4 + 0.1,
            width:  Math.random() * 1.5 + 0.5,
          });
        }
      } else if (type === "snowy") {
        for (let i = 0; i < 80; i++) {
          particles.push({
            x:      Math.random() * canvas.width,
            y:      Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed:  Math.random() * 1.5 + 0.5,
            drift:  Math.random() * 0.8 - 0.4,
            opacity: Math.random() * 0.6 + 0.2,
          });
        }
      } else if (type === "sunny") {
        for (let i = 0; i < 6; i++) {
          particles.push({
            x:       canvas.width * 0.75,
            y:       canvas.height * 0.08,
            angle:   (i / 6) * Math.PI * 2,
            length:  Math.random() * 40 + 60,
            speed:   0.003,
            opacity: Math.random() * 0.06 + 0.02,
            width:   Math.random() * 30 + 20,
          });
        }
        } else if (type === "night") {
        for (let i = 0; i < 60; i++) {
          particles.push({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height,
            radius:  Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkle: Math.random() * 0.02 + 0.005,
            phase:   Math.random() * Math.PI * 2,
          });
        }
      } else if (type === "cloudy") {
        for (let i = 0; i < 5; i++) {
          particles.push({
            x:       Math.random() * canvas.width,
            y:       Math.random() * canvas.height * 0.4,
            radius:  Math.random() * 60 + 40,
            speed:   Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.04 + 0.01,
          });
        }
      }
    }

    // Draw rain
    function drawRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 2, p.y + p.length);
        ctx.strokeStyle = `rgba(174, 214, 241, ${p.opacity})`;
        ctx.lineWidth = p.width;
        ctx.stroke();
        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      });
    }

    // Draw snow
    function drawSnow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > canvas.height) {
          p.y = -p.radius;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
      });
    }

    // Draw sun rays
    function drawSunny() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const grad = ctx.createLinearGradient(0, 0, 0, p.length);
        grad.addColorStop(0, `rgba(251, 191, 36, ${p.opacity})`);
        grad.addColorStop(1, `rgba(251, 191, 36, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(-p.width / 2, 0, p.width, p.length);
        ctx.restore();
        p.angle += p.speed;
      });
    }

    // Draw clouds
    function drawCloudy() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.x += p.speed;
        if (p.x - p.radius > canvas.width) {
          p.x = -p.radius;
        }
      });
    }

    // Animation loop
    function animate() {
      if (type === "rainy" || type === "stormy") drawRain();
      else if (type === "snowy") drawSnow();
      else if (type === "sunny") drawSunny();
      else if (type === "cloudy") drawCloudy();
      else if (type === "night") drawNight(ctx, canvas, particles);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationId = requestAnimationFrame(animate);
    }
    // Draw night stars
    function drawNight() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;
      particles.forEach(p => {
        const twinkle = Math.sin(time * p.twinkle * 60 + p.phase);
        const opacity = p.opacity * (0.6 + 0.4 * twinkle);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });
    }

    createParticles();
    animate();

    // Cleanup on unmount or type change
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default WeatherBackground;