(function () {
  const startTime = performance.now();

  window.addEventListener('load', function () {
    const endTime = performance.now();
    const loadTime = (endTime - startTime).toFixed(2);
    const loadTimeElement = document.querySelector('.footer__load-time');
    if (loadTimeElement) {
      const clientTimeSpan = document.createElement('span');
      clientTimeSpan.textContent = `Client: ${loadTime}ms`;
      loadTimeElement.appendChild(document.createTextNode(' | ')); // Add a separator
      loadTimeElement.appendChild(clientTimeSpan);
    }
  });
})();