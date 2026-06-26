// ===== MODERN PORTFOLIO JAVASCRIPT =====

const roles = [
    "Software Engineer",
    "Research Intern",
    "Teaching Assistant",
    "Problem Solver",
    "Fast Learner",
    "Operating Systems Enthusiast",
    "Homelabbing Fanatic",
    "Triathlete"
];

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function debounce(callback, wait = 100) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), wait);
    };
}

function initTypingEffect() {
    const typingElement = qs("#typing-text");
    if (!typingElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        window.setTimeout(typeRole, typingSpeed);
    }

    window.setTimeout(typeRole, 1000);
}

function initTerminalLanding() {
    const output = qs("#terminalOutput");
    const enterCv = qs("#enterCv");
    if (!output || !enterCv) return;

    const lines = [
        { command: "whoami", response: "luca-moldovan" },
        { command: "pwd", response: "/home/luca/portfolio" },
        { command: "ls --skills", response: "systems  software-engineering  mainframe  research" },
        { command: "git status", response: "On branch: building-things-that-matter" },
        { command: "echo $READY", response: "portfolio online" }
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const addLine = (line) => {
        const commandLine = document.createElement("p");
        commandLine.className = "terminal-command";
        commandLine.innerHTML = '<span>luca@portfolio</span>:<span>~</span>$ ';
        const command = document.createElement("span");
        command.textContent = line.command;
        commandLine.append(command);
        output.append(commandLine);

        const response = document.createElement("p");
        response.className = "terminal-response";
        response.textContent = line.response;
        output.append(response);
    };

    if (reducedMotion) {
        lines.forEach(addLine);
        enterCv.hidden = false;
        return;
    }

    let lineIndex = 0;
    const renderNextLine = () => {
        if (lineIndex >= lines.length) {
            enterCv.hidden = false;
            enterCv.classList.add("is-ready");
            return;
        }

        addLine(lines[lineIndex]);
        lineIndex += 1;
        window.setTimeout(renderNextLine, 520);
    };

    window.setTimeout(renderNextLine, 450);
}

function initMobileNavigation() {
    const hamburger = qs(".hamburger");
    const navMenu = qs(".nav-menu");
    if (!hamburger || !navMenu) return;

    const closeMenu = () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    };

    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", () => {
        const isOpen = hamburger.classList.toggle("active");
        navMenu.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    qsa(".nav-link").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            closeMenu();
        }
    });
}

function highlightNavigation() {
    const scrollY = window.scrollY;

    qsa("section[id]").forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute("id");
        const navLink = qs(`.nav-link[href="#${sectionId}"]`);

        navLink?.classList.toggle(
            "active",
            scrollY > sectionTop && scrollY <= sectionBottom
        );
    });
}

function initNavbarScroll() {
    const navbar = qs("#navbar");
    if (!navbar) return;

    const updateNavbar = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 100);
        highlightNavigation();
    };

    updateNavbar();
    window.addEventListener("scroll", debounce(updateNavbar, 50), { passive: true });
}

function initSmoothScrolling() {
    qsa('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const id = anchor.getAttribute("href").slice(1);
            const target = id ? document.getElementById(id) : null;
            if (!target) return;

            event.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        });
    });
}

function initRevealAnimations() {
    const animatedElements = qsa(`
        .skill-category,
        .timeline-item,
        .project-card,
        .achievement-card,
        .stat-card
    `);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach((element) => {
        element.classList.add("reveal-on-scroll");
        observer.observe(element);
    });
}

function initBackToTopButton() {
    const backToTopButton = qs("#backToTop");
    if (!backToTopButton) return;

    const updateButton = () => {
        backToTopButton.classList.toggle("visible", window.scrollY > 300);
    };

    updateButton();
    window.addEventListener("scroll", debounce(updateButton, 50), { passive: true });
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function initContactForm() {
    const contactForm = qs("#contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get("name").trim();
        const email = formData.get("email").trim();
        const subject = formData.get("subject").trim();
        const message = formData.get("message").trim();
        const nameInput = qs("#name", contactForm);
        const messageInput = qs("#message", contactForm);
        const status = qs("#contactStatus", contactForm);
        const submitButton = qs("button[type='submit']", contactForm);
        const isPlainText = (value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
        const validName = /^[\p{L} ]{2,80}$/u.test(name);
        const validMessage = /^[\p{L}\p{N}\s!?.,]{1,2000}$/u.test(message);
        const setStatus = (messageText, type = "") => {
            if (!status) return;
            status.textContent = messageText;
            status.className = `form-status ${type}`.trim();
        };

        nameInput.setCustomValidity(validName ? "" : "Use letters and spaces only.");
        messageInput.setCustomValidity(validMessage ? "" : "Use letters, numbers, spaces, and ! ? , . only.");

        if (!contactForm.checkValidity() || !isPlainText(name) || !isPlainText(email) || !isPlainText(subject) || !isPlainText(message)) {
            contactForm.reportValidity();
            showProtectionWarning("Please use plain text in the contact form.");
            return;
        }

        formData.set("name", name);
        formData.set("email", email);
        formData.set("subject", subject.replace(/[\r\n]/g, " "));
        formData.set("message", message);

        setStatus("Sending message...");
        submitButton.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Formspree rejected the submission.");
            }

            contactForm.reset();
            setStatus("Message sent. Thank you for reaching out.", "success");
        } catch (error) {
            setStatus("The message could not be sent. Please try again or email me directly.", "error");
        } finally {
            submitButton.disabled = false;
        }
    });
}

function initFooterYear() {
    const yearElement = qs("#currentYear");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initLazyImages() {
    if (!("IntersectionObserver" in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const image = entry.target;
            image.src = image.dataset.src || image.src;
            image.classList.add("loaded");
            observer.unobserve(image);
        });
    });

    qsa("img[data-src]").forEach((image) => imageObserver.observe(image));
}

function initImageFallbacks() {
    qsa("img[data-fallback]").forEach((image) => {
        image.addEventListener("error", () => {
            if (image.src === image.dataset.fallback) return;
            image.src = image.dataset.fallback;
        });
    });
}

function showProtectionWarning(message = "Content protection is active.") {
    const warning = qs("#copyWarning");
    if (!warning) return;

    warning.textContent = message;
    warning.classList.add("visible");
    window.clearTimeout(showProtectionWarning.timeout);
    showProtectionWarning.timeout = window.setTimeout(() => {
        warning.classList.remove("visible");
    }, 2200);
}

function isEditableElement(element) {
    return element?.closest?.("input, textarea, select, [contenteditable='true']");
}

function initContentProtection() {
    if (!document.body.classList.contains("protected-page")) return;

    qsa("img").forEach((image) => {
        image.setAttribute("draggable", "false");
        image.addEventListener("dragstart", (event) => event.preventDefault());
    });

    document.addEventListener("contextmenu", (event) => {
        if (isEditableElement(event.target)) return;
        event.preventDefault();
        showProtectionWarning("Right-click is disabled on this page.");
    });

    document.addEventListener("copy", (event) => {
        if (isEditableElement(event.target)) return;
        event.preventDefault();
        showProtectionWarning("Copying is disabled on this page.");
    });

    document.addEventListener("cut", (event) => {
        if (isEditableElement(event.target)) return;
        event.preventDefault();
        showProtectionWarning("Cutting is disabled on this page.");
    });

    document.addEventListener("dragstart", (event) => {
        if (event.target.closest?.("img, a")) {
            event.preventDefault();
            showProtectionWarning("Dragging protected content is disabled.");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (isEditableElement(event.target)) return;

        const key = event.key.toLowerCase();
        const blocked =
            event.key === "F12" ||
            event.key === "PrintScreen" ||
            ((event.ctrlKey || event.metaKey) && ["s", "p", "u", "c", "x"].includes(key)) ||
            ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));

        if (!blocked) return;

        event.preventDefault();
        showProtectionWarning("This shortcut is disabled on this page.");
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "PrintScreen") {
            showProtectionWarning("Screenshots cannot be fully blocked in a browser.");
        }
    });

    window.addEventListener("blur", () => {
        document.body.classList.add("is-protected-blurred");
    });

    window.addEventListener("focus", () => {
        document.body.classList.remove("is-protected-blurred");
    });

    document.addEventListener("visibilitychange", () => {
        document.body.classList.toggle("is-protected-blurred", document.hidden);
    });
}

initImageFallbacks();

document.addEventListener("DOMContentLoaded", () => {
    initTypingEffect();
    initTerminalLanding();
    initMobileNavigation();
    initNavbarScroll();
    initSmoothScrolling();
    initRevealAnimations();
    initBackToTopButton();
    initContactForm();
    initFooterYear();
    initLazyImages();
    initContentProtection();
});

console.log("%cHello, Developer!", "color: #2563eb; font-size: 20px; font-weight: bold;");
console.log("%cInterested in the code? Check out my GitHub!", "color: #10b981; font-size: 14px;");
console.log("%chttps://github.com/moldovanluca4", "color: #6b7280; font-size: 12px;");
