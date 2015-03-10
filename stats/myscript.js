var chart;
var allowedToChangeCategory = true;
var categoryId = 0;
var categories = {};

categories[0] = "alca";
categories[1] = "analysis";
categories[2] = "db";
categories[3] = "daq";
categories[4] = "docs";
categories[5] = "dqm";
categories[6] = "core";
categories[7] = "fastsim";
categories[8] = "generators";
categories[9] = "geometry";
categories[10] = "l1";
categories[11] = "operations";
categories[12] = "pdmv";
categories[13] = "reconstruction";
categories[14] = "simulations";
categories[15] = "tests";
categories[16] = "visualization";


var chartData = [];
for (var i = 0; i < 17; i++) {
    chartData[getCategoryName(i)] = [];
}
chartData['category'] = [];
var totalPr = 0;
var statistics = {};
for (var i = 0; i < 17; i++) {
    statistics[getCategoryName(i)] = {}
    statistics[getCategoryName(i)]["less than a minute"] = 0;
    statistics[getCategoryName(i)]["1 minute to an hour"] = 0;
    statistics[getCategoryName(i)]["1 hour to a day"] = 0;
    statistics[getCategoryName(i)]["1 day to a week"] = 0;
    statistics[getCategoryName(i)]["1 week to 2 weeks"] = 0;
    statistics[getCategoryName(i)]["2 weeks to a month"] = 0;
    statistics[getCategoryName(i)]["1 month to a two month"] = 0;
    statistics[getCategoryName(i)]["more than two month"] = 0;
}
var idList = {};
for (var i = 0; i < 17; i++) {
    idList[getCategoryName(i)] = {};
    idList[getCategoryName(i)]["less than a minute"] = [];
    idList[getCategoryName(i)]["1 minute to an hour"] = [];
    idList[getCategoryName(i)]["1 hour to a day"] = [];
    idList[getCategoryName(i)]["1 day to a week"] = [];
    idList[getCategoryName(i)]["1 week to 2 weeks"] = [];
    idList[getCategoryName(i)]["2 weeks to a month"] = [];
    idList[getCategoryName(i)]["1 month to a two month"] = [];
    idList[getCategoryName(i)]["more than two month"] = [];
}
var info = [];
for (var i = 0; i < 17; i++) {
    info[getCategoryName(i)] = {};
    info[getCategoryName(i)]["totalPR"] = 0;
}
var currentTimeInSeconnds = Date.now() / 1000;

AmCharts.ready(function () {
    // PIE CHART
    loadCSV("pr-stats.csv");

    chart = new AmCharts.AmPieChart();
    chart.colors = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", "#0D52D1", "#2A0CD0", "#8A0CCF", "#CD0D74", "#754DEB", "#DDDDDD", "#999999", "#333333", "#000000", "#57032A", "#CA9726", "#990000", "#4B0C25"];
    chart.dataProvider = chartData['category'];
    chart.titleField = "period";
    chart.valueField = "value";
    chart.outlineColor = "#FFFFFF";
    chart.outlineAlpha = 0.8;
    chart.outlineThickness = 2;
    chart.balloonText = "[[title]]<br>PR count:<span style='font-size:14px'><b> [[value]]</b></span> ([[percents]]%)";
    chart.labelText = "[[title]]: [[value]] PRs";
    // this makes the chart 3D
    chart.depth3D = 15;
    chart.angle = 30;

    chart.borderAlpha = 1;

    // Title
    chart.addTitle("Not merged or closed Pull Requests (" + info[getCategoryName(categoryId)]["totalPR"] + ")");
    // LEGEND
    legend = new AmCharts.AmLegend();
    legend.align = "center";
    legend.markerType = "circle";
    chart.addLegend(legend);


    // AN EVENT
    chart.addListener("clickSlice", function (event) {
        if (allowedToChangeCategory == true) {
            var title = event.dataItem.title;
            if (event.dataItem.dataContext.id != undefined) {

            }
            else {
                //console.log(event);
                //console.log(event.dataItem.title);
                //var categoryName = title.slice(10, title.length);
                var catId = getCategoryId(title);
                changeChartCategory(parseInt(catId));
                test();
                writeTable(title);
            }
            allowedToChangeCategory = false;
        }
    });

    initChart();
    // WRITE

    chart.write("chartdiv");
    chart.validateNow();
});

function loadCSV(file) {
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari
        var request = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        var request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // load
    request.open('GET', file, false);
    request.send();

    var data = request.responseText;
    //replace UNIX new lines
    data = data.replace(/\r\n/g, "\n");
    //replace MAC new lines
    data = data.replace(/\r/g, "\n");
    //split into rows
    var rows = data.split("\n");

    parseCSV(rows);
    getAllCategoryData();
    //

    //console.log(info);

}

function parseCSV(rows) {

    for (var i = 1; i < rows.length; i++) {
        if (rows[i]) {
            var column = rows[i].split(",");

            var creationTime = column[0];
            var mergeTime = column[1];
            var id = column[2];
            var isPr = column[3];
            var closed = column[5];
            var labelStatus = column[8];

            var date = new Date(column[0] * 1000);
            // second item is value of the second column
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            /*
             if ((isPr == "1") && (closed == "0") )  {
             var pullRequestAlreadyOpenedForSeconds = currentTimeInSeconnds - creationTime;
             info[getCategoryName(0)]["totalPR"] += 1;
             if (pullRequestAlreadyOpenedForSeconds <= 60) { //sec
             statistics[getCategoryName(0)]["less than a minute"]++;
             idList[getCategoryName(0)]["less than a minute"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60) { //sec * min
             statistics[getCategoryName(0)]["1 minute to an hour"]++;
             idList[getCategoryName(0)]["1 minute to an hour"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24) { // sec * min * hours
             statistics[getCategoryName(0)]["1 hour to a day"]++;
             idList[getCategoryName(0)]["1 hour to a day"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 7) { // sec * min * hours * 7
             statistics[getCategoryName(0)]["1 day to a week"]++;
             idList[getCategoryName(0)]["1 day to a week"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 14) {
             statistics[getCategoryName(0)]["1 week to 2 weeks"]++;
             idList[getCategoryName(0)]["1 week to 2 weeks"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 30) {
             statistics[getCategoryName(0)]["2 weeks to a month"]++;
             idList[getCategoryName(0)]["2 weeks to a month"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 60) {
             statistics[getCategoryName(0)]["1 month to a two month"]++;
             idList[getCategoryName(0)]["1 month to a two month"].push(id);
             } else {
             statistics[getCategoryName(0)]["more than two month"]++;
             idList[getCategoryName(0)]["more than two month"].push(id);
             }
             }
             */
            for (var o = 0; o < 17; o++) {
                proceedCategoryData(column, o);
            }
        }
    }

    for (var counter = 0; counter < 17; counter++) {
        var tempArray = [];
        jQuery.each(statistics[getCategoryName(counter)], function (i, val) {
            var dataObject = {
                date: i,
                value: val
            };
            tempArray.push(dataObject);
        });
        //       console.log(tempArray);

        /*tempArray.sort(function (a, b) {
         if (a.date > b.date) {
         return 1;
         }
         if (a.date < b.date) {
         return -1;
         }
         // when a equal to b
         return 0;
         });*/

        // console.log(tempArray);
        jQuery.each(tempArray, function (i, val) {
            var dataObject = {
                period: val.date,
                value: val.value
            };
            chartData[getCategoryName(counter)].push(dataObject);
        });

    }
}

function writeTable(sliceName) {
    console.log(idList[sliceName]);
    jQuery.each(idList[sliceName], function (period) {

        jQuery.each(idList[sliceName][period], function (i, PRid) {
            var timePassed = idList[sliceName][period][i].timePassed;
            var days = Math.floor(timePassed / 86400);
            timePassed -= days * 86400;

            var hours = Math.floor(timePassed / 3600) % 24;
            timePassed -= hours * 3600;

            var minutes = Math.floor(timePassed / 60) % 60;
            timePassed -= minutes * 60;

            var seconds = timePassed % 60;  // in theory the modulus is not required
            var timePassedString = days + "d " + hours + "h " + minutes + "m ";
            var warning = "<tr class='warning'>";
            var success = "<tr class='success'>";
            var danger = "<tr class='danger'>";

            var rowColor = success;

            if (days < 1) {
                console.log("1");
                var rowColor = success;
            } else if (days < 14) {
                console.log("2");
                var rowColor = warning;
            } else if (days >= 14) {
                console.log("3");
                var rowColor = danger;
            }

            //rowColor = success;
            PRid = idList[sliceName][period][i].id;
            var string = rowColor + "<td><a href='https://github.com/cms-sw/cmssw/pull/" + PRid + "' target='_blank'>" + PRid + "</td><td>" + period + "</td><td>" + timePassedString + "</td></tr>";
            // var lol = PRid "=" + "'>"+PRid+"</td><td>"+period+"</td></tr>";
            $("#back-btn").show();
            $(".bs-example ").show();
            $('#myTable > tbody:last').append(string);
        });

        PRid = "";
        //       var string = "<tr><td>" + "<a href='https://github.com/cms-sw/cmssw/pull/" + PRid= + "'>"+PRid+"</td><td>"+sliceName+"</td></tr>"

        //       $('#myTable > tbody:last').append(string);
    });
    //$('#myTable > tbody:last').append('<tr><td>bla</td></tr>');

}
// console.log(statistics);
function proceedCategoryData(column, categoryNumber) {
    var creationTime = column[0];
    var mergeTime = column[1];
    var id = column[2];
    var isPr = column[3];
    var closed = column[5];
    var labelStatus = column[8];

    var date = new Date(column[0] * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var categoryTotal = 0;
    //console.log(statistics);
    var categoryName = getCategoryName(categoryNumber);
//            var categoryName = categoryNumber+1;
    var pullRequestAlreadyOpenedForSeconds = currentTimeInSeconnds - creationTime;
    //console.log(pullRequestAlreadyOpenedForSeconds);
    var tempObject = {"id": id, "timePassed": pullRequestAlreadyOpenedForSeconds, "labelStatus": labelStatus};
    if ((isPr == "1") && (closed == "0") && ((labelStatus[getCategoryId(categoryName)] == "P"))) {
        if (pullRequestAlreadyOpenedForSeconds <= 60) { //sec
            statistics[categoryName]["less than a minute"]++;
            idList[categoryName]["less than a minute"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60) { //sec * min
            statistics[categoryName]["1 minute to an hour"]++;
            idList[categoryName]["1 minute to an hour"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24) { // sec * min * hours
            statistics[categoryName]["1 hour to a day"]++;
            idList[categoryName]["1 hour to a day"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 7) { // sec * min * hours * 7
            statistics[categoryName]["1 day to a week"]++;
            idList[categoryName]["1 day to a week"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 14) {
            statistics[categoryName]["1 week to 2 weeks"]++;
            idList[categoryName]["1 week to 2 weeks"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 30) {
            statistics[categoryName]["2 weeks to a month"]++;
            idList[categoryName]["2 weeks to a month"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 60) {
            statistics[categoryName]["1 month to a two month"]++;
            idList[categoryName]["1 month to a two month"].push(tempObject);
        } else {
            statistics[categoryName]["more than two month"]++;
            idList[categoryName]["more than two month"].push(tempObject);
        }
        info[categoryName]["totalPR"] += 1;

    }
}

function changeChartCategory(id) {
//    console.log(chart);
    chart.dataProvider = chartData[getCategoryName(id)];
    chart.titles[0].text = "Category: " + getCategoryName(id) + ". Not closed/merged pull requests (" + info[getCategoryName(id)]["totalPR"] + ")";
    chart.validateData();
}

function initChart() {
    allowedToChangeCategory = true;
    $("#tbodyid").empty();
    $(".bs-example ").hide();
    $("#back-btn").hide();
    //console.log(chart);
    //console.log(chart.dataProvider);
    chart.dataProvider = chartData['category'];
    var tempTotal = 0;
    for (var i = 0; i < 17; i++) {
        tempTotal += info[getCategoryName(i)]['totalPR'];
    }
    chart.titles[0].text = "Pending pull requests by categories. Total: " + tempTotal;
    //console.log(chart);
    chart.validateData();
    //chart.validateNow();
    //console.log(info);
}

function getAllCategoryData() {
    //console.log(info);
    for (i = 0; i < 17; i++) {

        var dataObject = {
            period: getCategoryName(i),
            value: info[getCategoryName(i)]["totalPR"]
        };

        //  console.log(info[getCategoryName(i)]["totalPR"]);
        chartData['category'].push(dataObject);
    }
    //console.log(info);

}

function getCategoryName(id) {

    return categories[id];
}

function getCategoryId(categoryName) {
    //console.log(categories)
    var categoryByName = [];
    jQuery.each(categories, function (i, val) {
        categoryByName[val] = i;
    });
    return categoryByName[categoryName];
}

function test() {
//    console.log(chart);
    console.log()
    chart.dataProvider[0].color = "#228B22";
    chart.dataProvider[1].color = "#228B22";
    chart.dataProvider[2].color = "#228B22";
    chart.dataProvider[3].color = "#FFD700";
    chart.dataProvider[4].color = "#FFD700";
    chart.dataProvider[5].color = "#FFA07A";
    chart.dataProvider[6].color = "#FF0000";
    chart.dataProvider[7].color = "#FF0000";
    chart.colorField = "color";
    chart.validateData();
    chart.validateNow();
    //  console.log(chart);
}