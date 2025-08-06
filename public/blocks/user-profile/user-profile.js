document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".loader");

    const userInfo = document.querySelectorAll(".user-profile__el");
    const userName = userInfo[0];
    const userEmail = userInfo[1];

    const fetchUserData = async () => {
        try {
            loader.style.display = "flex";

            const response = await fetch(`/user/api`);

            if (!response.ok) {
                toastr.error('Не удалось загрузить данные пользователя', 'Ошибка');
                throw new Error("Сеть недоступна");
            }

            const user = await response.json();
            renderUserData(user);
        } catch {
            toastr.error('⚠ Что-то пошло не так', 'Ошибка');
        } finally {
            loader.remove()
            // loader.style.display = "none";
        }
    };

    const renderUserData = (user) => {
        userName.textContent = `Имя: ${user.name}`;
        userEmail.textContent = `Почта: ${user.email}`;
        userName.classList.remove('user-profile__el_hidden');
        userEmail.classList.remove('user-profile__el_hidden');
    };

    fetchUserData();
});
