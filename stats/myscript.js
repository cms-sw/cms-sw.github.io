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
for (var i = 0; i < Object.keys(categories).length; i++) {
    chartData[getCategoryName(i)] = [];
}
chartData['category'] = [];
var totalPr = 0;
var statistics = {};
for (var i = 0; i < Object.keys(categories).length; i++) {
    statistics[getCategoryName(i)] = {}
    statistics[getCategoryName(i)]["0 to 3 days"] = 0;
    statistics[getCategoryName(i)]["3 to 7 days"] = 0;
    statistics[getCategoryName(i)]["7 to 30 days"] = 0;
    statistics[getCategoryName(i)]["30 + days"] = 0;
    ;
}
var idList = {};
for (var i = 0; i < Object.keys(categories).length; i++) {
    idList[getCategoryName(i)] = {};
    idList[getCategoryName(i)]["0 to 3 days"] = [];
    idList[getCategoryName(i)]["3 to 7 days"] = [];
    idList[getCategoryName(i)]["7 to 30 days"] = [];
    idList[getCategoryName(i)]["30 + days"] = [];
}
var info = [];
for (var i = 0; i < Object.keys(categories).length; i++) {
    info[getCategoryName(i)] = {};
    info[getCategoryName(i)]["totalPR"] = 0;
}
var currentTimeInSeconnds = Date.now() / 1000;




AmCharts.ready(function () {
    // PIE CHART
	loadCSV("../data/stats/pr-stats.csv");

    chart = new AmCharts.AmPieChart();
    chart.colors = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", "#0D52D1", "#2A0CD0", "#8A0CCF", "#CD0D74", "#754DEB", "#DDDDDD", "#999999", "#333333", "#000000", "#57032A", "#CA9726", "#990000", "#4B0C25"];
    chart.dataProvider = chartData['category'];
    chart.titleField = "period";
    chart.valueField = "value";
    chart.outlineColor = "#FFFFFF";
    chart.outlineAlpha = 0.8;
    chart.outlineThickness = 2;
    chart.balloonText = "";
    //chart.balloon.hide();
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
    legend.switchable = false;
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
                changeChartCategory(catId);
                test();
                writeTable(title);
            }
            allowedToChangeCategory = false;
        }
        chart.validateData();
    });




    hideTable();

    // RELOAD ON BACK BUTTON PRESSED
    window.addEventListener('popstate', function () {
        location.reload();
    }, false);

    // WRITE

  //  console.log("labas+"+getCategoryId(catFromUrl));
    if (jQuery.isNumeric(catFromUrl)) {
        console.log("labas="+getCategoryId(catFromUrl));
        changeChartCategory(getCategoryId(catFromUrl));
        test();
        writeTable(catFromUrl);
    } else {
        initChart();

        var catFromUrl = getUrlParameter('category');
    }
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
             statistics[getCategoryName(0)]["0 to 3 days"]++;
             idList[getCategoryName(0)]["0 to 3 days"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60) { //sec * min
             statistics[getCategoryName(0)]["3 to 7 days"]++;
             idList[getCategoryName(0)]["3 to 7 days"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24) { // sec * min * hours
             statistics[getCategoryName(0)]["7 to 30 days"]++;
             idList[getCategoryName(0)]["7 to 30 days"].push(id);
             } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 7) { // sec * min * hours * 7
             statistics[getCategoryName(0)]["30 + days"]++;
             idList[getCategoryName(0)]["30 + days"].push(id);
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
            for (var o = 0; o < Object.keys(categories).length; o++) {
                proceedCategoryData(column, o);
            }
        }
    }

    for (var counter = 0; counter < Object.keys(categories).length; counter++) {
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
//    console.log(idList[sliceName]);
    $("#myTable").bootstrapTable();

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
            var warning = 'warning';
            var success = 'success';
            var danger = 'danger';

            var rowColor = success;

            if (days < 7) {
                //   console.log("1");
                var rowColor = success;
            } else if (days < 30) {
                //  console.log("2");
                var rowColor = warning;
            } else if (days >= 30) {
                //console.log("3");
                var rowColor = danger;
            }

            //rowColor = success;
            PRid = idList[sliceName][period][i].id;
            //var string = rowColor + "<td><a href='https://github.com/cms-sw/cmssw/pull/" + PRid + "' target='_blank'>" + PRid + "</td><td>" + period + "</td><td>" + timePassedString + "</td></tr>";
            // var lol = PRid "=" + "'>"+PRid+"</td><td>"+period+"</td></tr>";
            var PRidWithLink = "<a href='https://github.com/cms-sw/cmssw/pull/" + PRid + "' target='_blank'>" + PRid;
            var row = [];
            row.push({
                classes: rowColor,
                pr: PRidWithLink,
                category: period,
                daysOpened: timePassedString
            });

            //$('#myTable > tbody:last').append(string);

            $('#myTable').bootstrapTable('append', row);
        });
        PRid = "";
        //       var string = "<tr><td>" + "<a href='https://github.com/cms-sw/cmssw/pull/" + PRid= + "'>"+PRid+"</td><td>"+sliceName+"</td></tr>"

        //       $('#myTable > tbody:last').append(string);
    });
    //$('#myTable > tbody:last').append('<tr><td>bla</td></tr>');
    $("#back-btn").show();
    $(".bs-example ").show();

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
        if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 3) { //sec
            statistics[categoryName]["0 to 3 days"]++;
            idList[categoryName]["0 to 3 days"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 7) { //sec * min
            statistics[categoryName]["3 to 7 days"]++;
            idList[categoryName]["3 to 7 days"].push(tempObject);
        } else if (pullRequestAlreadyOpenedForSeconds <= 60 * 60 * 24 * 30) { // sec * min * hours
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
//    console.log(chart);
    console.log("id="+id);
    chart.dataProvider = chartData[getCategoryName(id)];
    chart.titles[0].text = "Category: " + getCategoryName(id) + ". Not closed/merged pull requests (" + info[getCategoryName(id)]["totalPR"] + ")";
    chart.validateData();
    window.history.pushState("object", "Title", "/cms-sw.github.io/stats/pending-prs.html?category=" + getCategoryName(id));
}

function initChart() {
    allowedToChangeCategory = true;
    //$("#myTable").empty();
    hideTable();
    //console.log(chart);
    //console.log(chart.dataProvider);
    chart.dataProvider = chartData['category'];
    var tempTotal = 0;
    for (var i = 0; i < Object.keys(categories).length; i++) {
        tempTotal += info[getCategoryName(i)]['totalPR'];
    }
    chart.titles[0].text = "Pending pull requests by categories. Total: " + tempTotal;
    //console.log(chart);
    chart.validateData();
    window.history.pushState("object", "Title", "/cms-sw.github.io/stats/pending-prs.html");
    //chart.validateNow();
    //console.log(info);
}

function getAllCategoryData() {
    //console.log(info);
    for (i = 0; i < Object.keys(categories).length; i++) {

        var dataObject = {
            period: getCategoryName(i),
            value: info[getCategoryName(i)]["totalPR"]
        };

 //       console.log(info[getCategoryName(i)]["totalPR"]);
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
    return parseInt(categoryByName[categoryName]);
}

function test() {
//    console.log(chart);
    console.log()
    chart.dataProvider[0].color = "#228B22";
    chart.dataProvider[1].color = "#228B22";
    chart.dataProvider[2].color = "#FFD700";
    chart.dataProvider[3].color = "#FF0000";
    chart.colorField = "color";
    chart.validateData();
    chart.validateNow();
    console.log(getCategoryId("alca"));
    //  console.log(chart);
}

function rowStyle(row, index) {
    var classes = ['active', 'success', 'info', 'warning', 'danger'];
    //   console.log(row['classes']);
    return {
        classes: row['classes']
    };
}

function customDaysSorter(a, b) {
//    var firstDate = a.split(" ").length;
    var aDate = a.match(/\S+/g);
    var aDay = aDate[0].slice(0, -1);
    var aHour = aDate[1].slice(0, -1);
    var aMin = aDate[2].slice(0, -1);
    var bDate = b.match(/\S+/g);
    var bDay = bDate[0].slice(0, -1);
    var bHour = bDate[1].slice(0, -1);
    var bMin = bDate[2].slice(0, -1);

    var aTotalSec = aMin * 60 + aHour * 60 * 60 + aDay * 60 * 60 * 24;
    var bTotalSec = bMin * 60 + bHour * 60 * 60 + bDay * 60 * 60 * 24;

    if (aTotalSec < bTotalSec) return 1;

    if (aTotalSec < bTotalSec) {
        return 1;
    } else if (aTotalSec > bTotalSec) {
        return -1;
    } else {
        return 0;
    }
    //  console.log(firstDate);
    //  console.log("a=" + a + "b="+b);
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

function hideTable() {
    $("#myTable").bootstrapTable('destroy');
    $(".bs-example ").hide();
    $("#back-btn").hide();
}

