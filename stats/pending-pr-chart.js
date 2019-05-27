var ONE_HOUR_IN_SECONDS = 60 * 60;
var ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;
var SAFARI = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

var safariIniFirstPop = 0;
var dataObject;
var chart;
var csvData = [];
var chartData = [];
var labelsForTestStatus = {
  "A": "<span class='label label-success'>Approved</span>",
  "P": "<span class='label label-warning'>Pending</span>",
  "R": "<span class='label label-danger'>Rejected</span>",
  "S": "<span class='label label-warning'>Started</span>"
};

var numberOfCategories = Object.keys(categories).length;

var categoriesIds = {};
for (var i = 0; i < numberOfCategories; i++) {
  categoriesIds[categories[i]] = i;
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
var clickGraphItem = false;
var chartWithAllCats = true;

AmCharts.ready(function() {
  var rows = loadCSV("../data/stats/pr-open-stats.csv");
  parseCSV(rows);

  // SERIAL CHART
  chart = new AmCharts.AmSerialChart();
  chart.dataProvider = chartData;
  chart.categoryField = "category";
  chart.plotAreaBorderAlpha = 0.2;
  chart.startDuration = 1;
  chart.startDuration = 0;
  chart.addTitle("Pending Pull request for each category");

  // AXES
  // category
  var categoryAxis = chart.categoryAxis;
  categoryAxis.gridAlpha = 0.1;
  categoryAxis.axisAlpha = 0;
  categoryAxis.gridPosition = "start";
  categoryAxis.labelRotation = 30;
  categoryAxis.titleFontSize = 17;

  categoryAxis.title = "Categories";

  // value
  var valueAxis = new AmCharts.ValueAxis();
  valueAxis.stackType = "regular";
  valueAxis.gridAlpha = 0.1;
  valueAxis.title = "Pull Requests";
  valueAxis.titleFontSize = 17;


  chart.addValueAxis(valueAxis);

  // GRAPHS
  // first graph    
  var graph = new AmCharts.AmGraph();
  graph.title = "0 to 7 days";
  graph.labelText = "[[value]]";
  graph.valueField = "0 to 7 days";
  graph.type = "column";
  graph.lineAlpha = 0;
  graph.alphaField = "alpha";
  graph.fillAlphas = 1;
  graph.lineColor = "#008000";
  graph.balloonText = "";
  chart.addGraph(graph);

  // second graph              
  graph = new AmCharts.AmGraph();
  graph.title = "7 to 30 days";
  graph.labelText = "[[value]]";
  graph.valueField = "7 to 30 days";
  graph.type = "column";
  graph.lineAlpha = 0;
  graph.alphaField = "alpha";
  graph.fillAlphas = 1;
  graph.lineColor = "#FFD700";
  graph.balloonText = "";
  chart.addGraph(graph);

  // third graph                              
  graph = new AmCharts.AmGraph();
  graph.title = "30 + days";
  graph.labelText = "[[value]]";
  graph.valueField = "30 + days";
  graph.type = "column";
  graph.lineAlpha = 0;
  graph.alphaField = "alpha";
  graph.fillAlphas = 1;
  graph.lineColor = "#FF0000";
  graph.balloonText = "";
  chart.addGraph(graph);

  // LEGEND                  
  var legend = new AmCharts.AmLegend();
  legend.borderAlpha = 0.2;
  legend.horizontalGap = 10;
  legend.switchable = false;
  chart.addLegend(legend);


  chart.depth3D = 25;
  chart.angle = 30;
  // WRITE
  chart.write("chartdiv");

  chart.addListener("clickGraphItem", function(event) {
    $("#table1").hide();
    changeCategoryData(event.item.category);
    hideOtherBars(categoriesIds[event.item.category])
    clickGraphItem = true;
    chart.validateData();
  });

  chart.addListener("rollOverGraphItem", function(event) {
    $('#chartdiv').css('cursor', 'pointer');
    clickGraphItem = false;
  });

  chart.addListener("rollOutGraphItem", function(event) {
    $('#chartdiv').css('cursor', 'default');
  });

  $('#chartdiv').on('click', function(e) {
    if ((!clickGraphItem) && (!chartWithAllCats)) {
      showMainData();
    }
  });

  window.addEventListener('popstate', function() {
    // safari initialize popstate on load, so we need to ignore it
    safariIniFirstPop++;
    if ((SAFARI) && (safariIniFirstPop > 1)) {
      window.location = location.pathname;
    } else if (!SAFARI) {
      window.location = location.href;
    }
  }, false);

  $("#table2").hide();

  writeMainTable();
  var catFromUrl = getUrlParameter('category');
  if (!isNaN(categoriesIds[catFromUrl])) {
    $("#table1").hide();
    changeCategoryData(catFromUrl);
    hideOtherBars(categoriesIds[catFromUrl]);
    chart.validateData();
  } else if ((typeof(catFromUrl) != "undefined") && (catFromUrl.length > 0)) {
    //     wrongCategory();
  } else {

  }
});

function writeMainTable() {
  for (var i = 0; i < csvData.length; i++) {
    var timePassedInSeconds = currentTimeInSeconds - csvData[i].Creation;
    var days = Math.floor(timePassedInSeconds / ONE_DAY_IN_SECONDS);
    var timePassedString = secondsToDaysWithLabel(timePassedInSeconds);
    var timePassedFromLastUpdate = secondsToDaysWithLabel(currentTimeInSeconds - csvData[i].lastUpdateTime);
    var milestoneTitle = csvData[i].milestoneTitle;
    var rowColor = rowColorFromDays(days);

    var categoriesPending = "";
    for (o = 0; o < numberOfCategories; o++) {
      if (o != categoriesIds['tests']) {
        var labelLetter = csvData[i].labelStatus[o];
        categoriesPending += labelStatusLetterToLabel(labelLetter, o);
      }
    }

    var testStatus = testStatusFromLabel(csvData[i].labelStatus);

    var row = [];
    var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + csvData[i].id + "' target='_blank'>" + csvData[i].id;

    row.push({
      classes: rowColor,
      pr: PRidWithLink,
      category: categoriesPending,
      testStatus: testStatus,
      daysOpened: timePassedString,
      lastUpdate: timePassedFromLastUpdate,
      milestone: milestoneTitle
    });

    $('#myTable1').bootstrapTable('append', row);

  }

}

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

  jQuery.each(statistics, function(i) {
    dataObject = {
      category: i
    };

    jQuery.each(statistics[i], function(g) {
      dataObject[g] = statistics[i][g];
    });
    chartData.push(dataObject);
  });
}

function proceedCategoryData(column, categoryNumber) {
  var creationTime = column[0];
  var mergeTime = column[1];
  var id = column[2];
  var isPr = column[3];
  var closed = column[5];
  var labelStatus = column[8];
  var lastUpdateTime = column[9];
  var milestoneTitle = column[10];
  var categoryName = categories[categoryNumber];
  var pullRequestAlreadyOpenedForSeconds = currentTimeInSeconds - creationTime;
  var tempObject = {
    "id": id,
    "timePassed": pullRequestAlreadyOpenedForSeconds,
    "labelStatus": labelStatus,
    "lastUpdateTime": lastUpdateTime,
    "milestoneTitle": milestoneTitle
  };
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
    csvData.push({
      "Creation": parseInt(creationTime),
      id: id,
      "labelStatus": column[8],
      "lastUpdateTime": column[9],
      "milestoneTitle": column[10]
    });
  }
}

function secondsToDays(seconds) {
  var days = Math.floor(seconds / ONE_DAY_IN_SECONDS);
  return days;
}

function secondsToDaysWithLabel(seconds) {
  var days = Math.floor(seconds / ONE_DAY_IN_SECONDS);
  var daysString = days + " days";
  if (days < 7) {
    return "<span class='label label-success'>" + daysString + "</span>"
  } else if (days < 30) {
    return "<span class='label label-warning'>" + daysString + "</span>"
  } else if (days >= 30) {
    return "<span class='label label-danger'>" + daysString + "</span>"
  } else {
    return "";
  }
}

function daysToString(days) {
  return days + " days";
}

function rowStyle(row) {
  return {
    classes: row['classes']
  };
}

function customDaysSorter(a, b) {
  var aDate = a.match(/>(\d{1,4}) days/);
  var aDay = parseInt(aDate[1]);

  var bDate = b.match(/>(\d{1,4}) days/);
  var bDay = parseInt(bDate[1]);

  if (aDay < bDay) {
    return 1;
  } else if (aDay > bDay) {
    return -1;
  } else {
    return 0;
  }
}


function changeCategoryData(category) {
  window.history.pushState({
    category: category
  }, "Title", "?category=" + category);
  chartWithAllCats = false;
  $("#table2").show();
  $("#backbtn").show();

  $("#myTable2").bootstrapTable('destroy')
  $("#myTable2").bootstrapTable();
  jQuery.each(idList[category], function(period) {

    jQuery.each(idList[category][period], function(i, PRid) {
      var timePassed = idList[category][period][i].timePassed;
      var days = Math.floor(timePassed / ONE_DAY_IN_SECONDS);
      var timePassedString = secondsToDaysWithLabel(idList[category][period][i].timePassed);
      var timePassedFromLastUpdate = secondsToDaysWithLabel(currentTimeInSeconds - idList[category][period][i].lastUpdateTime);
      var milestoneTitle = idList[category][period][i].milestoneTitle;

      var categoriesPending = "";
      for (o = 0; o < numberOfCategories; o++) {
        if (o != categoriesIds['tests']) {
          var labelLetter = idList[category][period][i].labelStatus[o];
          categoriesPending += labelStatusLetterToLabel(labelLetter, o);
        }
      }

      var testStatus = testStatusFromLabel(idList[category][period][i].labelStatus);
      var rowColor = rowColorFromDays(days);
      var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + idList[category][period][i].id + "' target='_blank'>" + idList[category][period][i].id;
      var row = [];

      row.push({
        classes: rowColor,
        pr: PRidWithLink,
        testStatus: testStatus,
        category: categoriesPending,
        daysOpened: timePassedString,
        lastUpdate: timePassedFromLastUpdate,
        milestone: milestoneTitle
      });

      $('#myTable2').bootstrapTable('append', row);
    });
  });
}

function showMainData() {
  chartWithAllCats = true;
  $("#backbtn").hide();
  $("#table2").hide();
  $("#table1").show();
  allBarsVisible();
  window.history.pushState({}, "Title", location.pathname);
}

function allBarsVisible() {
  for (var i = 0; i < numberOfCategories; i++) {
    chartData[i].alpha = 1;
  }
  chart.validateData();
}

function hideOtherBars(catId) {
  for (var i = 0; i < numberOfCategories; i++) {
    if (i != catId) {
      chartData[i].alpha = 0.15;
    } else {
      chartData[i].alpha = 1;
    }
  }
}

function testStatusFromLabel(labelStatus) {
  var labelTestStatus = labelStatus[categoriesIds['tests']];

  if (typeof labelsForTestStatus[labelTestStatus] === 'undefined') {
    return "Undefined";
  } else {
    return labelsForTestStatus[labelTestStatus];
  }
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function rowColorFromDays(days) {
  if (days < 7) {
    return "<span class='label label-success'>" + days + "</span>"
  } else if (days < 30) {
    return "<span class='label label-warning'>" + days + "</span>"
  } else if (days >= 30) {
    return "<span class='label label-danger'>" + days + "</span>"
  }
}

function nowrap(value, row, index) {
  return {
    classes: "nowrap"
  };
}

function labelStatusLetterToLabel(letter, indexInCategoriesArray) {
  switch (letter) {
    case "P":
      return "<span class='label label-warning'>" + categories[indexInCategoriesArray] + "</span> "
    case "A":
      return "<span class='label label-success'>" + categories[indexInCategoriesArray] + "</span> ";
    case "R":
      return "<span class='label label-danger'>" + categories[indexInCategoriesArray] + "</span> ";
    case "S":
      return "<span class='label label-warning'>" + categories[indexInCategoriesArray] + "</span> ";
    default:
      return "";
  }
}
