(() => {
    // ---- Date stamp, top right
    const now = new Date();
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const pad = (n) => String(n).padStart(2, "0");
    const dateEl = document.querySelector("[data-date]");
    const dayEl = document.querySelector("[data-day]");
    if (dateEl) dateEl.textContent = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
    if (dayEl) dayEl.textContent = days[now.getDay()];

    // ---- Ransom-note titles: <h1 data-ransom>About</h1> → letter tiles
    document.querySelectorAll("[data-ransom]").forEach((el) => {
        const text = el.textContent.trim();
        el.setAttribute("aria-label", text);
        el.textContent = "";
        text.split(/\s+/).forEach((word) => {
            const w = document.createElement("span");
            w.className = "word";
            w.setAttribute("aria-hidden", "true");
            for (const ch of word) {
                const l = document.createElement("span");
                l.className = "l";
                l.textContent = ch;
                w.appendChild(l);
            }
            el.appendChild(w);
        });
    });

    document.querySelectorAll(".ransom").forEach((r) =>
        r.querySelectorAll(".l").forEach((el, i) => el.style.setProperty("--d", i))
    );

    const go = (el) => { if (el && el.href) window.location.href = el.href; };
    const plainKey = (e) => !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);

    // ---- Homepage menu: one item is always selected, like a game menu
    const items = [...document.querySelectorAll(".menu-item")];
    if (items.length) {
        let current = 0;
        const select = (index, focus = false) => {
            current = (index + items.length) % items.length;
            items.forEach((el, i) => el.classList.toggle("is-active", i === current));
            if (focus) items[current].focus({ preventScroll: true });
        };

        items.forEach((el, i) => {
            el.addEventListener("mouseenter", () => select(i));
            el.addEventListener("focus", () => select(i));
        });

        document.addEventListener("keydown", (e) => {
            if (!plainKey(e)) return;
            if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
                e.preventDefault();
                select(current + 1, true);
            } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
                e.preventDefault();
                select(current - 1, true);
            } else if (e.key === "Enter" && document.activeElement === document.body) {
                go(items[current]);
            }
        });

        select(0);
    }

    // ---- Inner pages: Esc → home, ←/→ → previous/next page
    const back = document.querySelector(".back");
    const prev = document.querySelector('[data-pager="prev"]');
    const next = document.querySelector('[data-pager="next"]');
    if (back || prev || next) {
        document.addEventListener("keydown", (e) => {
            if (!plainKey(e)) return;
            if (e.key === "Escape") go(back);
            else if (e.key === "ArrowLeft") go(prev);
            else if (e.key === "ArrowRight") go(next);
        });
    }
})();
