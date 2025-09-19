document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.internship-category-list__item');
    const currentPage = document.location.pathname.split('/').pop() || 'index.html';
    menuItems.forEach(item => {
        const link = item.getAttribute('href');
        if (link === currentPage) {
            item.classList.add('internship-category-list__item_active');
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            if (item.classList.contains('internship-category-list__item_active'))
                return
            item.classList.add('internship-category-list__item_active');
        });
        if (item.classList.contains('internship-category-list__item_active'))
            return
        item.addEventListener('mouseout', () => {
            item.classList.remove('internship-category-list__item_active');
        });
    });
});