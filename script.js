/* ====== الإعدادات ======
   حط رقم الواتساب هنا بصيغة دولية بدون + أو أصفار (مثال مصر: 201012345678) */
const WHATSAPP_NUMBER = "201273975879";

/* مدة ظهور كل تصميم في الإطار (بالمللي ثانية). 5000 = 5 ثواني */
const SLIDE_MS = 5000;

(function () {
    "use strict";

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const html = document.documentElement;
    const navbar = $("#navbar");
    const navLinks = $("#navLinks");
    const menuToggle = $("#menuToggle");
    const toastEl = $("#toast");

    let lang = "ar";
    try { lang = localStorage.getItem("lang") === "en" ? "en" : "ar"; } catch (e) {}

    /* ---------- Toast ---------- */
    let toastTimer;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
    }

    const T = {
        ar: {
            fill: "كمّل البيانات الأول",
            phone: "رقم الواتساب مش مظبوط",
            noNumber: "رقم الواتساب لسه متضافش في script.js",
            hello: "أهلاً، أنا",
            service: "الخدمة المطلوبة",
            phoneLabel: "رقمي",
            details: "تفاصيل المشروع"
        },
        en: {
            fill: "Please fill in all fields",
            phone: "Phone number looks invalid",
            noNumber: "WhatsApp number is not set in script.js yet",
            hello: "Hi, I'm",
            service: "Service",
            phoneLabel: "My number",
            details: "Project details"
        }
    };

    /* ---------- Language ---------- */
    function applyLang(next) {
        lang = next;
        html.lang = lang;
        html.dir = lang === "ar" ? "rtl" : "ltr";
        $("#langText").textContent = lang === "ar" ? "EN" : "ع";

        $$("[data-ar]").forEach(el => {
            const v = el.getAttribute("data-" + lang);
            if (v == null) return;
            if (el.children.length === 0 || /<[a-z]/i.test(v)) el.innerHTML = v;
            else el.textContent = v;
        });

        try { localStorage.setItem("lang", lang); } catch (e) {}
    }

    $("#langToggle").addEventListener("click", () => {
        document.body.classList.add("lang-changing");
        setTimeout(() => {
            applyLang(lang === "ar" ? "en" : "ar");
            document.body.classList.remove("lang-changing");
        }, 150);
    });

    if (lang === "en") applyLang("en");

    /* ---------- Navbar ---------- */
    function onScroll() {
        navbar.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
    }
    menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    $$("a", navLinks).forEach(a => a.addEventListener("click", () => setMenu(false)));

    /* ---------- Active link on scroll ---------- */
    const sections = $$("main section[id]");
    const linkFor = id => $(`.nav-links a[href="#${id}"]`);

    if ("IntersectionObserver" in window) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                $$(".nav-links a").forEach(a => a.classList.remove("active"));
                const l = linkFor(e.target.id);
                if (l) l.classList.add("active");
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        sections.forEach(s => spy.observe(s));

        /* ---------- Reveal ---------- */
        const rev = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    rev.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
        $$(".reveal").forEach(el => rev.observe(el));
    } else {
        $$(".reveal").forEach(el => el.classList.add("visible"));
    }

    /* ---------- Lightbox ---------- */
    const lb = $("#lightbox");
    const lbImg = $("#lbImg");
    const lbCount = $("#lbCount");
    const items = $$("#workGrid .work-item img");
    let idx = 0;

    function show(i) {
        idx = (i + items.length) % items.length;
        lbImg.src = items[idx].currentSrc || items[idx].src;
        lbImg.alt = items[idx].alt;
        lbCount.textContent = `${idx + 1} / ${items.length}`;
    }
    function openLb(i) {
        show(i);
        lb.hidden = false;
        lb.classList.add("open");
        document.body.classList.add("no-scroll");
    }
    function closeLb() {
        lb.classList.remove("open");
        lb.hidden = true;
        document.body.classList.remove("no-scroll");
    }

    items.forEach((img, i) => img.closest(".work-item").addEventListener("click", () => openLb(i)));
    $(".lb-close").addEventListener("click", closeLb);
    $(".lb-prev").addEventListener("click", () => show(idx - 1));
    $(".lb-next").addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });

    document.addEventListener("keydown", e => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") closeLb();
        if (e.key === "ArrowLeft") show(idx - 1);
        if (e.key === "ArrowRight") show(idx + 1);
    });

    let tx = 0;
    lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });

    /* ---------- Contact → WhatsApp ---------- */
    const form = $("#contactForm");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const t = T[lang];
        const name = $("#name").value.trim();
        const phone = $("#phone").value.trim();
        const service = $("#service").selectedOptions[0].textContent.trim();
        const message = $("#message").value.trim();

        $$(".field", form).forEach(f => f.classList.remove("invalid"));
        let ok = true;
        [["#name", name], ["#phone", phone], ["#message", message]].forEach(([sel, val]) => {
            if (!val) { $(sel).closest(".field").classList.add("invalid"); ok = false; }
        });
        if (!ok) return toast(t.fill);

        if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) {
            $("#phone").closest(".field").classList.add("invalid");
            return toast(t.phone);
        }
        /* تنضيف الرقم: يشيل أي مسافات أو + أو شرط، ولو بيبدأ بصفر يحوله لصيغة مصر الدولية */
        const WA = String(WHATSAPP_NUMBER).replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "20");
        if (!/^\d{8,15}$/.test(WA)) return toast(t.noNumber);

        const text =
            `${t.hello} ${name}\n` +
            `${t.service}: ${service}\n` +
            `${t.phoneLabel}: ${phone}\n\n` +
            `${t.details}:\n${message}`;

        const url = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
        form.reset();
    });

    /* ---------- Hero background slideshow ---------- */
    (function () {
        const slides = $$("#heroShow .slide");
        if (slides.length < 2) return;
        let cur = 0, timer = null;

        function go(i) {
            slides[cur].classList.remove("active");
            cur = (i + slides.length) % slides.length;
            slides[cur].classList.add("active");
        }
        function start() { stop(); timer = setInterval(() => go(cur + 1), SLIDE_MS); }
        function stop() { clearInterval(timer); timer = null; }

        document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
        start();
    })();

    /* ---------- Misc ---------- */
    $("#year").textContent = new Date().getFullYear();
})();