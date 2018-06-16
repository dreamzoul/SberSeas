var dataColors = ['#dc3912', '#ff9900', '#17BAB8', '#109018', '#3926AB', '#958BD0', '#92D08B', '#D08BC7', '#B6B543'];
var maxValue = 25;

var addSector = function (data, startAngle, collapse, cont) {
  var container = $('.' + cont);
  var sectorDeg = 3.6 * data.value;
  var skewDeg = 90 + sectorDeg;
  var rotateDeg = startAngle;
  if (collapse) {
    skewDeg++;
  }
  var sector = $('<div>', {
    'class': 'temp sector'
  }).css({
    'background': data.color,
    'transform': 'rotate(' + rotateDeg + 'deg) skewY(' + skewDeg + 'deg)'
  });
  container.append(sector);
  return startAngle + sectorDeg;
};
var decorate = function () {
  $('.color-0').css('color', '#dc3912');
  $('.color-1').css('color', '#ff9900');
  $('.color-2').css('color', '#17BAB8');
  $('.color-3').css('color', '#109018');
  $('.color-4').css('color', '#3926AB');
  $('.color-5').css('color', '#958BD0');
  $('.color-6').css('color', '#92D08B');
  $('.color-7').css('color', '#D08BC7');
  $('.color-8').css('color', '#B6B543');
};

var onInit = function (filterByArticles, filterByBlocks, filterByTerritories) {
  //Структура расходов по статьям
  $.get('/getArticlesOfRaces', { filterByArticles, filterByBlocks, filterByTerritories }, function (data) {
    var diagramSet = [];
    var index = 0;
    var expensesByArticles = $('.expensesByArticles');
    var filterByArticles = $('#filterByArticles');
    var buff = 0;
    data.forEach(line => {
      filterByArticles.append('<option class="temp">' + line['Статья MIS детально'] + '</option>');
      diagramSet.push({ value: line['Число вхождений'], color: dataColors[index] });
      expensesByArticles.append('<li class="temp color-' + index + '">' + line['Статья MIS детально'] + '</li>');
      index++;
      buff += line['Число вхождений'];
    });

    diagramSet.forEach(element => {
      element.value = (element.value / buff * 100).toFixed(0);
    });
    decorate();

    diagramSet.reduce(function (prev, curr) {
      return (function addPart(data, angle) {
        if (data.value <= maxValue) {
          return addSector(data, angle, false, 'container1');
        }
        return addPart({
          value: data.value - maxValue,
          color: data.color
        }, addSector({
          value: maxValue,
          color: data.color,
        }, angle, true, ));
      })(curr, prev);
    }, 0);
  });
  //Распределение расходов по бизнес-блокам
  $.get('/getBusinessBlocks', { filterByArticles, filterByBlocks, filterByTerritories }, function (data) {
    var diagramSet = [];
    var index = 0;
    var buff = 0;
    var expensesBlocks = $('.expensesBlocks');
    var filterByBlocks = $('#filterByBlocks');
    data.forEach(line => {
      filterByBlocks.append('<option class="temp">' + line['Бизнес блок'] + '</option>');
      diagramSet.push({ value: line['Число вхождений'], color: dataColors[index] });
      expensesBlocks.append('<li class="temp color-' + index + '">' + line['Бизнес блок'] + '</li>');
      index++;
      buff += line['Число вхождений'];
    });
    diagramSet.forEach(element => {
      element.value = (element.value / buff * 100).toFixed(0);
    });
    decorate();
    diagramSet.reduce(function (prev, curr) {
      return (function addPart(data, angle) {
        if (data.value <= maxValue) {
          return addSector(data, angle, false, 'container2');
        }
        return addPart({
          value: data.value - maxValue,
          color: data.color
        }, addSector({
          value: maxValue,
          color: data.color,
        }, angle, true, ));
      })(curr, prev);
    }, 0);
  });
  //Структура расходов по территориям
  $.get('/getTerritories', { filterByArticles, filterByBlocks, filterByTerritories }, function (data) {
    var expensesByTerritories = $('.expensesByTerritories');
    var filterByTerritories = $('#filterByTerritories');
    data.forEach(line => {
      expensesByTerritories.append('<tr class="temp">' +
        '<td>' + line['Территориальный банк'] + '</td>' +
        '<td>' + (line['Факт'] / 1000000).toFixed(2) + '</td>' +
        '<td>' + (line['План'] / 1000000).toFixed(2) + '</td>' +
        '<td>' + (line['Выполнение'] * 100).toFixed(0) + ' %' + '</td> </tr>');
      filterByTerritories.append('<option class="temp">' + line['Территориальный банк'] + '</option>');
    });
  });
  //Динамика расходов по месяцам
  $.get('/getMonths', { filterByArticles, filterByBlocks, filterByTerritories }, function (data) {
    var expensesByMonths = $('.expensesByMonths');
    data.forEach(line => {
      expensesByMonths.append('<tr class="temp">' +
        '<td>' + line['Месяц'] + '</td>' +
        '<td>' + (line['Выполнение'] / 1000000).toFixed(2) + '</td> </tr>');
    });
  });
};

onInit(document.getElementById('filterByArticles').value,
  document.getElementById('filterByBlocks').value,
  document.getElementById('filterByTerritories').value);

var filtred = function () {
  var filter1 = document.getElementById('filterByArticles').value;
  var filter2 = document.getElementById('filterByBlocks').value;
  var filter3 = document.getElementById('filterByTerritories').value;
  $('.temp').remove();
  onInit(filter1, filter2, filter3);
};