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



	const about = document.querySelector(".se-about");

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



	const hero = document.querySelector(".se-hero");

	if (hero && !reduceMotion) {

		const onScroll = () => {

			const y = Math.min(window.scrollY, 420);

			hero.style.setProperty("--se-parallax", `${y * 0.18}px`);

		};

		window.addEventListener("scroll", onScroll, { passive: true });

		onScroll();

	}



	const stagesTrack = document.querySelector(".se-stages__track");

	if (stagesTrack && !reduceMotion && "IntersectionObserver" in window) {

		const stagesObserver = new IntersectionObserver(

			(entries) => {

				entries.forEach((entry) => {

					if (entry.isIntersecting) stagesTrack.classList.add("is-animated");

				});

			},

			{ threshold: 0.25 }

		);

		stagesObserver.observe(stagesTrack);

	}



	const pillarsStage = document.querySelector("[data-pillars-stage]");
	const stackSvg = document.querySelector("#se-stack-svg");

	const revealStack = () => {
		if (!stackSvg) return;
		if (typeof gsap === "undefined") {
			stackSvg.style.visibility = "visible";
			return;
		}

		gsap.set(stackSvg, { visibility: "visible" });

		if (reduceMotion) return;

		const tl = gsap.timeline();
		tl.from(
			"#se-stack-shadow",
			{
				scale: 0,
				duration: 0.15,
				delay: 0.12,
				transformOrigin: "center center",
				ease: "elastic.out(1.5, 1)",
			},
			"boxes-in"
		)
			.from(
				".se-stack-server",
				{
					scale: 0,
					duration: 0.75,
					transformOrigin: "center center",
					ease: "elastic.out(1.5, 1)",
					stagger: -0.15,
				},
				"boxes-in"
			)
			.from("#se-stack-server-1", { y: 60, duration: 0.28 }, "boxes")
			.from("#se-stack-server-2", { y: 30, duration: 0.28 }, "boxes")
			.from("#se-stack-server-4", { y: -30, duration: 0.28 }, "boxes")
			.from("#se-stack-server-5", { y: -60, duration: 0.28 }, "boxes")
			.from("#se-stack-shadow", { y: -60, duration: 0.28 }, "boxes")
			.from(".se-stack-lines", { opacity: 0, duration: 0.5 });
	};

	if (pillarsStage && stackSvg) {
		if (reduceMotion || !("IntersectionObserver" in window)) {
			revealStack();
		} else {
			const pillarsObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						revealStack();
						pillarsObserver.unobserve(pillarsStage);
					});
				},
				{ threshold: 0.28 }
			);
			pillarsObserver.observe(pillarsStage);
		}
	}

});

