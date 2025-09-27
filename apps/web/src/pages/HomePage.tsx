import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// This component contains the entire new interactive homepage
export function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect hook to handle the canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let mouse = { x: -100, y: -100 };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(
        x: number,
        y: number,
        size: number,
        speedX: number,
        speedY: number
      ) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx!.fillStyle = "rgba(19, 19, 236, 0.5)"; // Primary color with alpha
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function init() {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const speedX = Math.random() * 0.4 - 0.2;
        const speedY = Math.random() * 0.4 - 0.2;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
      }
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance =
            (particlesArray[a].x - particlesArray[b].x) *
              (particlesArray[a].x - particlesArray[b].x) +
            (particlesArray[a].y - particlesArray[b].y) *
              (particlesArray[a].y - particlesArray[b].y);
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - distance / 20000;
            ctx!.strokeStyle = `rgba(19, 19, 236, ${opacityValue * 0.3})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particlesArray) {
        particle.update();
        particle.draw();
      }
      connect();
      requestAnimationFrame(animate);
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    init();
    animate();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mouse handler for the interactive cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full -z-10"
        ></canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/50 to-background-dark -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 animate-fade-in-up">
          Verifiable Hackathon Judging
        </h1>
        <p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          ProofJudge leverages INFTs and 0G Storage/Compute for a transparent
          and fair judging process.
        </p>

        <a href="#role-selection" className="absolute bottom-10 animate-bounce">
          <span className="material-symbols-outlined text-white text-4xl">
            expand_more
          </span>
        </a>
      </section>

      {/* Role Selection Section */}
      <section
        id="role-selection"
        className="py-20 md:py-32 bg-background-dark"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-lg text-gray-400 mb-12">
            Select your role to access your dedicated dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            {/* Hacker Card with Interactive Spotlight */}
            <Link
              to="/hacker"
              className="interactive-card"
              onMouseMove={handleCardMouseMove}
            >
              <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full">
                <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    code
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Hacker</h3>
                <p className="text-gray-400 mb-6">
                  Build, submit, and manage your hackathon projects.
                </p>
                <div className="mt-auto w-full bg-primary text-white text-sm font-bold py-3 px-6 rounded-lg text-center transition-opacity group-hover:opacity-90">
                  Go to Hacker Dashboard
                </div>
              </div>
            </Link>

            {/* Judge Card with Interactive Spotlight */}
            <Link
              to="/judge"
              className="interactive-card"
              onMouseMove={handleCardMouseMove}
            >
              <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full">
                <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    gavel
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Judge / Organizer
                </h3>
                <p className="text-gray-400 mb-6">
                  Review submissions, manage judging, and organize events.
                </p>
                <div className="mt-auto w-full bg-gray-800 text-gray-200 text-sm font-bold py-3 px-6 rounded-lg text-center transition-colors group-hover:bg-gray-700">
                  Go to Judge Dashboard
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
