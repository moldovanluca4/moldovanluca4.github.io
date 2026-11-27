const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function initTerminalLanding() {
    const output = qs("#terminalOutput");
    const enterCv = qs("#enterCv");
    if (!output || !enterCv) return;

    const lines = [
        { command: "whoami", response: "luca-moldovan" },
        { command: "pwd", response: "/home/luca/portfolio" },
        { command: "ls --skills", response: "operating systems  software-engineering  research" },
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

    qsa(".nav-menu a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            closeMenu();
        }
    });
}

function initNavbarScroll() {
    const navbar = qs("#navbar");
    if (!navbar) return;

    const updateNavbar = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 100);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
}

function initBackToTopButton() {
    const backToTopButton = qs("#backToTop");
    if (!backToTopButton) return;

    const updateButton = () => {
        backToTopButton.classList.toggle("visible", window.scrollY > 300);
    };

    updateButton();
    window.addEventListener("scroll", updateButton, { passive: true });
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function initContactForm() {
    const contactForm = qs("#contactForm");
    if (!contactForm) return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const subjectParam = urlParams.get("subject");
        if (subjectParam) {
            const subjectInput = qs("#subject", contactForm);
            if (subjectInput) {
                subjectInput.value = subjectParam;
            }
        }
    } catch (_) {}

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
        } catch (_) {
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

    let isShieldActive = false;
    let isMetaPreBlurred = false;
    let shieldTimeout = null;

    const scrubClipboard = () => {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                navigator.clipboard.writeText("").catch(() => {});
            }
        } catch (_) {}
    };

    const activateScreenshotShield = (message = "Screenshots are disabled on this page.", duration = 3500) => {
        isShieldActive = true;
        document.body.classList.add("is-protected-blurred");
        scrubClipboard();
        window.setTimeout(scrubClipboard, 60);
        window.setTimeout(scrubClipboard, 200);
        window.setTimeout(scrubClipboard, 500);
        showProtectionWarning(message);

        window.clearTimeout(shieldTimeout);
        shieldTimeout = window.setTimeout(() => {
            isShieldActive = false;
            if (document.hasFocus() && !document.hidden) {
                document.body.classList.remove("is-protected-blurred");
            }
        }, duration);
    };

    const isScreenshotKey = (event) => {
        const rawKey = event.key || "";
        const key = rawKey.toLowerCase();
        const code = (event.code || "").toLowerCase();
        const keyCode = event.keyCode || event.which || 0;

        if (
            key === "printscreen" ||
            key === "print" ||
            key === "snapshot" ||
            key === "sysrq" ||
            key === "execute" ||
            key === "f13" ||
            key === "unidentified" ||
            key.includes("screen") ||
            key.includes("print") ||
            key.includes("snap") ||
            code === "printscreen" ||
            code === "f13" ||
            code.includes("screen") ||
            code.includes("print") ||
            keyCode === 44 ||
            keyCode === 124 ||
            keyCode === 0 ||
            keyCode === 255
        ) {
            return true;
        }

        if ((event.ctrlKey || event.metaKey) && event.shiftKey && ["s", "3", "4", "5", "6"].includes(key)) {
            return true;
        }

        return false;
    };

    window.addEventListener("keydown", (event) => {
        if (isEditableElement(event.target)) return;

        if (isScreenshotKey(event)) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            activateScreenshotShield("Screenshots are disabled on this page.");
            return;
        }

        const key = (event.key || "").toLowerCase();

        if (event.metaKey || key === "meta" || key === "super" || key === "os") {
            isMetaPreBlurred = true;
            document.body.classList.add("is-protected-blurred");
        }

        const blocked =
            event.key === "F12" ||
            ((event.ctrlKey || event.metaKey) && ["s", "p", "u", "c", "x"].includes(key)) ||
            ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));

        if (!blocked) return;

        event.preventDefault();
        event.stopPropagation();
        showProtectionWarning("This shortcut is disabled on this page.");
    }, true);

    window.addEventListener("keyup", (event) => {
        if (isEditableElement(event.target)) return;

        if (isScreenshotKey(event)) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            activateScreenshotShield("Screenshots are disabled on this page.");
            return;
        }

        if (isMetaPreBlurred && !event.metaKey) {
            isMetaPreBlurred = false;
            if (!isShieldActive && document.hasFocus() && !document.hidden) {
                document.body.classList.remove("is-protected-blurred");
            }
        }
    }, true);

    window.addEventListener("blur", () => {
        document.body.classList.add("is-protected-blurred");
    });

    window.addEventListener("focus", () => {
        if (!isShieldActive && !isMetaPreBlurred) {
            document.body.classList.remove("is-protected-blurred");
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.body.classList.add("is-protected-blurred");
        } else if (!isShieldActive && !isMetaPreBlurred && document.hasFocus()) {
            document.body.classList.remove("is-protected-blurred");
        }
    });
}

function initCvPreviewModal() {
    const openBtn = qs("#openCvPreview");
    const modal = qs("#cvPreviewModal");
    const backdrop = qs("#cvPreviewBackdrop");
    const closeBtn = qs("#closeCvPreview");
    const printBtn = qs("#printCvBtn");
    const tabDetailed = qs("#tabBtnDetailed");
    const tabSummary = qs("#tabBtnSummary");
    const paneDetailed = qs("#paneDetailed");
    const paneSummary = qs("#paneSummary");
    if (!openBtn || !modal) return;

    const setPreviewTab = (isDetailed) => {
        tabDetailed?.classList.toggle("active", isDetailed);
        tabDetailed?.setAttribute("aria-selected", String(isDetailed));
        tabSummary?.classList.toggle("active", !isDetailed);
        tabSummary?.setAttribute("aria-selected", String(!isDetailed));

        if (paneDetailed) {
            paneDetailed.classList.toggle("active", isDetailed);
            paneDetailed.hidden = !isDetailed;
        }
        if (paneSummary) {
            paneSummary.classList.toggle("active", !isDetailed);
            paneSummary.hidden = isDetailed;
        }
    };

    tabDetailed?.addEventListener("click", () => setPreviewTab(true));
    tabSummary?.addEventListener("click", () => setPreviewTab(false));

    const openModal = () => {
        modal.hidden = false;
        void modal.offsetWidth;
        modal.classList.add("is-visible");
        document.body.classList.add("modal-open");
        openBtn.setAttribute("aria-expanded", "true");
        closeBtn?.focus();
    };

    const closeModal = () => {
        modal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
        openBtn.setAttribute("aria-expanded", "false");

        window.setTimeout(() => {
            if (!modal.classList.contains("is-visible")) {
                modal.hidden = true;
            }
        }, 280);

        openBtn.focus();
    };

    openBtn.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    printBtn?.addEventListener("click", () => {
        setPreviewTab(false);
        window.setTimeout(() => {
            window.print();
        }, 60);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden && modal.classList.contains("is-visible")) {
            closeModal();
        }
    });
}

function initPhotoLightbox() {
    const modal = qs("#photoLightboxModal");
    if (!modal) return;

    const backdrop = qs("#lightboxBackdrop", modal);
    const closeBtn = qs("#closeLightboxBtn", modal);
    const lightboxImg = qs("#lightboxImg", modal);
    const lightboxCaption = qs("#lightboxCaption", modal);
    const lightboxTitle = qs("#lightboxTitle", modal);
    const cards = qsa(".photo-feature-card");
    if (!cards.length) return;

    let lastFocusedElement = null;

    const openLightbox = (card) => {
        lastFocusedElement = document.activeElement;
        const fullSrc = card.getAttribute("data-full");
        const caption = card.getAttribute("data-caption") || "";
        const titleEl = qs("h3", card);
        const titleText = titleEl ? titleEl.textContent.trim() : "Photo Preview";
        const imgEl = qs("img", card);
        const altText = imgEl ? (imgEl.getAttribute("alt") || titleText) : titleText;

        if (lightboxImg && fullSrc) {
            lightboxImg.src = fullSrc;
            lightboxImg.alt = altText;
        }
        if (lightboxTitle) {
            lightboxTitle.textContent = titleText;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
        }

        modal.hidden = false;
        void modal.offsetWidth;
        modal.classList.add("is-visible");
        document.body.classList.add("modal-open");
        closeBtn?.focus();
    };

    const closeLightbox = () => {
        modal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");

        window.setTimeout(() => {
            if (!modal.classList.contains("is-visible")) {
                modal.hidden = true;
                if (lightboxImg) lightboxImg.src = "";
            }
        }, 280);

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    };

    cards.forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `View full photo: ${qs("h3", card)?.textContent?.trim() || "photo"}`);

        card.addEventListener("click", () => openLightbox(card));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(card);
            }
        });
    });

    closeBtn?.addEventListener("click", closeLightbox);
    backdrop?.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden && modal.classList.contains("is-visible")) {
            closeLightbox();
        }
    });
}

function initPresentationModal() {
    const openBtn = qs("#openPresentationBtn");
    const modal = qs("#presentationModal");
    if (!openBtn || !modal) return;

    const backdrop = qs("#presentationBackdrop", modal);
    const closeBtn = qs("#closePresentationBtn", modal);
    const closeFooterBtn = qs("#closePresentationFooterBtn", modal);
    const iframe = qs(".presentation-pdf-iframe", modal);

    let lastFocusedElement = null;

    const openModal = () => {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        void modal.offsetWidth;
        modal.classList.add("is-visible");
        document.body.classList.add("modal-open");
        openBtn.setAttribute("aria-expanded", "true");
        closeBtn?.focus();

        if (iframe && !iframe.getAttribute("src")) {
            iframe.src = "../../res/d0/d03.pdf#toolbar=0&navpanes=0&scrollbar=1";
        }
    };

    const closeModal = () => {
        modal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
        openBtn.setAttribute("aria-expanded", "false");

        window.setTimeout(() => {
            if (!modal.classList.contains("is-visible")) {
                modal.hidden = true;
            }
        }, 280);

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    };

    openBtn.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    closeFooterBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden && modal.classList.contains("is-visible")) {
            closeModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTerminalLanding();
    initMobileNavigation();
    initNavbarScroll();
    initBackToTopButton();
    initContactForm();
    initFooterYear();
    initContentProtection();
    initCvPreviewModal();
    initPhotoLightbox();
    initPresentationModal();
});
