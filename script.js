// тень для sticky-header
(function () {
    const h = document.querySelector('[data-sticky]');
    if (!h) return;
    const on = () => h.classList.toggle('header--shadow', window.scrollY > 8);
    on(); addEventListener('scroll', on, { passive: true });
})();

// файл: показать имя + простая валидация формы
(function () {
    const f = document.querySelector('.form'); if (!f) return;
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
        box.textContent = 'Отправлено (заглушка)'; // здесь можно подключить fetch
    });
})();
