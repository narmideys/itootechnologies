document.addEventListener("DOMContentLoaded", () => {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
	if (!reduceMotion && "IntersectionObserver" in window) {
		reveals.forEach((el) => {
			const siblings = el.parentElement
				? Array.from(el.parentElement.querySelectorAll(":scope > [data-reveal]"))
				: [];
			const localIndex = Math.max(0, siblings.indexOf(el));
			el.style.setProperty("--reveal-delay", `${Math.min(localIndex, 5) * 80}ms`);
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

	const hero = document.querySelector(".cs-hero");
	if (hero && !reduceMotion) {
		const onScroll = () => {
			const y = Math.min(window.scrollY, 420);
			hero.style.setProperty("--cs-parallax", `${y * 0.18}px`);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}

	const photoRoot = document.querySelector("[data-cs-photos]");
	if (photoRoot) {
		const track = photoRoot.querySelector(".cs-photos__track");
		const slides = Array.from(photoRoot.querySelectorAll(".cs-photos__slide"));
		let index = 0;
		const go = (next) => {
			index = (next + slides.length) % slides.length;
			track.style.transform = `translateX(-${index * 100}%)`;
			slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
		};
		photoRoot.querySelector(".cs-photos__nav--prev")?.addEventListener("click", () => go(index - 1));
		photoRoot.querySelector(".cs-photos__nav--next")?.addEventListener("click", () => go(index + 1));
	}

	const related = document.querySelector("[data-cs-related]");
	if (related) {
		const track = related.querySelector(".cs-related__track");
		const cards = Array.from(related.querySelectorAll(".cs-related__card"));
		let index = 0;
		const step = () => {
			const card = cards[0];
			if (!card) return 300;
			const gap = 18;
			return card.getBoundingClientRect().width + gap;
		};
		const maxIndex = () => Math.max(0, cards.length - 1);
		const go = (next) => {
			index = Math.max(0, Math.min(maxIndex(), next));
			track.style.transform = `translateX(-${index * step()}px)`;
		};
		related.querySelector('[data-dir="prev"]')?.addEventListener("click", () => go(index - 1));
		related.querySelector('[data-dir="next"]')?.addEventListener("click", () => go(index + 1));
		window.addEventListener("resize", () => go(index));
	}
});
