document.querySelector('.login').addEventListener('click', () => {
  const showLogin = () => {
    Swal.fire({
      title: 'Вход в систему',
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Почта" required>
        <input type="password" id="password" class="swal2-input" placeholder="Пароль" required>
        <a href="#" id="show-register" style="display: block; margin-top: 10px;">У меня еще нет аккаунта</a>
      `,
      confirmButtonText: 'Войти',
      showCancelButton: true,
      cancelButtonText: 'Отмена',
      didOpen: () => {
        document.getElementById('show-register').addEventListener('click', (e) => {
          e.preventDefault();
          showRegister();
        });
      },
      preConfirm: () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
          Swal.showValidationMessage('Пожалуйста, введите почту и пароль');
          return false;
        }

        return fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Ошибка входа');
            }

            if (response.redirected) {
              window.location.href = response.url;
              return;
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Ошибка: ${error.message}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        window.location.href = '/user';
      }
    });
  };

  const showRegister = () => {
    Swal.fire({
      title: 'Регистрация',
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Имя" required>
        <input type="email" id="email" class="swal2-input" placeholder="Почта" required>
        <input type="password" id="password" class="swal2-input" placeholder="Пароль" required>
        <input type="password" id="confirm-password" class="swal2-input" placeholder="Подтвердите пароль" required>
        <a href="#" id="show-login" style="display: block; margin-top: 10px;">Уже есть аккаунт? Войти</a>
      `,
      confirmButtonText: 'Зарегистрироваться',
      showCancelButton: true,
      cancelButtonText: 'Отмена',
      didOpen: () => {
        document.getElementById('show-login').addEventListener('click', (e) => {
          e.preventDefault();
          showLogin();
        });
      },
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!name || !email || !password || !confirmPassword) {
          Swal.showValidationMessage('Пожалуйста, заполните все поля');
          return false;
        }

        if (password !== confirmPassword) {
          Swal.showValidationMessage('Пароли не совпадают');
          return false;
        }

        return fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Ошибка регистрации');
            }
            if (response.redirected) {
              window.location.href = response.url;
              return;
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`Ошибка: ${error.message}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        window.location.href = '/user';
      }
    });
  };

  showLogin();
}); 