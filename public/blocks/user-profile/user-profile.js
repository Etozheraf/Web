document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".loader");

    const userInfo = document.querySelectorAll(".user-profile__el");
    const userName = userInfo[0];
    const userEmail = userInfo[1];
    const userPhone = userInfo[2];
    const userAddress = userInfo[3];
    const userCompany = userInfo[4];
    const userWebsite = userInfo[5];

    const fetchUserData = async () => {
        try {
            loader.style.display = "flex";

            const randomUserId = Math.floor(Math.random() * 5) + 1;
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${randomUserId}`);
            
            if (!response.ok) {
                toastr.error('Сеть недоступна', 'Ошибка');
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
        userPhone.textContent = `Телефон: ${user.phone}`;
        userAddress.textContent = `Адрес: ${user.address.suite} St. ${user.address.street} City. ${user.address.city}`;
        userCompany.textContent = `Компания: ${user.company.name}`;
        userWebsite.innerHTML = `Сайт: <a href="http://${user.website}" target="_blank">${user.website}</a>`;

        userName.classList.remove('user-profile__el_hidden');
        userEmail.classList.remove('user-profile__el_hidden');
        userPhone.classList.remove('user-profile__el_hidden');
        userAddress.classList.remove('user-profile__el_hidden');
        userCompany.classList.remove('user-profile__el_hidden');
        userWebsite.classList.remove('user-profile__el_hidden');
    };

    fetchUserData();
});
