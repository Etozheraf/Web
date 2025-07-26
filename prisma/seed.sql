TRUNCATE TABLE "Internship", "Category" RESTART IDENTITY CASCADE;

-- Заполнение таблицы категорий
INSERT INTO "Category" (id, name) VALUES
(1, 'Backend'),
(2, 'Frontend'),
(3, 'ML');

-- Заполнение таблицы стажировок
-- Я сопоставил поля из вашего JSON с полями из schema.prisma
-- (href -> companyUrl, logo -> imgUrl, status -> date, alt -> name)
-- Поле 'tags' я оставил пустым, так как в исходных данных их нет.
INSERT INTO "Internship" (name, "companyUrl", "imgUrl", closed, date, "categoryId") VALUES
('Яндекс', 'https://yandex.ru/yaintern/internship', '/img/Yandex.png', false, 'Открыта весь год', 1),
('Т-банк', 'https://education.tbank.ru/start/', '/img/Tinkoff.svg', false, 'Регистрация до 30 января', 1),
('Ozon', 'https://route256.ozon.ru/?rr=1', '/img/Ozon.svg', false, 'Регистрация до 26 января', 1),
('АТОН', 'https://career.aton.ru/start/ittp/', '/img/Aton.png', true, 'Закрыта до 1 апреля', 1),
('Касперский', 'https://safeboard.kaspersky.ru/', '/img/Kaspersky.png', true, '', 1),
('Yadro', 'https://careers.yadro.com/internship/', '/img/Yadro.svg', true, '', 1),
('МТС', 'https://job.mts.ru/programs/start', '/img/mts.png', true, '', 1),
('СКБ Контур', 'https://kontur.ru/education/programs/intern?ysclid=lq4xv82jcd368102253', '/img/kontur.svg', true, '', 1),
('Альфа Банк', 'https://alfabank.ru/alfastudents/ichoosealfa/#directions', '/img/Alfa.jpg', true, '', 1),
('Авито', 'https://start.avito.ru/tech?ysclid=lq5ad4exyh714880742#popup:reginfo', '/img/avito.svg', true, '', 1),
('Сбербанк', 'https://sbergraduate.ru/sberseasons-moscow/', '/img/sber.png', true, '', 1),
('ВКонтакте', 'https://internship.vk.company/internship/', '/img/vk.svg', true, '', 1),
('Райффайзенбанк', 'https://career.raiffeisen.ru/start', '/img/Raif.jpg', true, '', 1),
('ВТБ', 'https://vtbcareer.com/', '/img/vtb.svg', true, '', 1),
('Мегафон', 'https://job.megafon.ru/vacancy/all', '/img/megafon.svg', true, '', 1),
('Лига Цифровой Экономики', 'https://www.digitalleague.ru/traineeships/directions', '/img/Liga.png', true, '', 1);
