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

	const about = document.querySelector(".tb-about");
	if (about && "IntersectionObserver" in window) {
		const aboutObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) about.classList.add("is-inview");
				});
			},
			{ threshold: 0.35 }
		);
		aboutObserver.observe(about);
	}

	const hero = document.querySelector(".tb-hero");
	if (hero && !reduceMotion) {
		const onScroll = () => {
			const y = Math.min(window.scrollY, 420);
			hero.style.setProperty("--tb-parallax", `${y * 0.18}px`);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}
});
