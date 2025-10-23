// файл: показать имя + простая валидация формы
(function () {
    const f = document.querySelector('.form');
    if (!f) return;
    const fileInput = f.querySelector('input[type="file"]');
    const fileName = f.querySelector('[data-file-name]');
    f.addEventListener('click', e => {
        if (e.target.matches('[data-file-trigger]')) fileInput.click();
    });
    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files[0]?.name || 'Файл не выбран';
    });
    f.addEventListener('submit', e => {
        e.preventDefault();
        const req = [...f.elements].filter(el => el.required && !el.value);
        const box = f.querySelector('.form__errors');
        if (req.length) { box.textContent = 'Заполните обязательные поля'; return; }
        box.textContent = 'Отправлено (заглушка)';
    });
})();

// select
(function initChoices() {
    if (!window.Choices) {
        console.error('Choices не загрузился');
        return;
    }
    const el = document.getElementById('system');
    if (!el) {
        console.error('select#system не найден');
        return;
    }

    const choices = new Choices(el, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: false,
        placeholder: true,
        classNames: {
            containerOuter: 'choices',
        },
    });

    choices.containerOuter.element.classList.add('form__control');

    // проверка
    el.addEventListener('change', (e) => console.log('selected:', e.target.value));
    console.log('Choices OK');
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