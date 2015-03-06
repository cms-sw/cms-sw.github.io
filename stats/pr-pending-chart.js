var ONE_HOUR_IN_SECONDS = 60 * 60;
var ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

var chart;
var allowedToChangeCategory = true;
var defaultChartAllCategories = true;
var csvData = [];
var categories = {
  0: "alca",
  1: "analysis",
  2: "db",
  3: "daq",
  4: "docs",
  5: "dqm",
  6: "core",
  7: "fastsim",
  8: "generators",
  9: "geometry",
  10: "l1",
  11: "operations",
  12: "pdmv",
  13: "reconstruction",
  14: "simulations",
  15: "tests",
  16: "visualization"
};
var numberOfCategories = Object.keys(categories).length;

var categoriesIds = {};
for (var i = 0; i < numberOfCategories; i++) {
  categoriesIds[categories[i]] = i;
}

var chartData = [];
chartData['category'] = [];
for (var i = 0; i < numberOfCategories; i++) {
  chartData[categories[i]] = [];
}

var statistics = {};
var idList = {};
var info = [];
for (var i = 0; i < numberOfCategories; i++) {
  statistics[categories[i]] = {}
  statistics[categories[i]]["0 to 7 days"] = 0;
  statistics[categories[i]]["7 to 30 days"] = 0;
  statistics[categories[i]]["30 + days"] = 0;
  idList[categories[i]] = {};
  idList[categories[i]]["0 to 7 days"] = [];
  idList[categories[i]]["7 to 30 days"] = [];
  idList[categories[i]]["30 + days"] = [];
  info[categories[i]] = {};
  info[categories[i]]["totalPR"] = 0;
}

var currentTimeInSeconds = Date.now() / 1000;
var safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
var safariIniFirstPop = 0;


AmCharts.ready(function () {
  var rows = loadCSV("../data/stats/pr-stats.csv");
  parseCSV(rows);
  getMainChartData();

  chart = new AmCharts.AmPieChart();
  chart.dataProvider = chartData['category'];
  chart.titleField = "period";
  chart.valueField = "value";
  chart.outlineColor = "#FFFFFF";
  chart.outlineAlpha = 0.8;
  chart.outlineThickness = 3;
  chart.balloonText = "";
  chart.labelText = "[[title]]: [[value]] PRs";
  chart.depth3D = 15;
  chart.angle = 30;
  chart.addTitle("");
  chart.write("chartdiv");

  chart.addListener("clickSlice", function (event) {
    if (allowedToChangeCategory) {
      var catId = event.dataItem.title;
      changeChartCategory(categoriesIds[catId]);
      writeTable(catId);
      allowedToChangeCategory = false;
    }
    chart.validateData();
  });

  chart.addListener("rollOverSlice", function (event) {
    if (defaultChartAllCategories) {
      $('#chartdiv > div:first-child').css('cursor', 'pointer');
    }
  });

  chart.addListener("rollOutSlice", function (event) {
    if (defaultChartAllCategories) {
      $('#chartdiv > div:first-child').css('cursor', 'default');
    }
  });

  // reload on "back" button is pressed
  window.addEventListener('popstate', function () {
    safariIniFirstPop++; // safari initialize popstate on load, so we need to ignore it
    if ((safari) && (safariIniFirstPop > 1)) {
      location.href = location.pathname;
      window.location = location.pathname;
    } else if (!safari) {
      window.location.href = location.pathname;
      window.location = location.pathname;
    }
  }, false);

  var catFromUrl = getUrlParameter('category');
  if (!isNaN(categoriesIds[catFromUrl])) {
    initChart();
    allowedToChangeCategory = false;
    defaultChartAllCategories = false;
    changeChartCategory(categoriesIds[catFromUrl]);
    writeTable(catFromUrl);
  } else if ((typeof(catFromUrl) != "undefined") && (catFromUrl.length > 0)) {
    wrongCategory();
  } else {
    initChart();
  }
});

function loadCSV(file) {
  if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari
    var request = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    var request = new ActiveXObject('Microsoft.XMLHTTP');
  }
  request.open('GET', file, false);
  request.send();

  var data = request.responseText;
  //replace UNIX new lines
  data = data.replace(/\r\n/g, "\n");
  //replace MAC new lines
  data = data.replace(/\r/g, "\n");
  //split into rows
  return data.split("\n");

}

function parseCSV(rows) {

  for (var i = 1; i < rows.length; i++) {
    if (rows[i]) {
      var column = rows[i].split(",");

      tableData(column);

      for (var o = 0; o < numberOfCategories; o++) {
        proceedCategoryData(column, o);
      }
    }
  }
  sortByCreationTime(csvData); // sorting main table

  // proceeding data for each sub-chart
  for (var counter = 0; counter < numberOfCategories; counter++) {
    var tempArray = [];
    jQuery.each(statistics[categories[counter]], function (i, val) {
      var dataObject = {
        period: i,
        value: val
      };
      chartData[categories[counter]].push(dataObject);
    });
  }
}

function writeTable(sliceName) {
    $("#myTable1").bootstrapTable();
    $("#myTable2").bootstrapTable();
  jQuery.each(idList[sliceName], function (period) {

    jQuery.each(idList[sliceName][period], function (i, PRid) {
      var timePassed = idList[sliceName][period][i].timePassed;
      var days = Math.floor(timePassed / ONE_DAY_IN_SECONDS);
      var timePassedString = secondsToDateString(idList[sliceName][period][i].timePassed);

      if (days < 7) {
        var rowColor = "success";
      } else if (days < 30) {
        var rowColor = "warning";
      } else if (days >= 30) {
        var rowColor = "danger";
      }

      PRid = idList[sliceName][period][i].id;
      var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + PRid + "' target='_blank'>" + PRid;
      var row = [];
      row.push({
        classes: rowColor,
        pr: PRidWithLink,
        category: period,
        daysOpened: timePassedString
      });

      $('#myTable1').bootstrapTable('append', row);
    });
  });
  $("#table2").hide();
  $("#table1").show();
}

function tableData(column) {
  var creationTime = column[0];
  var id = column[2];
  var isPr = column[3];
  var closed = column[5];
  var labelStatus = column[8];

  var hasPendingStatus = false;

  if (labelStatus.indexOf("P") > -1) { //if string consists of "P" status
    hasPendingStatus = true;
  }

  if ((isPr == "1") && (closed == "0") && (hasPendingStatus)) {
    csvData.push({"Creation": parseInt(creationTime), id: id, "labelStatus": column[8]});
  }
}
function proceedCategoryData(column, categoryNumber) {
  var creationTime = column[0];
  var mergeTime = column[1];
  var id = column[2];
  var isPr = column[3];
  var closed = column[5];
  var labelStatus = column[8];

  var categoryName = categories[categoryNumber];
  var pullRequestAlreadyOpenedForSeconds = currentTimeInSeconds - creationTime;
  var tempObject = {"id": id, "timePassed": pullRequestAlreadyOpenedForSeconds, "labelStatus": labelStatus};
  if ((isPr == "1") && (closed == "0") && ((labelStatus[categoryNumber] == "P"))) {
    if (pullRequestAlreadyOpenedForSeconds <= ONE_DAY_IN_SECONDS * 7) {
      statistics[categoryName]["0 to 7 days"]++;
      idList[categoryName]["0 to 7 days"].push(tempObject);
    } else if (pullRequestAlreadyOpenedForSeconds <= ONE_DAY_IN_SECONDS * 30) {
      statistics[categoryName]["7 to 30 days"]++;
      idList[categoryName]["7 to 30 days"].push(tempObject);
    } else {
      statistics[categoryName]["30 + days"]++;
      idList[categoryName]["30 + days"].push(tempObject);
    }
    info[categoryName]["totalPR"] += 1;
  }
}

function changeChartCategory(id) {
  defaultChartAllCategories = false;
  $('#chartdiv > div:first-child').css('cursor', 'default');
  chart.dataProvider = chartData[categories[id]];
  chart.titles[0].text = "Category: " + categories[id] + ". Not closed/merged pull requests (" + info[categories[id]]["totalPR"] + ")";
  chart.validateData();
  window.history.pushState({category: categories[id]}, "Title", "?category=" + categories[id]);
  setInsideChartSliceColors();
}

function initChart() {
  allowedToChangeCategory = true;
  $("#table1").hide();
  chart.dataProvider = chartData['category'];
  var tempTotal = 0;

  for (var i = 0; i < numberOfCategories; i++) {
    tempTotal += info[categories[i]]['totalPR'];
  }

  chart.titles[0].text = "Pending pull requests by categories. Total PRs: " + csvData.length;
  chart.validateData();

  for (var i = 0; i < csvData.length; i++) {
    var timePassedInSeconds = currentTimeInSeconds - csvData[i].Creation;
    var days = Math.floor(timePassedInSeconds / ONE_DAY_IN_SECONDS);
    var timePassedString = secondsToDateString(timePassedInSeconds);

    if (days < 7) {
      var rowColor = "success";
    } else if (days < 30) {
      var rowColor = "warning";
    } else if (days >= 30) {
      var rowColor = "danger";
    }

    var categoriesPending = "";
    for (o = 0; o < numberOfCategories; o++) {
      if (csvData[i].labelStatus[o] == "P") {
        categoriesPending += categories[o] + " ";
      }
    }

    var row = [];
    var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + csvData[i].id + "' target='_blank'>" + csvData[i].id;
    row.push({
      classes: rowColor,
      pr: PRidWithLink,
      category: categoriesPending,
      daysOpened: timePassedString
    });

    $('#myTable2').bootstrapTable('append', row);

  }
}

function getMainChartData() {
  for (i = 0; i < numberOfCategories; i++) {

    var dataObject = {
      period: categories[i],
      value: info[categories[i]]["totalPR"]
    };
    chartData['category'].push(dataObject);
  }
}

function setInsideChartSliceColors() {
  chart.dataProvider[0].color = "#228B22";
  chart.dataProvider[1].color = "#FFD700";
  chart.dataProvider[2].color = "#FF0000";
  chart.colorField = "color";
  chart.validateData();
}

function rowStyle(row) {
  // using to change row color
  return {
    classes: row['classes']
  };
}

function wrongCategory() {
    $("#chartdiv").empty();
    $("#table1").remove();
    $("#table2").remove();
    $("#wrongUrl").show();
}

function customDaysSorter(a, b) {
  var aDate = a.match(/\S+/g); // matching by spaces
  var aDay = aDate[0].slice(0, -1);
  var aHour = aDate[1].slice(0, -1);
  var aMin = aDate[2].slice(0, -1);
  var bDate = b.match(/\S+/g);
  var bDay = bDate[0].slice(0, -1);
  var bHour = bDate[1].slice(0, -1);
  var bMin = bDate[2].slice(0, -1);

  var aTotalSec = aMin * 60 + aHour * ONE_HOUR_IN_SECONDS + aDay * ONE_DAY_IN_SECONDS;
  var bTotalSec = bMin * 60 + bHour * ONE_HOUR_IN_SECONDS + bDay * ONE_DAY_IN_SECONDS;

  if (aTotalSec < bTotalSec) {
    return 1;
  } else if (aTotalSec > bTotalSec) {
    return -1;
  } else {
    return 0;
  }
}

function secondsToDateString(seconds) {
  // format d-h-m for e.g. "250d 16h 36m"
  var days = Math.floor(seconds / ONE_DAY_IN_SECONDS);
  seconds -= days * ONE_DAY_IN_SECONDS;

  var hours = Math.floor(seconds / ONE_HOUR_IN_SECONDS) % 24;
  seconds -= hours * ONE_HOUR_IN_SECONDS;

  var minutes = Math.floor(seconds / 60) % 60;

  return days + "d " + hours + "h " + minutes + "m";
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
    console.log(window.location);
    var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function sortByCreationTime(array) {
  array.sort(function (a, b) {
    if (a.Creation > b.Creation) {
      return 1;
    } else if (a.Creation < b.Creation) {
      return -1;
    } else {
      return 0;
    }
  });
}