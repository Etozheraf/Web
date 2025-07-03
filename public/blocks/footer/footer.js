(function() {
    let startTime = performance.now();

    window.addEventListener('load', function() {
        let endTime = performance.now();
        let loadTime = (endTime - startTime).toFixed(2);
        let footer = document.querySelector('.footer');
        footer.insertAdjacentHTML('beforeend', `<div class="footer__load-time">Время загрузки страницы: ${loadTime} мс</div>`);
    });
})();