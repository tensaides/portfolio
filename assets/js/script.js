document.addEventListener("DOMContentLoaded", () => {

    // 0. MOBILE MENU TOGGLE
    const menuBtn = document.getElementById('menuOpen');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayLinks = document.querySelectorAll('.overlayLinks li a');

    if (menuBtn && menuOverlay) {
        const menuTl = gsap.timeline({ 
            paused: true, 
            reversed: true,
            onReverseComplete: () => gsap.set(menuOverlay, { visibility: 'hidden' })
        });

        menuTl
            .set(menuOverlay, { visibility: 'visible' })
            .to(menuOverlay, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "power3.inOut" })
            .from(overlayLinks, { y: 100, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4");

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('isActive');
            menuTl.reversed() ? menuTl.play() : menuTl.reverse();
        });

        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('isActive');
                menuTl.reverse();
            });
        });
    }

    // 1. HORIZONTAL SCROLL (SECCIÓN SUPERIOR ABOUT)
    const aboutWrapper = document.getElementById("aboutScrollWrapper");
    const aboutContainer = document.getElementById("aboutHorizontalContainer");

    if (aboutWrapper && aboutContainer) {
        function getAboutScrollAmount() {
            let containerWidth = aboutContainer.scrollWidth;
            return -(containerWidth - window.innerWidth);
        }

        const tween = gsap.to(aboutContainer, {
            x: getAboutScrollAmount,
            ease: "none",
        });

        ScrollTrigger.create({
            trigger: aboutWrapper,
            start: "top top",
            end: () => `+=${getAboutScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
        });
    }

    // 1.5. ANIMACIÓN TEXTO ABOUT (SCROLL HORIZONTAL)
    const aboutScrollTexts = [
        ".hugeInfoTitle", 
        ".bioHighlight p", 
        ".infoFooter", 
        ".extendedBioContent h2", 
        ".extendedBioContent p"
    ];

    aboutScrollTexts.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            gsap.fromTo(elements, 
                { y: 50, opacity: 0, filter: 'blur(10px)' },
                {
                    y: 0, opacity: 1, filter: 'blur(0px)',
                    duration: 1, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: "#aboutScrollWrapper",
                        start: "top 60%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    });

    // 2. LOAD PROJECTS & PREVIEW
    const projectList = document.getElementById("projectsListContainer");
    const previewWrapper = document.getElementById("previewWrapper");
    const previewImg = document.getElementById("previewImg");
    const JSON_URL = "assets/js/projects-overview.json";

    if (projectList) {
        fetch(JSON_URL)
        .then(res => res.json())
        .then(projects => {
            projects.forEach(project => {
                const row = document.createElement("a");
                row.href = `project-detail.html?id=${project.id}`;
                row.className = "menuItem";
                row.dataset.thumbnail = project.thumbnail;
                row.style.textDecoration = "none";
                row.style.display = "flex"; 

                row.innerHTML = `
                    <div class="title">${project.title}</div>
                    <div class="chips">
                        ${project.categories.map(cat => `<span class="chip">${cat}</span>`).join('')}
                    </div>
                `;

                row.addEventListener("mouseenter", () => {
                    if (previewWrapper && previewImg) {
                        const rowRect = row.getBoundingClientRect();
                        const rowCenterY = rowRect.top + (rowRect.height / 2);
                        previewWrapper.style.top = `${rowCenterY}px`;
                        previewImg.src = row.dataset.thumbnail;
                        previewWrapper.classList.add("visible");
                    }
                });
                row.addEventListener("mouseleave", () => {
                    if (previewWrapper) previewWrapper.classList.remove("visible");
                });
                projectList.appendChild(row);
            });
        });
    }
    
    // 3. TEXT ANIMATIONS (Blur effect & Reveal)
    
    const runSplit = (selector, types) => {
        if (document.querySelector(selector)) return new SplitType(selector, { types: types });
        return { chars: [], words: [], lines: [] };
    };

    const animateText = (elements, trigger, delay = 0) => {
        if (elements && elements.length > 0) {
            gsap.fromTo(elements, 
                { y: 50, opacity: 0, filter: 'blur(10px)' },
                { 
                    y: 0, opacity: 1, filter: 'blur(0px)', 
                    duration: 1, stagger: 0.02, ease: 'power3.out', delay: delay,
                    scrollTrigger: { trigger: trigger, start: "top 80%" }
                }
            );
        }
    };

    // Animación Home About
    const splitHeadline = runSplit('.aboutHeadline', 'chars');
    animateText(splitHeadline.chars, '.aboutHeadline', 0);

    // Animación Featured Headline
    const splitFeatured = runSplit('.featuredHeadline', 'words, chars');
    animateText(splitFeatured.words, '.featuredHeadline', 0);


    // 4. REAL TIME CLOCK (MADRID)
    
    const locationElement = document.querySelector('.infoLocation');

    if (locationElement) {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                timeZone: 'Europe/Madrid',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            locationElement.textContent = `MADRID ${timeString}`;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

});