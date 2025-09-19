TRUNCATE TABLE "Internship", "Category" RESTART IDENTITY CASCADE;

-- Заполнение таблицы категорий
INSERT INTO "Category" (name) VALUES
('Backend'),
('Frontend'),
('ML');

-- Заполнение таблицы стажировок
-- Я сопоставил поля из вашего JSON с полями из schema.prisma
-- (href -> companyUrl, logo -> imgUrl, status -> date, alt -> name)
-- Поле 'tags' я оставил пустым, так как в исходных данных их нет.
INSERT INTO "Internship" (name, "companyUrl", "imgUrl", closed, date, "categoryUuid") VALUES
('Яндекс', 'https://yandex.ru/yaintern/internship', '/img/Yandex.png', false, 'Открыта весь год', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Т-банк', 'https://education.tbank.ru/start/', '/img/Tinkoff.svg', false, 'Регистрация до 30 января', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Ozon', 'https://route256.ozon.ru/?rr=1', '/img/Ozon.svg', false, 'Регистрация до 26 января', '9af79f04-3a6e-4441-b251-18689150b23d'),
('АТОН', 'https://career.aton.ru/start/ittp/', '/img/Aton.png', true, 'Закрыта до 1 апреля', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Касперский', 'https://safeboard.kaspersky.ru/', '/img/Kaspersky.png', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Yadro', 'https://careers.yadro.com/internship/', '/img/Yadro.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('МТС', 'https://job.mts.ru/programs/start', '/img/mts.png', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('СКБ Контур', 'https://kontur.ru/education/programs/intern?ysclid=lq4xv82jcd368102253', '/img/kontur.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Альфа Банк', 'https://alfabank.ru/alfastudents/ichoosealfa/#directions', '/img/Alfa.jpg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Авито', 'https://start.avito.ru/tech?ysclid=lq5ad4exyh714880742#popup:reginfo', '/img/avito.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Сбербанк', 'https://sbergraduate.ru/sberseasons-moscow/', '/img/sber.png', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('ВКонтакте', 'https://internship.vk.company/internship/', '/img/vk.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Райффайзенбанк', 'https://career.raiffeisen.ru/start', '/img/Raif.jpg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('ВТБ', 'https://vtbcareer.com/', '/img/vtb.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Мегафон', 'https://job.megafon.ru/vacancy/all', '/img/megafon.svg', true, '', '9af79f04-3a6e-4441-b251-18689150b23d'),
('Лига Цифровой Экономики', 'https://www.digitalleague.ru/traineeships/directions', '/img/Liga.png', true, '', '9af79f04-3a6e-4441-b251-18689150b23d');
