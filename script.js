/* ============================================================================
   WellBeing Design — script.js
   Pure Vanilla JS. No dependencies.
   ============================================================================ */

(function () {
  "use strict";

  /* -----------------------------------------------------
     Preloader
  ----------------------------------------------------- */
  window.addEventListener("load", function () {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    setTimeout(() => pre.classList.add("is-hidden"), 700);
  });

  /* -----------------------------------------------------
     Year in footer
  ----------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------
     Cursor follower (desktop only)
  ----------------------------------------------------- */
  const cursor = document.getElementById("cursorDot");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
    });
    function loop() {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    // Grow on interactive hover
    const interactive = "a, button, .masonry-item, .project-card, .service-card, .faq-item summary, input, textarea, select";
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.style.transform += " scale(2.4)");
      el.addEventListener("mouseleave", () => {});
    });
  }

  /* -----------------------------------------------------
     Navbar — scrolled state + active link tracking
  ----------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    // Active section detection
    const scrollPos = window.scrollY + 120;
    document.querySelectorAll("section[id]").forEach((sec) => {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollPos >= top && scrollPos < bot) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add("active");
      }
    });

    // Float-top button visibility
    const top = document.getElementById("floatTop");
    if (top) top.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }
  // Close mobile menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbar.classList.contains("is-open")) {
        navbar.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* -----------------------------------------------------
     Hero parallax (subtle, transforms background on scroll)
  ----------------------------------------------------- */
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y === 0) {
          heroBg.style.animationPlayState = "running";
          heroBg.style.transform = "";
        } else if (y < window.innerHeight * 1.2) {
          heroBg.style.animationPlayState = "paused";
          const scale = 1.06 + Math.min(y / 5000, 0.08);
          const shift = y * 0.22;
          heroBg.style.transform = `translateY(${shift}px) scale(${scale})`;
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* -----------------------------------------------------
     Stats counter
  ----------------------------------------------------- */
  const statNums = document.querySelectorAll(".stat-num");
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 70));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      statObs.unobserve(el);
    });
  }, { threshold: 0.35 });
  statNums.forEach((el) => statObs.observe(el));

  /* -----------------------------------------------------
     Reveal-on-scroll
  ----------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* -----------------------------------------------------
     Project filters
  ----------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        const show = f === "all" || cat === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* -----------------------------------------------------
     Gallery Lightbox
  ----------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  document.querySelectorAll(".masonry-item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-img") || item.querySelector("img").src;
      lightboxImg.src = src;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* -----------------------------------------------------
     Testimonials slider
  ----------------------------------------------------- */
  const track = document.getElementById("testimonialTrack");
  const tPrev = document.getElementById("tPrev");
  const tNext = document.getElementById("tNext");
  const tDotsWrap = document.getElementById("testimonialDots");
  const slidesT = track ? track.children.length : 0;
  let tIndex = 0;
  let tTimer = null;

  if (track && slidesT) {
    for (let i = 0; i < slidesT; i++) {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Testimonial ${i + 1}`);
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => goT(i));
      tDotsWrap.appendChild(b);
    }
    function goT(i) {
      tIndex = (i + slidesT) % slidesT;
      track.style.transform = `translateX(-${tIndex * 100}%)`;
      [...tDotsWrap.children].forEach((d, idx) => d.classList.toggle("active", idx === tIndex));
      resetT();
    }
    function nextT() { goT(tIndex + 1); }
    function prevT() { goT(tIndex - 1); }
    function resetT() { clearInterval(tTimer); tTimer = setInterval(nextT, 6500); }
    tNext.addEventListener("click", nextT);
    tPrev.addEventListener("click", prevT);
    resetT();

    // Pause on hover
    const slider = document.getElementById("testimonialSlider");
    slider.addEventListener("mouseenter", () => clearInterval(tTimer));
    slider.addEventListener("mouseleave", resetT);
  }

  /* -----------------------------------------------------
     Contact form (simulated success)
  ----------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();

      if (!name || !phone || !email || !service || !message) {
        status.textContent = "Please fill in all fields before sending.";
        status.classList.add("error");
        return;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        status.textContent = "Please enter a valid email address.";
        status.classList.add("error");
        return;
      }

      status.classList.remove("error");
      status.textContent = "Sending...";
      setTimeout(() => {
        status.textContent = `Thank you, ${name.split(" ")[0]} — we'll reach out within one working day.`;
        form.reset();
      }, 900);
    });
  }

  /* -----------------------------------------------------
     Float top
  ----------------------------------------------------- */
  const floatTop = document.getElementById("floatTop");
  if (floatTop) {
    floatTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
