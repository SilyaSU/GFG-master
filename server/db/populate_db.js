const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'library_forum.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
        process.exit(1);
    }
    console.log('Подключение к базе данных SQLite успешно.');
});

db.serialize(() => {
    // Добавление авторов
    db.run(`
        INSERT INTO authors (name) VALUES
        ('Дж. Р. Р. Толкин'),
        ('Джордж Оруэлл'),
        ('Михаил Булгаков')
    `, (err) => {
        if (err) console.error('Ошибка добавления авторов:', err.message);
        else console.log('Авторы добавлены.');
    });

    // Добавление жанров
    db.run(`
        INSERT INTO genres (name) VALUES
        ('Фэнтези'),
        ('Антиутопия'),
        ('Классика')
    `, (err) => {
        if (err) console.error('Ошибка добавления жанров:', err.message);
        else console.log('Жанры добавлены.');
    });

    // Добавление книг
    db.run(`
        INSERT INTO books (title, author_id, genre_id) VALUES
        ('Властелин колец', 1, 1),
        ('1984', 2, 2),
        ('Мастер и Маргарита', 3, 3)
    `, (err) => {
        if (err) console.error('Ошибка добавления книг:', err.message);
        else console.log('Книги добавлены.');
    });
});

db.close((err) => {
    if (err) console.error('Ошибка закрытия базы данных:', err.message);
    else console.log('Подключение к базе данных закрыто.');
});
