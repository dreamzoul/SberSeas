var Sequelize = require("sequelize");
var express = require('express'),
    app = express(),
    server;

const sequelize = new Sequelize("testSS", "sa", "12345678", {
    host: 'localhost',
    dialect: 'mssql'
});

const localSS = sequelize.define("SberSeas", {
    Месяц: Sequelize.DATE,
    '[Территориальный банк]': Sequelize.STRING,
    '[Бизнес блок]': Sequelize.STRING,
    '[Блок получатель расходов]': Sequelize.STRING,
    '[Блок Собственник расходов]': Sequelize.STRING,
    '[Статья MIS 02]': Sequelize.STRING,
    '[Статья MIS детально]': Sequelize.STRING,
    Факт: Sequelize.FLOAT,
    План: Sequelize.FLOAT,
}, { timestamps: false });
localSS.removeAttribute('id');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/gui.js', function (req, res) {
    res.sendFile(__dirname + '/gui.js');
});
//Структура расходов по статьям
app.get('/getArticlesOfRaces', function (req, res) {
    var filter = '';
    if (req.query.filterByArticles != '---'
        || req.query.filterByBlocks != '---'
        || req.query.filterByTerritories != '---') {
        filter += 'where ';
    }
    if (req.query.filterByArticles != '---') {
        filter += ' [Статья MIS детально] like ' + '\'' + req.query.filterByArticles + '\'';
    }
    if (req.query.filterByBlocks != '---' && filter.length > 10) {
        filter += ' and [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    else if (req.query.filterByBlocks != '---' && filter.length < 10) {
        filter += ' [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    if (req.query.filterByTerritories != '---' && filter.length > 10) {
        filter += ' and [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }
    else if (req.query.filterByTerritories != '---' && filter.length < 10) {
        filter += ' [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }

    sequelize.query('select [Статья MIS детально], ' +
        'count (*) as [Число вхождений] ' +
        'from SberSeas ' + filter +
        ' group by [Статья MIS детально]').spread((results) => {
            res.send(results);
        });
});
//Распределение расходов по бизнес-блокам
app.get('/getBusinessBlocks', function (req, res) {
    var filter = '';
    if (req.query.filterByArticles != '---'
        || req.query.filterByBlocks != '---'
        || req.query.filterByTerritories != '---') {
        filter += 'where ';
    }
    if (req.query.filterByArticles != '---') {
        filter += ' [Статья MIS детально] like ' + '\'' + req.query.filterByArticles + '\'';
    }
    if (req.query.filterByBlocks != '---' && filter.length > 10) {
        filter += ' and [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    else if (req.query.filterByBlocks != '---' && filter.length < 10) {
        filter += ' [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    if (req.query.filterByTerritories != '---' && filter.length > 10) {
        filter += ' and [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }
    else if (req.query.filterByTerritories != '---' && filter.length < 10) {
        filter += ' [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }

    sequelize.query('select [Бизнес блок], ' +
        'count (*) as [Число вхождений] ' +
        'from SberSeas ' + filter +
        ' group by [Бизнес блок]').spread((results) => {
            res.send(results);
        });
});
//Структура расходов по территориям
app.get('/getTerritories', function (req, res) {
    var filter = '';
    if (req.query.filterByArticles != '---'
        || req.query.filterByBlocks != '---'
        || req.query.filterByTerritories != '---') {
        filter += 'where ';
    }
    if (req.query.filterByArticles != '---') {
        filter += ' [Статья MIS детально] like ' + '\'' + req.query.filterByArticles + '\'';
    }
    if (req.query.filterByBlocks != '---' && filter.length > 10) {
        filter += ' and [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    else if (req.query.filterByBlocks != '---' && filter.length < 10) {
        filter += ' [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    if (req.query.filterByTerritories != '---' && filter.length > 10) {
        filter += ' and [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }
    else if (req.query.filterByTerritories != '---' && filter.length < 10) {
        filter += ' [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }

    sequelize.query('select [Территориальный банк], ' +
        'cast(sum([Факт]) as money) as [Факт], ' +
        'cast(sum([План]) as money) as [План], ' +
        'cast(sum([Факт]) / sum([План]) as decimal(3, 2)) as [Выполнение] ' +
        'from SberSeas ' + filter +
        ' group by [Территориальный банк]').spread((results) => {
            res.send(results);
        });
});
//Динамика расходов по месяцам
app.get('/getMonths', function (req, res) {
    var filter = '';
    if (req.query.filterByArticles != '---'
        || req.query.filterByBlocks != '---'
        || req.query.filterByTerritories != '---') {
        filter += 'where ';
    }
    if (req.query.filterByArticles != '---') {
        filter += ' [Статья MIS детально] like ' + '\'' + req.query.filterByArticles + '\'';
    }
    if (req.query.filterByBlocks != '---' && filter.length > 10) {
        filter += ' and [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    else if (req.query.filterByBlocks != '---' && filter.length < 10) {
        filter += ' [Бизнес блок] like ' + '\'' + req.query.filterByBlocks + '\'';
    }
    if (req.query.filterByTerritories != '---' && filter.length > 10) {
        filter += ' and [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }
    else if (req.query.filterByTerritories != '---' && filter.length < 10) {

        filter += ' [Территориальный банк] like ' + '\'' + req.query.filterByTerritories + '\'';
    }

    sequelize.query('select cast ([Месяц] as date) as [Месяц], ' +
        'cast (sum ([Факт]) as money) as [Выполнение] ' +
        'from SberSeas ' + filter +
        ' group by [Месяц]').spread((results) => {
            res.send(results);
        });
});

server = app.listen(3000, function () {
    console.log('Server started on port 3000');
});
