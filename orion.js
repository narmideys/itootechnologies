document.addEventListener("DOMContentLoaded", () => {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
	if (!reduceMotion && "IntersectionObserver" in window) {
		reveals.forEach((el, index) => {
			const siblings = el.parentElement
				? Array.from(el.parentElement.querySelectorAll(":scope > [data-reveal]"))
				: [];
			const localIndex = Math.max(0, siblings.indexOf(el));
			el.style.setProperty("--reveal-delay", `${Math.min(localIndex, 5) * 80}ms`);
			if (!el.hasAttribute("data-reveal-index")) {
				el.setAttribute("data-reveal-index", String(index));
			}
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
		);

		reveals.forEach((el) => observer.observe(el));
	} else {
		reveals.forEach((el) => el.classList.add("is-visible"));
	}

	const intro = document.querySelector(".or-intro");
	if (intro && "IntersectionObserver" in window) {
		const introObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) intro.classList.add("is-inview");
				});
			},
			{ threshold: 0.35 }
		);
		introObserver.observe(intro);
	}

	const hero = document.querySelector(".or-hero");
	if (hero && !reduceMotion) {
		const onScroll = () => {
			const y = Math.min(window.scrollY, 420);
			hero.style.setProperty("--or-parallax", `${y * 0.12}px`);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}

	initScenesCarousel(document.querySelector("[data-or-scenes]"));
	initStorySlider(document.querySelector("[data-or-story]"));
});

function initScenesCarousel(root) {
	if (!root) return;

	const track = root.querySelector("[data-or-scenes-track]");
	const items = Array.from(root.querySelectorAll("[data-or-scenes-item]"));
	const prevBtn = root.querySelector("[data-or-scenes-prev]");
	const nextBtn = root.querySelector("[data-or-scenes-next]");
	if (!track || items.length === 0) return;

	let index = 0;

	const getStep = () => {
		const first = items[0];
		if (!first) return 0;
		const style = getComputedStyle(track);
		const gap = parseFloat(style.gap) || 16;
		return first.getBoundingClientRect().width + gap;
	};

	const maxIndex = () => Math.max(0, items.length - visibleCount());

	function visibleCount() {
		const viewport = root.querySelector(".or-scenes__viewport");
		if (!viewport || !items[0]) return 1;
		const vw = viewport.clientWidth;
		const cardW = items[0].getBoundingClientRect().width || 1;
		const gap = parseFloat(getComputedStyle(track).gap) || 16;
		return Math.max(1, Math.floor((vw + gap) / (cardW + gap)));
	}

	const apply = () => {
		const step = getStep();
		track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
		if (prevBtn) prevBtn.disabled = index <= 0;
		if (nextBtn) nextBtn.disabled = index >= maxIndex();
	};

	prevBtn?.addEventListener("click", () => {
		index = Math.max(0, index - 1);
		apply();
	});

	nextBtn?.addEventListener("click", () => {
		index = Math.min(maxIndex(), index + 1);
		apply();
	});

	window.addEventListener(
		"resize",
		() => {
			index = Math.min(index, maxIndex());
			apply();
		},
		{ passive: true }
	);

	apply();
}

function initStorySlider(root) {
	if (!root) return;

	const slides = Array.from(root.querySelectorAll("[data-or-story-slide]"));
	const prevBtn = root.querySelector("[data-or-story-prev]");
	const nextBtn = root.querySelector("[data-or-story-next]");
	const dotsHost = root.querySelector("[data-or-story-dots]");
	if (slides.length === 0) return;

	let active = slides.findIndex((s) => s.classList.contains("is-active"));
	if (active < 0) active = 0;

	const dots = slides.map((_, i) => {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "or-story-slider__dot";
		btn.setAttribute("role", "tab");
		btn.setAttribute("aria-label", `Slide ${i + 1} of ${slides.length}`);
		btn.addEventListener("click", () => go(i));
		dotsHost?.appendChild(btn);
		return btn;
	});

	const go = (next) => {
		active = (next + slides.length) % slides.length;
		slides.forEach((slide, i) => {
			const on = i === active;
			slide.classList.toggle("is-active", on);
			slide.hidden = !on;
		});
		dots.forEach((dot, i) => {
			const on = i === active;
			dot.classList.toggle("is-active", on);
			dot.setAttribute("aria-selected", on ? "true" : "false");
		});
	};

	prevBtn?.addEventListener("click", () => go(active - 1));
	nextBtn?.addEventListener("click", () => go(active + 1));

	go(active);
}
