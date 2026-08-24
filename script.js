document.addEventListener("DOMContentLoaded", () => {
    const langToggleBtn = document.getElementById("langToggle");
    const langText = document.getElementById("langText");
    const translatableElements = document.querySelectorAll("[data-ar]");
    let currentLang = "ar";

    // Navigation Mapping (Scroll-to-Section Links)
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

    // دالة الانتقال بالتمرير (Smooth Scroll) لكل الأقسام تحت بعضها
    function scrollToSection(targetPage, targetNav) {
        if (targetPage) {
            targetPage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // تحديث كلاس الـ active في القائمة لو حبيت
        document.querySelectorAll(".nav-links a").forEach(link => link.classList.remove("active"));
        if (targetNav) targetNav.classList.add("active");
    }

    // ربط أزرار القائمة بالتمرير السلس
    if (navHome) navHome.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageHome, navHome); });
    if (navWork) navWork.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageWork, navWork); });
    if (navTeachers) navTeachers.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageTeachers, navTeachers); });
    if (navJoin) navJoin.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageJoin, navJoin); });
    if (navAbout) navAbout.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageAbout, navAbout); });
    if (navContact) navContact.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageContact, navContact); });

    if (exploreBtn) exploreBtn.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageWork, navWork); });
    if (heroContactBtn) heroContactBtn.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageContact, navContact); });

    backHomeBtns.forEach(btn => btn.addEventListener("click", (e) => { e.preventDefault(); scrollToSection(pageHome, navHome); }));

    // Language Toggle logic
    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            document.body.classList.add("lang-changing");

            setTimeout(() => {
                if (currentLang === "ar") {
                    currentLang = "en";
                    document.documentElement.setAttribute("lang", "en");
                    document.documentElement.setAttribute("dir", "ltr");
                    if (langText) langText.textContent = "العربية";
                } else {
                    currentLang = "ar";
                    document.documentElement.setAttribute("lang", "ar");
                    document.documentElement.setAttribute("dir", "rtl");
                    if (langText) langText.textContent = "English";
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
    }

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