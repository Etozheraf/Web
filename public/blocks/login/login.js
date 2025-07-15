document.querySelector(".login").addEventListener("click", () => {
    Swal.fire({
        title: 'Вход в систему',
        html: `
                <input type="text" id="username" class="swal2-input" placeholder="Логин">
                <input type="password" id="password" class="swal2-input" placeholder="Пароль">
            `,
        confirmButtonText: 'Войти',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
        preConfirm: () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                Swal.showValidationMessage('Пожалуйста, введите логин и пароль');
            }

            return { username, password };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Логин:', result.value.username);
            console.log('Пароль:', result.value.password);

            window.location.href = "user";
        }
    });
}); 