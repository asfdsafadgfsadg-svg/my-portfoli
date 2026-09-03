document.addEventListener("DOMContentLoaded", () => {
    const langToggleBtn = document.getElementById("langToggle");
    const langText = document.getElementById("langText");
    const translatableElements = document.querySelectorAll("[data-ar]");
    let currentLang = "ar";

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

    function scrollToSection(targetPage, targetNav) {
        if (targetPage) {
            targetPage.scrollIntoView({ behavior: 'smooth' });
        }
        document.querySelectorAll(".nav-links a").forEach(link => link.classList.remove("active"));
        if (targetNav) targetNav.classList.add("active");
    }

    if (navHome) navHome.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageHome, navHome); });
    if (navWork) navWork.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageWork, navWork); });
    if (navTeachers) navTeachers.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageTeachers, navTeachers); });
    if (navJoin) navJoin.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageJoin, navJoin); });
    if (navAbout) navAbout.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageAbout, navAbout); });
    if (navContact) navContact.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageContact, navContact); });

    if (exploreBtn) exploreBtn.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageWork, navWork); });
    if (heroContactBtn) heroContactBtn.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageContact, navContact); });

    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            document.body.classList.add("lang-changing");
            setTimeout(() => {
                currentLang = currentLang === "ar" ? "en" : "ar";
                document.documentElement.setAttribute("lang", currentLang);
                document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
                if (langText) langText.textContent = currentLang === "ar" ? "English" : "العربية";

                translatableElements.forEach((el) => {
                    const text = el.getAttribute(`data-${currentLang}`);
                    if (text) el.innerHTML = text;
                });
                document.body.classList.remove("lang-changing");
            }, 100);
        });
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value;

            const whatsappText = `مرحباً Design Agency 👋%0A%0A*طلب خدمة جديد:*%0A• *الاسم:* ${encodeURIComponent(name)}%0A• *الرقم:* ${encodeURIComponent(phone)}%0A• *الخدمة:* ${encodeURIComponent(service)}%0A• *التفاصيل:* ${encodeURIComponent(message)}`;
            window.open(`https://wa.me/201027028889?text=${whatsappText}`, '_blank');
        });
    }
});