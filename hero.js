(() => {
  const hero = document.querySelector("#kalliHero");
  if (!hero || hero.dataset.ready) return;
  hero.dataset.ready = "true";

  const slides = [
    {
      title: "QAFI",
      nextTitle: "Cybersecurity",
      lead:
        "Empowering Qatar’s financial ecosystem with blockchain, AI, digital identity, and advanced analytics.",
      image: "./assets/qafi.jpg",
      thumb: "./assets/cybersecurity.jpg",
    },
    {
      title: "Cybersecurity",
      nextTitle: "AI Consulting & Implementation Metaverse",
      lead:
        "Advisory, architecture, identity, and managed security protecting enterprises across complex multi-technology environments.",
      image: "./assets/cybersecurity.jpg",
      thumb: "./assets/artificial_intelligence.jpg",
    },
    {
      title: "AI Consulting &amp;<br>Implementation Metaverse",
      nextTitle: "Robotic Process Automation",
      lead:
        "Consulting and implementation that harness AI and Metaverse tech to create immersive experiences and unlock digital opportunity.",
      image: "./assets/artificial_intelligence.jpg",
      thumb: "./assets/robotics.jpg",
    },
    {
      title: "Robotic Process<br>Automation",
      nextTitle: "QAFI",
      lead:
        "Intelligent bots that cut errors, accelerate workflows, strengthen compliance, and drive measurable efficiency.",
      image: "./assets/robotics.jpg",
      thumb: "./assets/qafi.jpg",
    },
  ];

  const activeImage = hero.querySelector(".kalli-hero__image--active");
  const nextImage = hero.querySelector(".kalli-hero__image--next");
  const title = hero.querySelector(".kalli-hero__title");
  const lead = hero.querySelector(".kalli-hero__lead");
  const nextTitle = hero.querySelector(".kalli-next__title");
  const preview = hero.querySelector(".kalli-next__image");
  const counter = hero.querySelector(".kalli-hero__counter");
  const button = hero.querySelector(".kalli-next");

  let index = 0;
  let busy = false;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function paintSlide(i) {
    const slide = slides[i];
    title.innerHTML = slide.title;
    if (lead) lead.textContent = slide.lead || "";
  }

  function paintInitial() {
    activeImage.style.backgroundImage = `url("${slides[index].image}")`;
    paintSlide(index);
    updateNext();
  }

  function updateNext() {
    const upcoming = (index + 1) % slides.length;

    nextTitle.textContent = slides[upcoming].nextTitle;
    preview.src = slides[upcoming].thumb;
    preview.alt = slides[upcoming].nextTitle;

    counter.textContent = `0${index + 1} / 0${slides.length}`;
  }

  function goNext() {
    if (busy) return;

    busy = true;

    const upcoming = (index + 1) % slides.length;
    const slide = slides[upcoming];

    nextImage.style.backgroundImage = `url("${slide.image}")`;

    const image = new Image();
    image.src = slide.image;

    function startTransition() {
      hero.classList.add("is-transitioning");
    }

    if (image.complete) {
      startTransition();
    } else {
      image.onload = startTransition;
      image.onerror = startTransition;
    }

    window.setTimeout(() => {
      index = upcoming;

      activeImage.style.backgroundImage = `url("${slides[index].image}")`;

      nextImage.style.backgroundImage = `url("${
        slides[(index + 1) % slides.length].image
      }")`;

      paintSlide(index);

      hero.classList.remove("is-transitioning");

      updateNext();
      busy = false;
    }, reduceMotion ? 50 : 850);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (reduceMotion || document.hidden) {
      return;
    }

    autoplayTimer = window.setInterval(goNext, AUTOPLAY_DELAY);
  }

  button.addEventListener("click", () => {
    goNext();
    startAutoplay();
  });

  // Pause only while hovering the next card — the hero is nearly fullscreen,
  // so pausing on hero :hover permanently stops autoplay.
  button.addEventListener("mouseenter", stopAutoplay);
  button.addEventListener("mouseleave", startAutoplay);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  hero.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      goNext();
      startAutoplay();
    }
  });

  paintInitial();
  startAutoplay();
})();
