import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// Dynamic import for anime.js to handle ES module issues

// This component contains the entire new interactive homepage with fancy animations
export function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced particle animation with mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let mouse = { x: -100, y: -100, radius: 150 };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.density = Math.random() * 30 + 1;
        this.color = `rgba(19, 19, 236, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }

        // Boundary collision
        if (canvas && (this.x > canvas.width || this.x < 0)) this.speedX = -this.speedX;
        if (canvas && (this.y > canvas.height || this.y < 0)) this.speedY = -this.speedY;
        
        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        
        // Add glow effect
        ctx!.shadowColor = "#1313ec";
        ctx!.shadowBlur = 10;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    function init() {
      if (!canvas) return;
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = 1 - distance / 120;
            ctx!.strokeStyle = `rgba(19, 19, 236, ${opacity * 0.4})`;
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
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Anime.js animations on component mount
  useEffect(() => {
    let observer: IntersectionObserver;

    const initAnimations = async () => {
      try {
        // Dynamic import for anime.js
        const animeModule = await import('animejs');
        const anime = (animeModule as any).default || animeModule;

        const tl = anime.timeline({
          easing: 'easeOutExpo',
          complete: () => setIsLoaded(true)
        });

        // Set initial styles for anime.js animations (override CSS animations)
        if (titleRef.current) {
          titleRef.current.style.opacity = '0';
          titleRef.current.style.transform = 'translateY(50px)';
        }
        if (subtitleRef.current) {
          subtitleRef.current.style.opacity = '0';
          subtitleRef.current.style.transform = 'translateY(30px)';
        }

        // Hero section animations
        tl.add({
          targets: titleRef.current,
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 1200,
          delay: 300,
        })
        .add({
          targets: subtitleRef.current,
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: 200,
        }, '-=800')
        .add({
          targets: '.scroll-indicator',
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
        }, '-=600')
        .add({
          targets: '#cta-buttons',
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 1000,
        }, '-=400');

        // Cards animation on scroll
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime({
                targets: '.role-card',
                translateY: [60, 0],
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 1000,
                delay: anime.stagger(200),
                easing: 'easeOutElastic(1, .8)',
              });
            }
          });
        });

        if (cardsRef.current) {
          observer.observe(cardsRef.current);
        }
      } catch (error) {
        console.warn('Failed to load anime.js, falling back to CSS animations:', error);
        setIsLoaded(true);
      }
    };

    initAnimations();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Enhanced mouse handler for interactive cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
    
    // Add tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <>
      {/* Custom cursor follower */}
      <div 
        className="fixed w-6 h-6 bg-primary/30 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: isLoaded ? 'scale(1)' : 'scale(0)',
        }}
      />

      {/* Hero Section with Enhanced Background */}
      <section 
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
      >
        {/* Enhanced Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full -z-10"
        />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark/80 via-background-dark/60 to-primary/10 -z-10 animate-gradient-shift" />
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="floating-shape absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float-1" />
          <div className="floating-shape absolute top-40 right-20 w-12 h-12 bg-primary/15 rounded-lg rotate-45 animate-float-2" />
          <div className="floating-shape absolute bottom-40 left-20 w-20 h-20 bg-primary/10 rounded-full animate-float-3" />
          <div className="floating-shape absolute bottom-20 right-10 w-14 h-14 bg-primary/25 rounded-lg animate-float-1" />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 animate-fade-in-up"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <span className="inline-block">Verifiable</span>{' '}
            <span className="inline-block bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent animate-gradient-text">
              Hackathon
            </span>{' '}
            <span className="inline-block">Judging</span>
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="font-semibold text-white">ProofJudge</span> leverages{' '}
            <span className="text-primary font-semibold">INFTs</span> and{' '}
            <span className="text-primary font-semibold">0G Storage/Compute</span>{' '}
            for a transparent and fair judging process.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-16 animate-fade-in-up" id="cta-buttons" style={{ animationDelay: '0.6s' }}>
            <a 
              href="#role-selection" 
              className="fancy-button primary inline-block text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('role-selection')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              <span>Get Started</span>
              <div className="button-glow"></div>
            </a>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <a 
          href="#role-selection" 
          className="scroll-indicator absolute bottom-10 animate-fade-in-up group cursor-pointer"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2 group-hover:text-white transition-colors">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center group-hover:border-primary transition-colors">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-scroll-dot group-hover:bg-primary"></div>
            </div>
          </div>
        </a>
      </section>

      {/* Role Selection Section with Enhanced Cards */}
      <section
        id="role-selection"
        className="py-12 md:py-16 bg-background-dark relative overflow-hidden min-h-screen flex items-center"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
        </div>

        <div ref={cardsRef} className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Choose Your <span className="text-primary">Role</span>
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl">
            Select your role to access your dedicated dashboard and start your journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Enhanced Hacker Card */}
            <Link
              to="/hacker"
              className="role-card interactive-card group animate-fade-in-up"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full min-h-[300px]">
                <div className="mb-6 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">
                    code
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  Hacker
                </h3>
                <p className="text-gray-400 mb-6 text-base leading-relaxed">
                  Build innovative solutions, submit your projects, and manage your hackathon journey.
                </p>
                <div className="mt-auto w-full bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-105">
                  Enter Hacker Dashboard
                </div>
              </div>
            </Link>

            {/* Enhanced Judge Card */}
            <Link
              to="/judge"
              className="role-card interactive-card group animate-fade-in-up"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="relative z-10 flex flex-col items-center justify-center p-8 h-full min-h-[300px]">
                <div className="mb-6 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-gray-600/20 to-gray-800/5 text-gray-300 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">
                    gavel
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors">
                  Judge / Organizer
                </h3>
                <p className="text-gray-400 mb-6 text-base leading-relaxed">
                  Review submissions, manage judging processes, and organize hackathon events.
                </p>
                <div className="mt-auto w-full bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 text-sm font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-gray-600 group-hover:to-gray-700 group-hover:shadow-lg group-hover:shadow-gray-500/25 group-hover:scale-105">
                  Enter Judge Dashboard
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
