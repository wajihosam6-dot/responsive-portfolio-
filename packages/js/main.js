/* ============================================================
   MAIN.JS — Premium Portfolio Interactions
   Cinematic enhancements from robonuggets/cinematic-site-components
   ============================================================ */

(function () {
  "use strict";

  /* ----------------------------------------------------------
     0. DOM REFERENCES
     ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const loader = $("#loader");
  const loaderProgress = $("#loaderProgress");
  const loaderText = $("#loaderText");
  const scrollProgressBar = $("#scrollProgress");
  const cursorGlow = $("#cursorGlow");
  const header = $("#header");
  const navMenu = $("#navMenu");
  const navToggle = $("#navToggle");
  const navClose = $("#navClose");
  const themeBtn = $("#themeBtn");
  const scrollUpBtn = $("#scrollUp");
  const heroCanvas = $("#hero-canvas");
  const contactForm = $("#contactForm");

  /* ----------------------------------------------------------
     1. LOADING SCREEN
     ---------------------------------------------------------- */
  if (loader) {
    document.body.style.overflow = "hidden";
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress > 100) progress = 100;
      if (loaderProgress) loaderProgress.style.width = progress + "%";
      if (loaderText) loaderText.textContent = Math.round(progress) + "%";
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add("hidden");
          document.body.style.overflow = "";
        }, 500);
      }
    }, 180);
  }

  /* ----------------------------------------------------------
     2. MOBILE NAVIGATION
     ---------------------------------------------------------- */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => navMenu.classList.add("open"));
  }
  if (navClose && navMenu) {
    navClose.addEventListener("click", () => navMenu.classList.remove("open"));
  }
  $$(".nav__link").forEach((link) =>
    link.addEventListener("click", () => navMenu && navMenu.classList.remove("open"))
  );

  /* ----------------------------------------------------------
     3. THEME TOGGLE (Dark / Light)
     ---------------------------------------------------------- */
  const DARK_THEME = "dark-theme";
  const savedTheme = localStorage.getItem("selected-theme");
  const savedIcon = localStorage.getItem("selected-icon");

  if (savedTheme) {
    document.body.classList[savedTheme === "dark" ? "add" : "remove"](DARK_THEME);
    if (themeBtn && savedIcon) {
      const icon = $("i", themeBtn);
      if (icon) {
        icon.className = savedIcon === "uil-sun" ? "uil uil-sun" : "uil uil-moon";
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle(DARK_THEME);
      const icon = $("i", themeBtn);
      const isDark = document.body.classList.contains(DARK_THEME);
      if (icon) icon.className = isDark ? "uil uil-sun" : "uil uil-moon";
      localStorage.setItem("selected-theme", isDark ? "dark" : "light");
      localStorage.setItem("selected-icon", isDark ? "uil-sun" : "uil-moon");
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL PROGRESS BAR
     ---------------------------------------------------------- */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = pct + "%";
  }

  /* ----------------------------------------------------------
     5. HEADER — SCROLL BEHAVIOR
     ---------------------------------------------------------- */
  let lastScrollY = 0;
  function handleHeaderScroll() {
    if (!header) return;
    const y = window.pageYOffset;
    if (y >= 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    if (window.innerWidth >= 768) {
      if (y > lastScrollY && y > 200) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
    } else {
      header.style.transform = "";
    }
    lastScrollY = y;
  }

  /* ----------------------------------------------------------
     6. SCROLL-TO-TOP BUTTON
     ---------------------------------------------------------- */
  function handleScrollUp() {
    if (!scrollUpBtn) return;
    if (window.scrollY >= 560) {
      scrollUpBtn.classList.add("show");
    } else {
      scrollUpBtn.classList.remove("show");
    }
  }

  if (scrollUpBtn) {
    scrollUpBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------------------------------------------------------
     7. ACTIVE NAV LINK ON SCROLL
     ---------------------------------------------------------- */
  const sections = $$("section[id]");
  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      const link = $(`.nav__menu a[href="#${id}"]`);
      if (!link) return;
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ----------------------------------------------------------
     8. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------- */
  const revealEls = $$(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(() => entry.target.classList.add("revealed"), parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     9. SKILL FILTER
     ---------------------------------------------------------- */
  const filterContainer = $("#skillFilters");
  const skillGrid = $("#skillsGrid");

  if (filterContainer && skillGrid) {
    const filterBtns = $$(".skills__filter", filterContainer);
    const skillCards = $$(".skill-card", skillGrid);

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");

        skillCards.forEach((card, i) => {
          const match = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          if (match) {
            card.style.opacity = "0";
            card.style.transform = "scale(0.9)";
            card.style.display = "";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 30 + i * 30);
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.9)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     10. FAQ ACCORDION
     ---------------------------------------------------------- */
  $$(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      if (!item) return;
      const isOpen = item.classList.contains("open");
      $$(".faq__item").forEach((fi) => fi.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ----------------------------------------------------------
     11. CASE STUDY MODAL
     ---------------------------------------------------------- */
  const caseModal = $("#caseModal");
  const modalClose = $("#modalClose");
  const modalTag = $("#modalTag");
  const modalTitle = $("#modalTitle");
  const modalChallenge = $("#modalChallenge");
  const modalStrategy = $("#modalStrategy");
  const modalSolution = $("#modalSolution");
  const modalOutcome = $("#modalOutcome");

  const caseStudies = {
    dashboard: {
      tag: "Data Visualization",
      title: "Analytics Dashboard",
      challenge: "A mid-size organization needed a unified view of their KPIs across departments. Data was siloed in spreadsheets, making real-time decision-making nearly impossible.",
      strategy: "Conducted stakeholder interviews to map critical metrics, then designed a data pipeline architecture to consolidate sources into a single analytics layer.",
      solution: "Built an interactive dashboard using Python and Tableau with real-time data feeds, drill-down capabilities, and automated reporting. Implemented role-based views for different stakeholders.",
      outcome: "Reduced reporting time by 70%, improved cross-departmental visibility, and enabled data-driven decisions that increased operational efficiency by 25%.",
    },
    ecommerce: {
      tag: "Web Development",
      title: "E-Commerce Platform",
      challenge: "A growing retail brand needed a modern, responsive online store that could handle increasing traffic while providing an intuitive shopping experience.",
      strategy: "Mapped the complete customer journey from discovery to checkout, identifying friction points in the existing flow and opportunities for engagement.",
      solution: "Developed a fully responsive e-commerce platform with dynamic product filtering, a streamlined cart experience, and optimized checkout flow. Implemented lazy loading and image optimization for performance.",
      outcome: "Achieved a 40% increase in mobile conversions, 35% reduction in cart abandonment, and page load times under 2 seconds across all devices.",
    },
    brand: {
      tag: "Brand Design",
      title: "Brand Design System",
      challenge: "A startup needed a cohesive visual identity that could scale across digital and print touchpoints while maintaining consistency as the team grew.",
      strategy: "Defined brand personality, color psychology, and typography hierarchy through workshops. Created a token-based system for easy implementation across platforms.",
      solution: "Designed a comprehensive brand system including logo, color palette, typography scale, component library, and detailed usage guidelines with living documentation.",
      outcome: "Enabled the design team to ship 3x faster with consistent outputs. Reduced design-to-development handoff time by 50% and established a recognizable brand presence.",
    },
  };

  function openCaseStudy(key) {
    const data = caseStudies[key];
    if (!data || !caseModal) return;
    if (modalTag) modalTag.textContent = data.tag;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalChallenge) modalChallenge.textContent = data.challenge;
    if (modalStrategy) modalStrategy.textContent = data.strategy;
    if (modalSolution) modalSolution.textContent = data.solution;
    if (modalOutcome) modalOutcome.textContent = data.outcome;
    caseModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCaseStudy() {
    if (caseModal) caseModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  $$(".case-study-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openCaseStudy(btn.getAttribute("data-case"));
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeCaseStudy);
  if (caseModal) {
    caseModal.addEventListener("click", (e) => {
      if (e.target === caseModal) closeCaseStudy();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCaseStudy();
  });

  /* ----------------------------------------------------------
     12. HERO CANVAS PARTICLES (Mouse-Reactive)
     ---------------------------------------------------------- */
  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    let particles = [];
    let animId;
    let mouse = { x: null, y: null, radius: 120 };

    function resizeHeroCanvas() {
      const rect = heroCanvas.parentElement.getBoundingClientRect();
      heroCanvas.width = rect.width;
      heroCanvas.height = rect.height;
    }
    resizeHeroCanvas();

    const heroSection = $("#home");
    if (heroSection) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.baseSize = Math.random() * 1.8 + 0.4;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.baseOpacity = Math.random() * 0.35 + 0.08;
        this.opacity = this.baseOpacity;
      }
      update() {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 2;
            this.y += Math.sin(angle) * force * 2;
            this.opacity = Math.min(this.baseOpacity + force * 0.3, 0.8);
            this.size = this.baseSize + force * 1.5;
          } else {
            this.opacity += (this.baseOpacity - this.opacity) * 0.05;
            this.size += (this.baseSize - this.size) * 0.05;
          }
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    function createParticles() {
      const count = Math.min(Math.floor((heroCanvas.width * heroCanvas.height) / 14000), 70);
      particles = [];
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    createParticles();

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = 0.08 * (1 - dist / 110);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateHero() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      connectParticles();
      animId = requestAnimationFrame(animateHero);
    }
    animateHero();

    if (heroSection) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { if (!animId) animateHero(); }
          else { cancelAnimationFrame(animId); animId = null; }
        },
        { threshold: 0 }
      );
      heroObserver.observe(heroSection);
    }

    window.addEventListener("resize", () => { resizeHeroCanvas(); createParticles(); });
  }

  /* ----------------------------------------------------------
     13. WORD-BY-WORD HERO REVEAL
     ---------------------------------------------------------- */
  const wordRevealEls = $$(".word-reveal");
  if (wordRevealEls.length) {
    setTimeout(() => {
      wordRevealEls.forEach((el) => el.classList.add("revealed"));
    }, 600);
  }

  /* ----------------------------------------------------------
     14. PARALLAX SCROLL (Hero Elements)
     ---------------------------------------------------------- */
  const heroGlow1 = $(".hero__glow");
  const heroGlow2 = $(".hero__glow-2");
  const heroImage = $(".hero__image-wrapper");

  function handleParallax() {
    const scrollY = window.pageYOffset;
    const heroH = window.innerHeight;
    if (scrollY > heroH) return;
    const ratio = scrollY / heroH;
    if (heroGlow1) heroGlow1.style.transform = `translate(-50%, calc(-50% + ${ratio * 80}px))`;
    if (heroGlow2) heroGlow2.style.transform = `translate(0, ${ratio * 50}px)`;
    if (heroImage) heroImage.style.transform = `translateY(${ratio * 30}px)`;
  }

  /* ----------------------------------------------------------
     15. 3D CARD TILT + SPOTLIGHT (Desktop)
     Cinematic: cursor-reactive.html + spotlight-border.html
     ---------------------------------------------------------- */
  if (window.innerWidth > 768) {
    const tiltCards = $$(".expertise-card, .service-card, .differentiator-card");
    tiltCards.forEach((card) => {
      card.classList.add("tilt-card");
      // Add spotlight div if not present
      if (!card.querySelector(".spotlight")) {
        const spot = document.createElement("div");
        spot.className = "spotlight";
        card.prepend(spot);
      }
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
        // Spotlight gradient follows cursor
        const spot = card.querySelector(".spotlight");
        if (spot) {
          spot.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(37,99,235,0.08) 0%, transparent 60%)`;
          spot.style.opacity = "1";
        }
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
        card.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        const spot = card.querySelector(".spotlight");
        if (spot) spot.style.opacity = "0";
      });
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.1s ease";
      });
    });
  }

  /* ----------------------------------------------------------
     16. COUNTER "+" SUFFIX
     ---------------------------------------------------------- */
  const counterEls2 = $$(".highlight-card__number[data-count]");
  const counterObserver2 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const duration = 1800;
          const start = performance.now();
          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterObserver2.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls2.forEach((c) => counterObserver2.observe(c));

  /* ----------------------------------------------------------
     17. SCROLL REVEAL — LEFT/RIGHT/SCALE VARIANTS
     ---------------------------------------------------------- */
  const revealLeftEls = $$(".reveal-left");
  const revealRightEls = $$(".reveal-right");
  const revealScaleEls = $$(".reveal-scale");

  const variantObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(() => entry.target.classList.add("revealed"), parseInt(delay));
          variantObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  [...revealLeftEls, ...revealRightEls, ...revealScaleEls].forEach((el) =>
    variantObserver.observe(el)
  );

  /* ----------------------------------------------------------
     18. TIMELINE PROGRESS LINE
     ---------------------------------------------------------- */
  const timelineEl = $(".timeline");
  if (timelineEl) {
    const lineProgress = document.createElement("div");
    lineProgress.classList.add("timeline__line-progress");
    timelineEl.prepend(lineProgress);

    const timelineItems = $$(".timeline__item", timelineEl);
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const idx = timelineItems.indexOf(item);
            const total = timelineItems.length;
            const pct = ((idx + 1) / total) * 100;
            lineProgress.style.height = pct + "%";
            const dot = $(".timeline__dot", item);
            if (dot) {
              dot.style.background = "var(--primary)";
              dot.style.boxShadow = "0 0 0 4px var(--primary-glow), 0 0 12px var(--primary-glow-strong)";
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -30% 0px" }
    );
    timelineItems.forEach((item) => timelineObserver.observe(item));
  }

  /* ----------------------------------------------------------
     19. SMOOTH SCROLL FOR ANCHOR LINKS
     ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ----------------------------------------------------------
     20. MAGNETIC BUTTON EFFECT (Desktop)
     Cinematic: cursor-reactive.html — magnetic button
     ---------------------------------------------------------- */
  if (window.innerWidth > 768) {
    $$(".btn, .contact__social").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        btn.style.boxShadow = "0 12px 40px rgba(37, 99, 235, 0.25)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
        btn.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s";
        btn.style.boxShadow = "";
      });
      btn.addEventListener("mouseenter", () => {
        btn.style.transition = "transform 0.1s ease";
      });
    });
  }

  /* ----------------------------------------------------------
     21. CURSOR GLOW EFFECT (Desktop)
     Cinematic: cursor-reactive.html — smooth lerp following
     ---------------------------------------------------------- */
  if (cursorGlow && window.innerWidth > 768) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorGlow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });
    function moveGlow() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      cursorGlow.style.transform = `translate(${gx - 150}px, ${gy - 150}px)`;
      requestAnimationFrame(moveGlow);
    }
    moveGlow();
  }

  /* ----------------------------------------------------------
     22. CONTACT FORM HANDLER + PARTICLE EXPLOSION
     Cinematic: particle-button.html
     ---------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = $(".form__submit", contactForm);
      if (!btn) return;

      // Particle explosion on click
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      spawnParticles(cx, cy, "#2563EB");

      const originalHTML = btn.innerHTML;
      btn.innerHTML = "Sent! <i class='uil uil-check-circle btn__icon'></i>";
      btn.style.pointerEvents = "none";
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = "";
        contactForm.reset();
        // Reset floating labels
        $$(".form__group", contactForm).forEach((g) => g.classList.remove("focused"));
      }, 3000);
    });
  }

  function spawnParticles(cx, cy, color) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle-burst";
      p.style.cssText = `
        position:fixed;width:8px;height:8px;border-radius:50%;
        pointer-events:none;z-index:9999;background:${color};
        left:${cx}px;top:${cy}px;
      `;
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40;
      p.style.transition = "all .6s cubic-bezier(.16,1,.3,1)";
      p.offsetHeight; // force reflow
      p.style.transform = `translate(${dx}px,${dy}px) scale(0)`;
      p.style.opacity = "0";
      setTimeout(() => p.remove(), 700);
    }
  }

  /* ----------------------------------------------------------
     23. KINETIC MARQUEE (Scroll-Reactive Speed)
     Cinematic: kinetic-marquee.html — vanilla JS, no GSAP
     ---------------------------------------------------------- */
  const marqueeRows = $$(".marquee-band__inner");
  if (marqueeRows.length) {
    let scrollVelocity = 0;
    let lastScrollY = window.pageYOffset;
    let lastTime = performance.now();

    function trackScrollVelocity() {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        scrollVelocity = Math.abs(window.pageYOffset - lastScrollY) / dt * 16; // normalize to ~60fps
      }
      lastScrollY = window.pageYOffset;
      lastTime = now;
      requestAnimationFrame(trackScrollVelocity);
    }
    trackScrollVelocity();

    // The marquee CSS animation already handles the scroll.
    // We dynamically adjust animation-duration based on scroll speed.
    function updateMarqueeSpeed() {
      const baseDuration = 25; // seconds
      const speedFactor = Math.max(0.3, 1 - scrollVelocity * 0.008);
      marqueeRows.forEach((row) => {
        row.style.animationDuration = (baseDuration * speedFactor) + "s";
      });
      requestAnimationFrame(updateMarqueeSpeed);
    }
    updateMarqueeSpeed();
  }

  /* ----------------------------------------------------------
     24. TEXT SCRAMBLE ON SCROLL (Section Titles)
     Cinematic: text-scramble.html — scroll-triggered decode
     ---------------------------------------------------------- */
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  function scrambleText(el, finalText, duration) {
    duration = duration || 1200;
    const len = finalText.length;
    let startTime = null;

    function frame(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);

      let html = "";
      for (let i = 0; i < len; i++) {
        if (finalText[i] === " ") { html += " "; continue; }
        const charThreshold = (i / len) * 0.7 + 0.15;
        if (progress >= charThreshold) {
          html += `<span class="scramble-resolved">${finalText[i]}</span>`;
        } else {
          html += `<span class="scramble-random">${SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]}</span>`;
        }
      }
      el.innerHTML = html;

      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Apply scramble to section titles on scroll
  const scrambleTitles = $$(".section__title");
  const scrambleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.getAttribute("data-scramble") || el.textContent;
          el.setAttribute("data-scramble", text);
          scrambleText(el, text, 1200);
          scrambleObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  scrambleTitles.forEach((title) => scrambleObserver.observe(title));

  // Hover scramble on cards
  $$(".section__title").forEach((title) => {
    const originalText = title.getAttribute("data-scramble") || title.textContent;
    title.setAttribute("data-scramble", originalText);
    let scrambleTimeout;
    title.addEventListener("mouseenter", () => {
      clearInterval(scrambleTimeout);
      scrambleText(title, originalText, 600);
    });
  });

  /* ----------------------------------------------------------
     25. FLOATING FORM LABELS
     ---------------------------------------------------------- */
  $$(".form__input, .form__textarea").forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });
    input.addEventListener("blur", () => {
      if (!input.value) input.parentElement.classList.remove("focused");
    });
    if (input.value) input.parentElement.classList.add("focused");
  });

  /* ----------------------------------------------------------
     26. SPOTLIGHT BORDER GRID (Skills Section)
     Cinematic: spotlight-border.html
     ---------------------------------------------------------- */
  const spotlightGrid = $("#skillsGrid");
  if (spotlightGrid && window.innerWidth > 768) {
    spotlightGrid.addEventListener("mousemove", (e) => {
      const cards = $$(".skill-card", spotlightGrid);
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ----------------------------------------------------------
     27. SCROLL EVENT LISTENER (batched)
     ---------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleHeaderScroll();
        handleScrollUp();
        updateActiveLink();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============================================================
     CINEMATIC ENHANCEMENTS — Additional Effects
     ============================================================ */

  /* ----------------------------------------------------------
     C1. TYPEWRITER EFFECT (Hero subtitle)
     Cinematic: typewriter.html — cycling headline
     ---------------------------------------------------------- */
  const typeEl = $("#typewriter");
  if (typeEl) {
    const phrases = JSON.parse(typeEl.getAttribute("data-phrases") || '["Data Analyst","Web Developer","Problem Solver","Banking Expert"]');
    let pi = 0, ci = 0, deleting = false, pause = 0;
    function typeTick() {
      const phrase = phrases[pi];
      if (!deleting) {
        ci++;
        if (ci > phrase.length) { pause++; if (pause > 40) { deleting = true; pause = 0; } requestAnimationFrame(typeTick); return; }
      } else {
        ci--;
        if (ci < 0) { ci = 0; deleting = false; pi = (pi + 1) % phrases.length; pause = 0; setTimeout(typeTick, 400); return; }
      }
      typeEl.innerHTML = phrase.substring(0, ci) + '<span class="type-cursor"></span>';
      setTimeout(typeTick, deleting ? 30 : 60);
    }
    typeTick();
  }

  /* ----------------------------------------------------------
     C2. SCROLL COLOR SHIFT (Section background transitions)
     Cinematic: color-shift.html
     ---------------------------------------------------------- */
  const colorSections = $$("[data-bg]");
  if (colorSections.length) {
    const colorObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bg = entry.target.getAttribute("data-bg");
            const text = entry.target.getAttribute("data-text");
            if (bg) document.body.style.background = bg;
            if (text) document.body.style.color = text;
          }
        });
      },
      { threshold: 0.35 }
    );
    colorSections.forEach((s) => colorObserver.observe(s));
  }

  /* ----------------------------------------------------------
     C3. SCROLL-LINKED SCALE & OPACITY (Parallax depth)
     Cinematic: zoom-parallax.html — layers move at different speeds
     ---------------------------------------------------------- */
  function handleScrollDepth() {
    const scrollY = window.pageYOffset;
    // Scale elements with data-scroll-scale
    $$("[data-scroll-scale]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const scale = parseFloat(el.getAttribute("data-scroll-scale")) || 0.1;
      const baseScale = 1 - scale;
      const s = baseScale + progress * scale;
      el.style.transform = `scale(${s})`;
    });
    // Fade elements with data-scroll-fade
    $$("[data-scroll-fade]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      el.style.opacity = Math.min(Math.max(progress * 2 - 0.3, 0), 1);
    });
    // Translate Y elements with data-scroll-y
    $$("[data-scroll-y]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const maxY = parseFloat(el.getAttribute("data-scroll-y")) || 50;
      const y = (1 - progress) * maxY;
      el.style.transform = `translateY(${y}px)`;
    });
  }

  /* ----------------------------------------------------------
     C4. FLIP CARDS (Services section)
     Cinematic: flip-cards.html — hover to flip
     ---------------------------------------------------------- */
  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    card.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) card.classList.add("flipped");
    });
    card.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) card.classList.remove("flipped");
    });
  });

  /* ----------------------------------------------------------
     C5. CURTAIN REveal (About section)
     Cinematic: curtain-reveal.html — scroll to part curtains
     ---------------------------------------------------------- */
  const curtainSection = $(".curtain-section");
  if (curtainSection) {
    const curtainLeft = $(".curtain-left", curtainSection);
    const curtainRight = $(".curtain-right", curtainSection);
    if (curtainLeft && curtainRight) {
      const curtainObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const rect = curtainSection.getBoundingClientRect();
              const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);
              const offset = progress * 100;
              curtainLeft.style.transform = `translateX(-${offset}%)`;
              curtainRight.style.transform = `translateX(${offset}%)`;
            }
          });
        },
        { threshold: 0 }
      );
      curtainObserver.observe(curtainSection);

      // Also update on scroll
      function updateCurtain() {
        const rect = curtainSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);
        const offset = progress * 100;
        curtainLeft.style.transform = `translateX(-${offset}%)`;
        curtainRight.style.transform = `translateX(${offset}%)`;
      }
      window.addEventListener("scroll", () => requestAnimationFrame(updateCurtain), { passive: true });
    }
  }

  /* ----------------------------------------------------------
     C6. IMAGE TRAIL CURSOR (Desktop)
     Cinematic: image-trail.html — cursor leaves fading images
     ---------------------------------------------------------- */
  if (window.innerWidth > 768) {
    const trailSection = $("#imageTrailArea");
    if (trailSection) {
      const trailImages = ["📊", "💻", "🏦", "📈", "🎨", "⚡"];
      let trailIdx = 0;
      trailSection.addEventListener("mousemove", (e) => {
        if (Math.random() > 0.15) return; // throttle
        const rect = trailSection.getBoundingClientRect();
        const el = document.createElement("div");
        el.className = "image-trail-item";
        el.textContent = trailImages[trailIdx % trailImages.length];
        el.style.left = (e.clientX - rect.left) + "px";
        el.style.top = (e.clientY - rect.top) + "px";
        trailSection.appendChild(el);
        trailIdx++;
        requestAnimationFrame(() => {
          el.style.opacity = "0";
          el.style.transform = "scale(0.3) translateY(-30px)";
        });
        setTimeout(() => el.remove(), 800);
      });
    }
  }

  /* ----------------------------------------------------------
     C7. ODOMETER COUNTER (Animated digit wheels)
     Cinematic: odometer.html — digits roll to target
     ---------------------------------------------------------- */
  const odometerEls = $$("[data-odometer]");
  if (odometerEls.length) {
    const odometerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-odometer"), 10);
            const duration = 2000;
            const start = performance.now();
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target).toLocaleString();
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            odometerObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    odometerEls.forEach((el) => odometerObserver.observe(el));
  }

  /* ----------------------------------------------------------
     C8. SCROLL PROGRESS INDICATOR PER SECTION
     Each section gets a subtle progress bar at the top
     ---------------------------------------------------------- */
  $$("section[id]").forEach((section) => {
    const bar = document.createElement("div");
    bar.className = "section-progress-bar";
    section.prepend(bar);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = section.getBoundingClientRect();
            const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
            bar.style.transform = `scaleX(${progress})`;
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );
    sectionObserver.observe(section);
  });

  // Update section progress bars on scroll
  function updateSectionProgress() {
    $$("section[id]").forEach((section) => {
      const bar = $(".section-progress-bar", section);
      if (!bar) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      bar.style.transform = `scaleX(${progress})`;
    });
  }

  /* ----------------------------------------------------------
     C9. SMOOTH SCROLL MOMENTUM (Inertial scrolling feel)
     ---------------------------------------------------------- */
  let scrollMomentum = 0;
  let lastScrollTime = performance.now();
  function trackMomentum() {
    const now = performance.now();
    const dt = now - lastScrollTime;
    if (dt > 0) {
      const newVelocity = Math.abs(window.pageYOffset - (trackMomentum._lastY || 0)) / dt;
      scrollMomentum = scrollMomentum * 0.8 + newVelocity * 0.2; // smooth
      trackMomentum._lastY = window.pageYOffset;
    }
    lastScrollTime = now;
    requestAnimationFrame(trackMomentum);
  }
  trackMomentum._lastY = 0;
  trackMomentum();

  /* ----------------------------------------------------------
     C10. ENHANCED SCROLL HANDLER (batched with all effects)
     ---------------------------------------------------------- */
  function onScrollEnhanced() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        handleHeaderScroll();
        handleScrollUp();
        updateActiveLink();
        handleParallax();
        handleScrollDepth();
        updateSectionProgress();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.removeEventListener("scroll", onScroll);
  window.addEventListener("scroll", onScrollEnhanced, { passive: true });

})();
