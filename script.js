window.addEventListener("DOMContentLoaded", () => {
	const burger = document.querySelector(".header__burger");
	const navWrapper = document.querySelector(".header__navigation-wrapper");

	const backTop = document.createElement("button");
	backTop.type = "button";
	backTop.className = "itoo-back-top";
	backTop.setAttribute("aria-label", "Go to top");
	backTop.innerHTML =
		'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
	document.body.appendChild(backTop);

	const toggleBackTop = () => {
		backTop.classList.toggle("is-visible", window.scrollY > 320);
	};

	backTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	window.addEventListener("scroll", toggleBackTop, { passive: true });
	toggleBackTop();

	if (burger && navWrapper) {
		burger.addEventListener("click", () => {
			burger.classList.toggle("active");
			navWrapper.classList.toggle("open");
		});
	}

	document.querySelectorAll(".header__list-item.has-submenu").forEach((item) => {
		const trigger = item.querySelector(":scope > a");

		if (!trigger) return;

		trigger.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();

			const willOpen = !item.classList.contains("active");

			document.querySelectorAll(".header__list-item.has-submenu").forEach((other) => {
				if (other === item) return;

				other.classList.remove("active");

				const otherMenu = other.querySelector(".submenu-wrapper");

				if (otherMenu) otherMenu.style.maxHeight = null;
			});

			item.classList.toggle("active", willOpen);

			const submenuWrapper = item.querySelector(".submenu-wrapper");

			if (!submenuWrapper) return;

			if (window.innerWidth <= 1025) {
				submenuWrapper.style.maxHeight = willOpen
					? `${submenuWrapper.scrollHeight}px`
					: null;
			} else {
				submenuWrapper.style.maxHeight = null;
			}
		});
	});

	document.addEventListener("click", (event) => {
		if (event.target.closest(".header__list-item.has-submenu")) return;

		document.querySelectorAll(".header__list-item.has-submenu.active").forEach((item) => {
			item.classList.remove("active");

			const submenuWrapper = item.querySelector(".submenu-wrapper");

			if (submenuWrapper) submenuWrapper.style.maxHeight = null;
		});
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth <= 1025) {
			document
				.querySelectorAll(".header__list-item.has-submenu.active")
				.forEach((item) => {
					const submenuWrapper = item.querySelector(".submenu-wrapper");

					if (submenuWrapper) {
						submenuWrapper.style.maxHeight = `${submenuWrapper.scrollHeight}px`;
					}
				});
		} else {
			document.querySelectorAll(".submenu-wrapper").forEach((wrapper) => {
				wrapper.style.maxHeight = null;
			});
		}
	});

	document.querySelectorAll('a[href="#"]').forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
		});
	});

	const submenuWrappers = document.querySelectorAll(".submenu-wrapper");

	submenuWrappers.forEach((submenuWrapper) => {
		const submenuItems = submenuWrapper.querySelectorAll(
			".submenu-list__item.has-submenu"
		);
		const defaultActiveItem = submenuWrapper.querySelector(
			".submenu-list__item.has-submenu.active"
		);

		let returnTimeout;

		submenuItems.forEach((item) => {
			item.addEventListener("mouseenter", () => {
				clearTimeout(returnTimeout);

				submenuItems.forEach((i) => i.classList.remove("active"));

				item.classList.add("active");
			});
		});

		submenuWrapper.addEventListener("mouseleave", () => {
			submenuItems.forEach((i) => i.classList.remove("active"));

			returnTimeout = setTimeout(() => {
				if (defaultActiveItem) {
					defaultActiveItem.classList.add("active");
				}
			}, 300);
		});
	});

	const counterBand = document.querySelector(".counter-band");
	const counterValues = document.querySelectorAll(".counter-band__value[data-count]");

	if (counterBand && counterValues.length) {
		const animateCount = (el) => {
			const target = Number(el.dataset.count) || 0;
			const suffix = el.dataset.suffix || "";
			const duration = 1400;
			const start = performance.now();

			const tick = (now) => {
				const progress = Math.min((now - start) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				el.textContent = `${Math.round(target * eased)}${suffix}`;

				if (progress < 1) {
					requestAnimationFrame(tick);
				}
			};

			requestAnimationFrame(tick);
		};

		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					counterValues.forEach(animateCount);
					obs.disconnect();
				});
			},
			{ threshold: 0.35 }
		);

		observer.observe(counterBand);
	}

	const story = document.querySelector("#itooStory");
	const storyMark = document.querySelector("[data-parallax-mark]");
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	if (story && storyMark && !reduceMotion) {
		let ticking = false;

		const updateParallax = () => {
			const rect = story.getBoundingClientRect();
			const viewH = window.innerHeight || 1;
			const travel = Math.max(rect.height - viewH, 1);
			const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
			const shift = (progress - 0.5) * 180;
			const drift = (progress - 0.5) * 80;

			storyMark.style.transform =
				`translate3d(${drift}px, ${shift}px, 0) scale(${1 + progress * 0.08})`;
			ticking = false;
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(updateParallax);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		updateParallax();
	}

	const qafiSpotlight = document.querySelector(".qafi-spotlight");
	if (qafiSpotlight) {
		if (reduceMotion) {
			qafiSpotlight.classList.add("is-inview");
		} else if ("IntersectionObserver" in window) {
			const spotlightObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						entry.target.classList.add("is-inview");
						spotlightObserver.unobserve(entry.target);
					});
				},
				{ threshold: 0.28 }
			);
			spotlightObserver.observe(qafiSpotlight);
		} else {
			qafiSpotlight.classList.add("is-inview");
		}
	}

	const caseShell = document.getElementById("caseStudiesSlider");
	if (caseShell) {
		const track = caseShell.querySelector(".case-studies__track");
		const slider = caseShell.querySelector(".case-studies__slider");
		const btnPrev = caseShell.querySelector('[data-dir="prev"]');
		const btnNext = caseShell.querySelector('[data-dir="next"]');

		if (track && btnPrev && btnNext) {
			let slides = Array.from(track.children);
			const slideCount = slides.length;

			const firstClone = slides[0].cloneNode(true);
			const lastClone = slides[slides.length - 1].cloneNode(true);
			firstClone.classList.add("clone");
			lastClone.classList.add("clone");
			track.insertBefore(lastClone, slides[0]);
			track.appendChild(firstClone);

			slides = Array.from(track.children);

			let currentIndex = 1;
			let slideWidth = 0;
			let isAnimating = false;
			let autoplayTimer = null;
			let animSafetyTimer = null;
			const autoplayMs = 3500;
			const canAutoplay = !reduceMotion;

			const getSlideWidth = () => {
				const slide = slides[0];
				if (!slide) return 0;
				const styles = window.getComputedStyle(slide);
				const width = slide.getBoundingClientRect().width;
				const marginRight = parseFloat(styles.marginRight || "0");
				return width + marginRight;
			};

			const refreshWidth = () => {
				slideWidth = getSlideWidth();
				return slideWidth > 0;
			};

			const updateTrackPosition = (animate = true) => {
				if (!refreshWidth()) return;
				track.style.transition = animate
					? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
					: "none";
				track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
			};

			const unlock = () => {
				isAnimating = false;
				if (animSafetyTimer) {
					clearTimeout(animSafetyTimer);
					animSafetyTimer = null;
				}
			};

			const stopAutoplay = () => {
				if (autoplayTimer) {
					clearTimeout(autoplayTimer);
					autoplayTimer = null;
				}
			};

			const startAutoplay = () => {
				if (!canAutoplay || document.hidden) return;
				stopAutoplay();
				autoplayTimer = setTimeout(() => {
					goTo(currentIndex + 1);
					startAutoplay();
				}, autoplayMs);
			};

			const goTo = (index) => {
				if (isAnimating) return;
				if (!refreshWidth()) {
					requestAnimationFrame(() => goTo(index));
					return;
				}
				isAnimating = true;
				currentIndex = index;
				updateTrackPosition(true);
				if (animSafetyTimer) clearTimeout(animSafetyTimer);
				animSafetyTimer = setTimeout(unlock, 700);
			};

			btnNext.addEventListener("click", () => {
				goTo(currentIndex + 1);
				startAutoplay();
			});
			btnPrev.addEventListener("click", () => {
				goTo(currentIndex - 1);
				startAutoplay();
			});

			track.addEventListener("transitionend", (event) => {
				if (event.target !== track || event.propertyName !== "transform") {
					return;
				}
				if (slides[currentIndex].classList.contains("clone")) {
					if (currentIndex === slides.length - 1) {
						currentIndex = 1;
					} else if (currentIndex === 0) {
						currentIndex = slideCount;
					}
					updateTrackPosition(false);
				}
				unlock();
			});

			window.addEventListener("resize", () => {
				updateTrackPosition(false);
			});

			let startX = 0;
			let isDragging = false;

			track.addEventListener(
				"touchstart",
				(e) => {
					startX = e.touches[0].clientX;
					isDragging = true;
					stopAutoplay();
				},
				{ passive: true }
			);

			track.addEventListener("touchend", (e) => {
				if (!isDragging) return;
				isDragging = false;
				const endX = e.changedTouches[0].clientX;
				const delta = endX - startX;
				const threshold = 40;
				if (delta > threshold) goTo(currentIndex - 1);
				else if (delta < -threshold) goTo(currentIndex + 1);
				startAutoplay();
			});

			const pauseTarget = slider || track;
			pauseTarget.addEventListener("mouseenter", stopAutoplay);
			pauseTarget.addEventListener("mouseleave", startAutoplay);
			document.addEventListener("visibilitychange", () => {
				if (document.hidden) stopAutoplay();
				else startAutoplay();
			});

			const boot = () => {
				updateTrackPosition(false);
				startAutoplay();
			};

			requestAnimationFrame(() => {
				requestAnimationFrame(boot);
			});
			window.addEventListener("load", () => {
				updateTrackPosition(false);
				startAutoplay();
			});
		}
	}

});
