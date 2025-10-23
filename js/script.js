// валидация формы
(function () {
    const f = document.querySelector('.form');
    if (!f) return;

    const fileInput = f.querySelector('input[type="file"]');
    const fileName = f.querySelector('[data-file-name]');
    const btn = f.querySelector('.form__select__button');
    const selectRoot = document.getElementById('systemSelect');
    const selectHidden = f.querySelector('input[type="hidden"][name="system_type"]');

    // показать имя файла
    f.addEventListener('click', e => {
        if (e.target.matches('[data-file-trigger]')) fileInput?.click();
    });
    fileInput?.addEventListener('change', () => {
        fileName.textContent = fileInput.files[0]?.name || 'Файл не выбран';
    });

    // helper: корректно находим "обязательные" пустые инпуты
    function isEmpty(el){
        if (el.disabled) return false;
        if (!el.required) return false;

        const type = (el.type || '').toLowerCase();
        if (type === 'checkbox' || type === 'radio') return !el.checked;
        if (el.tagName === 'SELECT') return !el.value;
        if (type === 'file') return !(el.files && el.files.length);
        return !el.value; // text, email, hidden и т.п.
    }

    f.addEventListener('submit', e => {
        e.preventDefault();

        const box = f.querySelector('.form__errors');
        box.textContent = '';

        const req = [...f.elements].filter(isEmpty);

        let selectError = false;
        if (selectRoot && selectHidden && !selectHidden.value){
            selectError = true;
            btn.classList.add('is-invalid');
        }

        if (req.length || selectError){
            box.textContent = 'Заполните обязательные поля';
            return;
        }

        box.textContent = 'Отправлено (заглушка)';
    });
})();


// range
(function () {
    const form = document.getElementById('order');
    const range = form.querySelector('.form__range');
    const valueEl = form.querySelector('[data-progress-value]');

    function paintRange(val) {
        // проценты
        valueEl.textContent = val;

        const min = +range.min || 0;
        const max = +range.max || 100;
        const pct = ((val - min) * 100) / (max - min);

        range.style.background =
            `linear-gradient(to right, FFFFFFB2 0%, FFFFFFB2 ${pct}%, #2b3342 ${pct}%, #2b3342 100%)`;
    }

    paintRange(range.value);

    range.addEventListener('input', (e) => {
        paintRange(e.target.value);
    });

    form.addEventListener('submit', (e) => {
        // e.preventDefault();
        // console.log('progress =', range.value);
    });
})();

// Burger
(function () {
    const burger = document.querySelector('.header__burger');
    const nav = document.getElementById('header-menu');

    if (!burger || !nav) return;

    const close = () => {
        burger.classList.remove('header__burger--active');
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('header__nav--open');
        nav.hidden = true;
        document.body.classList.remove('is-locked');
        burger.setAttribute('aria-label', 'Открыть меню');
    };

    const open = () => {
        burger.classList.add('header__burger--active');
        burger.setAttribute('aria-expanded', 'true');
        nav.hidden = false;
        nav.classList.add('header__nav--open');
        document.body.classList.add('is-locked');
        burger.setAttribute('aria-label', 'Закрыть меню');
    };

    burger.addEventListener('click', () => {
        const isOpen = burger.classList.contains('header__burger--active');
        isOpen ? close() : open();
    });

    nav.addEventListener('click', (e) => {
        if (e.target.closest('.header__link')) close();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    const mql = window.matchMedia('(min-width: 840px)');
    mql.addEventListener('change', (e) => {
        if (e.matches) {
            close();
            nav.hidden = false;
        } else {
            nav.hidden = true;
        }
    });
})();

// custom select
// custom-select.js
window.addEventListener('DOMContentLoaded', () => {
// ======= Custom select (vanilla, без ::-webkit-scrollbar) =======
    (function () {
        const root = document.getElementById('systemSelect');
        if (!root) return; // нет узла — тихо выходим

        const options = [
            "Sed ut perspiciatis", "Nemo enim ipsam", "Et harum quidem", "Temporibus autem",
            "Itaque earum rerum", "Quis autem vel eum", "Neque porro quisquam",
            "Duis aute irure dolor", "Excepteur sint occaecat", "Quo minus id quod maxime",
            "Placeat facere possimus", "Ut aut reiciendis voluptatibus", "Maiores alias consequatur"
        ];

        const btn = root.querySelector('.form__select__button');
        const valueEl = root.querySelector('.form__select__value');
        const list = root.querySelector('.form__select__list');
        const hidden = root.querySelector('input[type="hidden"]');
        const sb = root.querySelector('.sb');
        const track = root.querySelector('.sb__track');
        const thumb = root.querySelector('.sb__thumb');

        if (!btn || !valueEl || !list || !hidden || !sb || !track || !thumb) return;

        const isOpen = () => root.getAttribute('aria-expanded') === 'true';
        const open = () => {
            if (isOpen()) return;
            root.setAttribute('aria-expanded', 'true');
            // фокус в список — только при открытии через кнопку/клавиатуру
            list.focus({preventScroll: true});
            updateScrollbar();
        };
        const close = (restoreFocus = true) => {
            if (!isOpen()) return;
            root.setAttribute('aria-expanded', 'false');
            // Важно: не возвращаем фокус на кнопку при клике вне компонента,
            // чтобы не красть фокус у других полей
            if (restoreFocus) btn.focus({preventScroll: true});
        };
        const toggle = () => isOpen() ? close(true) : open();

        // Рендер опций
        let currentIndex = -1;
        list.innerHTML = '';
        options.forEach((label, i) => {
            const li = document.createElement('li');
            li.className = 'form__select__option';
            li.role = 'option';
            li.dataset.value = label;
            li.textContent = label;
            li.addEventListener('mouseenter', () => mark(i));
            li.addEventListener('click', () => choose(i));
            list.appendChild(li);
        });

        function mark(i) {
            if (currentIndex === i) return;
            const prev = list.children[currentIndex];
            if (prev) prev.removeAttribute('aria-current');
            currentIndex = i;
            const cur = list.children[currentIndex];
            if (cur) {
                cur.setAttribute('aria-current', 'true');
                const top = cur.offsetTop, bottom = top + cur.offsetHeight;
                if (top < list.scrollTop) list.scrollTop = top;
                if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
                syncThumb();
            }
        }

        function choose(i) {
            const el = list.children[i];
            if (!el) return;
            list.querySelectorAll('.form__select__option[aria-selected="true"]').forEach(n => n.removeAttribute('aria-selected'));
            el.setAttribute('aria-selected', 'true');
            valueEl.textContent = el.dataset.value;
            hidden.value = el.dataset.value;
            close(true); // тут нормально вернуть фокус на кнопку
        }

        // События открытия/закрытия
        btn.addEventListener('click', toggle);

        // Клик ВНЕ: закрываем без восстановления фокуса (не крадём фокус у других инпутов)
        document.addEventListener('click', (e) => {
            if (isOpen() && !root.contains(e.target)) close(false);
        });

        // Клавиатура внутри списка
        list.addEventListener('keydown', (e) => {
            const max = list.children.length - 1;
            if (e.key === 'Escape') {
                e.preventDefault();
                close(true);
                return;
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                choose(currentIndex >= 0 ? currentIndex : 0);
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                mark(Math.min(max, currentIndex + 1));
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                mark(Math.max(0, currentIndex - 1));
                return;
            }
            if (e.key === 'Home') {
                e.preventDefault();
                mark(0);
                return;
            }
            if (e.key === 'End') {
                e.preventDefault();
                mark(max);
                return;
            }
            if (e.key === 'Tab') { // уходим по табу — не возвращаем фокус на кнопку
                close(false);
            }
        });

        // ======= Кастомный скроллбар =======
        let drag = {active: false, startY: 0, startTop: 0};

        function updateScrollbar() {
            const overflows = list.scrollHeight > list.clientHeight + 1;
            sb.classList.toggle('sb--hidden', !overflows);
            if (!overflows) return;
            const ratio = list.clientHeight / list.scrollHeight;
            const thumbSize = Math.max(28, Math.round(track.clientHeight * ratio));
            thumb.style.height = thumbSize + 'px';
            syncThumb();
        }

        function syncThumb() {
            if (sb.classList.contains('sb--hidden')) return;
            const maxScroll = list.scrollHeight - list.clientHeight;
            const maxThumb = track.clientHeight - thumb.clientHeight;
            const top = maxScroll ? (list.scrollTop / maxScroll) * maxThumb : 0;
            thumb.style.transform = `translateY(${top}px)`;
        }

        list.addEventListener('scroll', syncThumb);
        new ResizeObserver(updateScrollbar).observe(list);
        new ResizeObserver(updateScrollbar).observe(track);

        thumb.addEventListener('pointerdown', (e) => {
            drag.active = true;
            drag.startY = e.clientY;
            drag.startTop = parseFloat(thumb.style.transform.replace(/[^\d.-]/g, '')) || 0;
            thumb.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        thumb.addEventListener('pointermove', (e) => {
            if (!drag.active) return;
            const dy = e.clientY - drag.startY;
            const maxThumb = track.clientHeight - thumb.clientHeight;
            const newTop = Math.max(0, Math.min(maxThumb, drag.startTop + dy));
            const maxScroll = list.scrollHeight - list.clientHeight;
            list.scrollTop = (newTop / maxThumb) * maxScroll;
            syncThumb();
        });
        thumb.addEventListener('pointerup', () => drag.active = false);

        track.addEventListener('pointerdown', (e) => {
            if (e.target === thumb) return;
            const rect = track.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const thumbHalf = thumb.clientHeight / 2;
            const maxThumb = rect.height - thumb.clientHeight;
            const newTop = Math.max(0, Math.min(maxThumb, clickY - thumbHalf));
            const maxScroll = list.scrollHeight - list.clientHeight;
            list.scrollTop = (newTop / maxThumb) * maxScroll;
            syncThumb();
        });

        // стартовые состояния
        mark(0);

        // Кнопка лога
        const logBtn = document.getElementById('logValueBtn');
        if (logBtn) {
            logBtn.addEventListener('click', () => {
                console.log('system_type =', hidden.value);
            });
        }


    })();
});
