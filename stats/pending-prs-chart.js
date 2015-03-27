var ONE_HOUR_IN_SECONDS = 60 * 60;
var ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;

var dataObject;
var chart;
var csvData = [];
var chartData = [];
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

AmCharts.ready(function () {
    var rows = loadCSV("../data/stats/pr-stats.csv");
    parseCSV(rows);

    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "category";
    chart.plotAreaBorderAlpha = 0.2;
    chart.startDuration = 1;
    chart.fontSize = 12;
    chart.startDuration = 0;
    chart.addTitle("Pending Pull request for each category");

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.axisAlpha = 0;
    categoryAxis.gridPosition = "start";
    categoryAxis.labelRotation = 30;


    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.stackType = "regular";
    valueAxis.gridAlpha = 0.1;

    chart.addValueAxis(valueAxis);

    // GRAPHS
    // first graph    
    var graph = new AmCharts.AmGraph();
    graph.title = "0 to 7 days";
    graph.labelText = "[[value]]";
    graph.valueField = "0 to 7 days";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#008000";
    graph.balloonText = "<span style='color:#555555;'>[[category]]</span><br><span style='font-size:14px'>[[title]]:<b>[[value]]</b></span>";
    chart.addGraph(graph);

    // second graph              
    graph = new AmCharts.AmGraph();
    graph.title = "7 to 30 days";
    graph.labelText = "[[value]]";
    graph.valueField = "7 to 30 days";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#FFD700";
    graph.balloonText = "<span style='color:#555555;'>[[category]]</span><br><span style='font-size:14px'>[[title]]:<b>[[value]]</b></span>";
    chart.addGraph(graph);

    // third graph                              
    graph = new AmCharts.AmGraph();
    graph.title = "30 + days";
    graph.labelText = "[[value]]";
    graph.valueField = "30 + days";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 1;
    graph.lineColor = "#FF0000";
    graph.balloonText = "<span style='color:#555555;'>[[category]]</span><br><span style='font-size:14px'>[[title]]:<b>[[value]]</b></span>";
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

    chart.addListener("clickGraphItem", function (event) {
        $("#table1").hide();
        changeCategoryData(event.item.category);
    });

    chart.addListener("rollOverGraphItem", function (event) {
        $('#chartdiv').css('cursor', 'pointer');
    });

    chart.addListener("rollOutGraphItem", function (event) {
        $('#chartdiv').css('cursor', 'default');
    });


    $("#table2").hide();

    writeMainTable();
    //changeCategoryData('analysis');
});

function writeMainTable() {
    for (var i = 0; i < csvData.length; i++) {
        var timePassedInSeconds = currentTimeInSeconds - csvData[i].Creation;
        var days = Math.floor(timePassedInSeconds / ONE_DAY_IN_SECONDS);
        var timePassedString = secondsToDateString(timePassedInSeconds);
        var timePassedFromLastUpdate = secondsToDateString(currentTimeInSeconds - csvData[i].lastUpdateTime);
        // console.log(timePassedFromLastUpdate);

        if (days < 7) {
            var rowColor = "green";
        } else if (days < 30) {
            var rowColor = "yellow";
        } else if (days >= 30) {
            var rowColor = "red";
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
            daysOpened: timePassedString,
            lastUpdate: timePassedFromLastUpdate
        });

        $('#myTable1').bootstrapTable('append', row);

    }

}
// this method sets chart 2D/3D
function setDepth() {
    if (document.getElementById("rb1").checked) {
        chart.depth3D = 0;
        chart.angle = 0;
    } else {
        chart.depth3D = 25;
        chart.angle = 30;
    }
    chart.validateNow();
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

    jQuery.each(statistics, function (i) {
        dataObject = {
            category: i
        };

        jQuery.each(statistics[i], function (g) {
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

    var categoryName = categories[categoryNumber];
    var pullRequestAlreadyOpenedForSeconds = currentTimeInSeconds - creationTime;
    var tempObject = {
        "id": id,
        "timePassed": pullRequestAlreadyOpenedForSeconds,
        "labelStatus": labelStatus,
        "lastUpdateTime": lastUpdateTime
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
            "lastUpdateTime": column[9]
        });
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

function rowStyle(row) {
    // using to change row color
    return {
        classes: row['classes']
    };
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


function changeCategoryData(category) {
    $("#table2").show();
    $("#backbtn").show();

    $("#myTable2").bootstrapTable('destroy')
    $("#myTable2").bootstrapTable();
    jQuery.each(idList[category], function (period) {

        jQuery.each(idList[category][period], function (i, PRid) {
            var timePassed = idList[category][period][i].timePassed;
            var days = Math.floor(timePassed / ONE_DAY_IN_SECONDS);
            var timePassedString = secondsToDateString(idList[category][period][i].timePassed);
            var timePassedFromLastUpdate = secondsToDateString(currentTimeInSeconds - idList[category][period][i].lastUpdateTime);

            var categoriesPending = "";
            for (o = 0; o < numberOfCategories; o++) {
                if (idList[category][period][i].labelStatus[o] == "P") {
                    categoriesPending += categories[o] + " ";
                }
            }

            if (days < 7) {
                var rowColor = "green";
            } else if (days < 30) {
                var rowColor = "yellow";
            } else if (days >= 30) {
                var rowColor = "red";
            }

            PRid = idList[category][period][i].id;
            var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + PRid + "' target='_blank'>" + PRid;
            var row = [];
            row.push({
                classes: rowColor,
                pr: PRidWithLink,
                category: categoriesPending,
                daysOpened: timePassedString,
                lastUpdate: timePassedFromLastUpdate

            });

            $('#myTable2').bootstrapTable('append', row);
        });
    });
}

function showMainData() {
    $("#backbtn").hide();
    $("#table2").hide();
    $("#table1").show();
}