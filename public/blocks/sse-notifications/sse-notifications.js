document.addEventListener('DOMContentLoaded', function() {
    if (typeof toastr === 'undefined') {
        console.error('Toastr not loaded!');
        return;
    }
        
    const eventSource = new EventSource('/internship/sse');

    eventSource.addEventListener('created', (event) => {
        const data = JSON.parse(event.data);
        toastr.success(`Стажировка создана: ${data.name}`);
    })  ;
    eventSource.addEventListener('updated', (event) => {
        const data = JSON.parse(event.data);
        toastr.info(`Обновлена стажировка: ${data.name}`);
    });
    eventSource.addEventListener('deleted', (event) => {
        const data = JSON.parse(event.data);
        toastr.warning(`Стажировка удалена: ${data.name}`);
    });


    eventSource.onerror = function (err) {
        console.error('SSE error:', err);
        eventSource.close();
    };
    
}); 