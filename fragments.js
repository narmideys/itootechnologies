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

	const hero = document.querySelector(".fr-hero");
	if (hero && !reduceMotion) {
		const onScroll = () => {
			const y = Math.min(window.scrollY, 420);
			hero.style.setProperty("--fr-parallax", `${y * 0.18}px`);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}

	const tabs = Array.from(document.querySelectorAll("[data-fr-tab]"));
	const panels = Array.from(document.querySelectorAll("[data-fr-panel]"));

	const activateTab = (key) => {
		tabs.forEach((tab) => {
			const active = tab.getAttribute("data-fr-tab") === key;
			tab.classList.toggle("is-active", active);
			tab.setAttribute("aria-selected", active ? "true" : "false");
		});
		panels.forEach((panel) => {
			const active = panel.getAttribute("data-fr-panel") === key;
			panel.classList.toggle("is-active", active);
			if (active) {
				panel.removeAttribute("hidden");
			} else {
				panel.setAttribute("hidden", "");
			}
		});
	};

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const key = tab.getAttribute("data-fr-tab");
			if (key) activateTab(key);
		});
	});
});
