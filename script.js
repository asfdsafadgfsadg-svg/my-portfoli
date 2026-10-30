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
            details: "تفاصيل المشروع",
            badName: "الاسم لازم يكون من 2 لـ 30 حرف ومن غير الرموز < >",
            pwShort: "الباسورد لازم يكون 6 حروف على الأقل",
            pwMatch: "الباسوردين مش متطابقين",
            taken: "الاسم ده مستخدم قبل كده",
            badLogin: "الاسم أو الباسورد غلط",
            created: "تم إنشاء الحساب، أهلاً بيك",
            welcome: "أهلاً بيك",
            bye: "تم تسجيل الخروج",
            noStore: "المتصفح مش بيسمح بحفظ الحساب (جرّب من غير وضع التخفي)"
        },
        en: {
            fill: "Please fill in all fields",
            phone: "Phone number looks invalid",
            noNumber: "WhatsApp number is not set in script.js yet",
            hello: "Hi, I'm",
            service: "Service",
            phoneLabel: "My number",
            details: "Project details",
            badName: "Name must be 2–30 characters without < >",
            pwShort: "Password must be at least 6 characters",
            pwMatch: "Passwords do not match",
            taken: "This name is already taken",
            badLogin: "Wrong name or password",
            created: "Account created, welcome!",
            welcome: "Welcome back",
            bye: "Logged out",
            noStore: "Your browser blocks saving the account (try without private mode)"
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

    /* ---------- التصاميم: من غير تكبير ولا سحب ---------- */
    $$("#workGrid img").forEach(img => {
        img.draggable = false;
        img.addEventListener("dragstart", e => e.preventDefault());
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

    /* ---------- Login / Sign up ----------
       ملحوظة: الموقع ستاتيك (GitHub Pages) فالحسابات بتتحفظ على نفس الجهاز والمتصفح بس،
       والباسورد بيتخزن مشفّر (PBKDF2) مش نص عادي. */
    (function () {
        const modal = $("#authModal");
        if (!modal) return;
        const loginBtn = $("#loginBtn"), loginLabel = $("#loginLabel");
        const tabs = $$(".auth-tab", modal), tabsBar = $("#authTabs");
        const panels = { signup: $("#signupForm"), login: $("#loginForm"), account: $("#accountPanel") };
        const USERS = "da_users", SESSION = "da_session";

        const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
        const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
        const drop = k => { try { localStorage.removeItem(k); } catch (e) {} };

        const enc = new TextEncoder();
        const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
        const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
        const newSalt = () => b64(crypto.getRandomValues(new Uint8Array(16)));
        async function hashPw(pw, salt) {
            const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
            const bits = await crypto.subtle.deriveBits(
                { name: "PBKDF2", salt: unb64(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
            return b64(bits);
        }

        const current = () => read(SESSION);
        const clearInvalid = f => $$(".field", f).forEach(r => r.classList.remove("invalid"));
        const mark = el => el.closest(".field").classList.add("invalid");

        function renderBtn() {
            const u = current();
            const ar = u ? u.name : "تسجيل الدخول", en = u ? u.name : "Log in";
            loginLabel.setAttribute("data-ar", ar);
            loginLabel.setAttribute("data-en", en);
            loginLabel.textContent = lang === "ar" ? ar : en;
            loginBtn.classList.toggle("logged", !!u);
        }

        function showPanel(name) {
            Object.keys(panels).forEach(k => { panels[k].hidden = k !== name; });
            tabsBar.hidden = name === "account";
            tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
            if (name === "account") $("#accName").textContent = current().name;
        }

        function openAuth() {
            showPanel(current() ? "account" : "signup");
            modal.hidden = false;
            modal.classList.add("open");
            document.body.classList.add("no-scroll");
            const first = $("input", panels.signup.hidden ? panels.login : panels.signup);
            if (first && !current()) setTimeout(() => first.focus(), 60);
        }
        function closeAuth() {
            modal.classList.remove("open");
            modal.hidden = true;
            document.body.classList.remove("no-scroll");
        }

        loginBtn.addEventListener("click", openAuth);
        $("#authClose").addEventListener("click", closeAuth);
        modal.addEventListener("click", e => { if (e.target === modal) closeAuth(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeAuth(); });
        tabs.forEach(t => t.addEventListener("click", () => {
            showPanel(t.dataset.tab);
            const first = $("input", panels[t.dataset.tab]);
            if (first) first.focus();
        }));

        /* إنشاء حساب */
        panels.signup.addEventListener("submit", async e => {
            e.preventDefault();
            const t = T[lang], f = panels.signup;
            const nameEl = $("#suName"), p1 = $("#suPass"), p2 = $("#suPass2");
            const name = nameEl.value.trim().replace(/\s+/g, " ");
            clearInvalid(f);

            if (!name || !p1.value || !p2.value) {
                [[nameEl, name], [p1, p1.value], [p2, p2.value]].forEach(([el, v]) => { if (!v) mark(el); });
                return toast(t.fill);
            }
            if (name.length < 2 || name.length > 30 || /[<>]/.test(name)) { mark(nameEl); return toast(t.badName); }
            if (p1.value.length < 6) { mark(p1); return toast(t.pwShort); }
            if (p1.value !== p2.value) { mark(p2); return toast(t.pwMatch); }
            if (!(window.crypto && crypto.subtle)) return toast(t.noStore);

            const users = read(USERS) || {};
            const key = name.toLowerCase();
            if (users[key]) { mark(nameEl); return toast(t.taken); }

            try {
                const salt = newSalt();
                users[key] = { name, salt, hash: await hashPw(p1.value, salt) };
                if (!write(USERS, users) || !write(SESSION, { key, name })) return toast(t.noStore);
            } catch (err) { return toast(t.noStore); }

            f.reset();
            renderBtn();
            closeAuth();
            toast(t.created);
        });

        /* تسجيل الدخول */
        panels.login.addEventListener("submit", async e => {
            e.preventDefault();
            const t = T[lang], f = panels.login;
            const nameEl = $("#liName"), pEl = $("#liPass");
            const name = nameEl.value.trim().replace(/\s+/g, " ");
            clearInvalid(f);

            if (!name || !pEl.value) {
                if (!name) mark(nameEl);
                if (!pEl.value) mark(pEl);
                return toast(t.fill);
            }
            if (!(window.crypto && crypto.subtle)) return toast(t.noStore);

            const key = name.toLowerCase();
            const u = (read(USERS) || {})[key];
            let ok = false;
            try { ok = !!u && (await hashPw(pEl.value, u.salt)) === u.hash; } catch (err) {}
            if (!ok) { mark(nameEl); mark(pEl); return toast(t.badLogin); }

            write(SESSION, { key, name: u.name });
            f.reset();
            renderBtn();
            closeAuth();
            toast(t.welcome + "، " + u.name);
        });

        /* تسجيل الخروج */
        $("#logoutBtn").addEventListener("click", () => {
            drop(SESSION);
            renderBtn();
            closeAuth();
            toast(T[lang].bye);
        });

        /* لما اللغة تتغير يرجّع اسم المستخدم/النص صح */
        $("#langToggle").addEventListener("click", () => setTimeout(renderBtn, 220));
        renderBtn();
    })();

    /* ---------- Video: يشتغل لوحده وهو ظاهر، ويقف لما يغيب ---------- */
    const siteVideo = $("#siteVideo");
    if (siteVideo) {
        siteVideo.muted = true;
        const play = () => { const r = siteVideo.play(); if (r && r.catch) r.catch(() => {}); };
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? play() : siteVideo.pause()), { threshold: 0.15 }).observe(siteVideo);
        } else { play(); }
        document.addEventListener("visibilitychange", () => { if (document.hidden) siteVideo.pause(); });
    }

    /* ---------- Misc ---------- */
    $("#year").textContent = new Date().getFullYear();
})();