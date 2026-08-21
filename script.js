document.addEventListener("DOMContentLoaded", () => {
    const langToggleBtn = document.getElementById("langToggle");
    const langText = document.getElementById("langText");
    const translatableElements = document.querySelectorAll("[data-ar]");
    let currentLang = "ar";

    // Navigation Mapping
    const navHome = document.getElementById("nav-home");
    const navWork = document.getElementById("nav-work");
    const navTeachers = document.getElementById("nav-teachers");
    const navJoin = document.getElementById("nav-join");
    const navAbout = document.getElementById("nav-about");
    const navContact = document.getElementById("nav-contact");

    const pageHome = document.getElementById("page-home");
    const pageWork = document.getElementById("page-work");
    const pageTeachers = document.getElementById("page-teachers");
    const pageJoin = document.getElementById("page-join");
    const pageAbout = document.getElementById("page-about");
    const pageContact = document.getElementById("page-contact");

    const exploreBtn = document.getElementById("exploreBtn");
    const heroContactBtn = document.getElementById("heroContactBtn");
    const backHomeBtns = document.querySelectorAll(".backHomeBtn");

    const pages = [
        { nav: navHome, page: pageHome },
        { nav: navWork, page: pageWork },
        { nav: navTeachers, page: pageTeachers },
        { nav: navJoin, page: pageJoin },
        { nav: navAbout, page: pageAbout },
        { nav: navContact, page: pageContact }
    ];

    function navigateTo(targetPage, targetNav) {
        pages.forEach(item => {
            if (item.page) item.page.classList.remove("active");
            if (item.nav) item.nav.classList.remove("active");
        });

        if (targetPage) targetPage.classList.add("active");
        if (targetNav) targetNav.classList.add("active");

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Nav Click Events
    if (navHome) navHome.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageHome, navHome); });
    if (navWork) navWork.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageWork, navWork); });
    if (navTeachers) navTeachers.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageTeachers, navTeachers); });
    if (navJoin) navJoin.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageJoin, navJoin); });
    if (navAbout) navAbout.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageAbout, navAbout); });
    if (navContact) navContact.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageContact, navContact); });

    if (exploreBtn) exploreBtn.addEventListener("click", () => navigateTo(pageWork, navWork));
    if (heroContactBtn) heroContactBtn.addEventListener("click", (e) => { e.preventDefault(); navigateTo(pageContact, navContact); });

    backHomeBtns.forEach(btn => btn.addEventListener("click", () => navigateTo(pageHome, navHome)));

    // Mobile Hamburger Menu Logic
    const menuToggle = document.getElementById("menuToggle");
    const navLinksContainer = document.getElementById("navLinks");

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            navLinksContainer.classList.toggle("show-menu");
            const icon = menuToggle.querySelector("i");
            if (navLinksContainer.classList.contains("show-menu")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });

        navLinksContainer.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinksContainer.classList.remove("show-menu");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // Language Toggle logic
    langToggleBtn.addEventListener("click", () => {
        document.body.classList.add("lang-changing");

        setTimeout(() => {
            if (currentLang === "ar") {
                currentLang = "en";
                document.documentElement.setAttribute("lang", "en");
                document.documentElement.setAttribute("dir", "ltr");
                langText.textContent = "العربية";
            } else {
                currentLang = "ar";
                document.documentElement.setAttribute("lang", "ar");
                document.documentElement.setAttribute("dir", "rtl");
                langText.textContent = "English";
            }

            translatableElements.forEach((el) => {
                const text = el.getAttribute(`data-${currentLang}`);
                if (text) {
                    el.innerHTML = text;
                }
            });

            document.body.classList.remove("lang-changing");
        }, 200);
    });

    // Send Form Data directly to WhatsApp
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value;

            const myPhoneNumber = "201027028889";
            const whatsappText = `مرحباً Design Agency 👋%0A%0A*طلب خدمة جديد:*%0A• *الاسم:* ${encodeURIComponent(name)}%0A• *الرقم:* ${encodeURIComponent(phone)}%0A• *الخدمة المطلوبة:* ${encodeURIComponent(service)}%0A• *التفاصيل:* ${encodeURIComponent(message)}`;

            window.open(`https://wa.me/${myPhoneNumber}?text=${whatsappText}`, '_blank');
        });
    }
});