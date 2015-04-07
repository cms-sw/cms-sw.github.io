        var from = getUrlParameter('from');
        var to = getUrlParameter('to');
        var barType = getUrlParameter('type');

        if (from == undefined) {
            from = "01/06/2013";
        }

        if (to == undefined) {
            var currentdate = new Date();
            var to = 31 + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear();
        }

        var dataSets = {};
        dataSets['months'] = {};
        dataSets['weeks'] = {};
        dataSets['days'] = {};
        dataSets['months']['all'] = [];
        dataSets['weeks']['all'] = [];
        dataSets['days']['all'] = [];
        var graph;
        var graphType = "column";
        var maxCandlesticks = 100;
        var test = [];
        var test2 = [];
        var test3 = [];
        var statistics = {};
        var chartDataDays = [];
        var chartDataWeeks = [];
        var chartDataMonths = [];
        var chartData = [];
        var chartDataTypeStatus = "months";
        var chartDataTypeCategory = "all";
        var allowedToChange = true;

        AmCharts.ready(function() {
            // SERIAL CHART
            chart = new AmCharts.AmSerialChart();
            chart.pathToImages = "http://www.amcharts.com/lib/images/"
            chart.dataProvider = dataSets['months']['all'];
            chart.categoryField = "date";
            // listen for zoomed event andcall "handleZoom" method then it happens
            chart.addListener('zoomed', handleZoom);

            // AXES
            // category
            var categoryAxis = chart.categoryAxis;
            categoryAxis.parseDates = true; // as our data is date-based, we set this to true
            categoryAxis.minPeriod = "MM"; // our data is daily, so we set minPeriod to "DD"
            categoryAxis.dashLength = 1;
            categoryAxis.tickLenght = 1;
            categoryAxis.inside = false;
            categoryAxis.offset = 0;

            // value
            var valueAxis = new AmCharts.ValueAxis();
            valueAxis.dashLength = 1;
            valueAxis.axisAlpha = 1;
            valueAxis.title = "Pull requests per month";

            chart.addValueAxis(valueAxis);

            // GRAPH
            graph = new AmCharts.AmGraph();
            graph.title = "Price:";
            // as candlestick graph looks bad when there are a lot of candlesticks, we set initial type to "line"
            graph.type = "column";
            // graph colors
            graph.lineColor = "#7f8da9";
            graph.fillColors = "#009900";
            graph.negativeLineColor = "#db4c3c";
            graph.negativeFillColors = "#db4c3c";
            graph.fillAlphas = 1;
            graph.balloonText = "Date: <b> [[date]]</b><br />Value:<b>[[visits]]</b>";
            // this one is for "line" graph type
            graph.valueField = "visits";
            chart.addGraph(graph);

            // CURSOR
            var chartCursor = new AmCharts.ChartCursor();
            chartCursor.cursorPosition = "mouse";
            chartCursor.categoryBalloonDateFormat = "YYYY-MMMM-DD";
            chart.addChartCursor(chartCursor);

            // SCROLLBAR
            var chartScrollbar = new AmCharts.ChartScrollbar();
            chartScrollbar.scrollbarHeight = 30;
            chartScrollbar.graph = graph; // as we want graph to be displayed in the scrollbar, we set graph here
            chartScrollbar.graphType = "column"; // we don't want candlesticks to be displayed in the scrollbar
            chartScrollbar.autoGridCount = true;
            chartScrollbar.color = "#000";
            chart.addChartScrollbar(chartScrollbar);

            // WRITE
            chart.write("chartdiv");
            loadCSV("../data/stats/pr-stats.csv");
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
            parseCSV2(rows);
            parseCSV3(rows);
            chart.validateData();
            zooooooom(stringToDate(from), stringToDate(to));
            if ((barType == "days") || (barType == "weeks") || (barType == "months")) {
                change(barType, chartDataTypeCategory);
                changeType();
            }
        }

        function parseCSV(rows) {
            for (var i = 1; i < rows.length; i++) {
                if (rows[i]) {
                    var column = rows[i].split(",");

                    var date = new Date(column[0] * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var myDateStringDays = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + day).slice(-2);
                    if (statistics[myDateStringDays] == null) {
                        statistics[myDateStringDays] = 1;
                    } else {
                        statistics[myDateStringDays]++;
                    }
                }

            }

            jQuery.each(statistics, function(i, val) {
                var dataObject = {
                    date: i,
                    visits: val
                };
                test.push(dataObject);
            });

            test = sortAtoZ(test);

            jQuery.each(test, function(i, val) {
                var dataObject = {
                    date: val.date,
                    visits: val.visits
                };

                dataSets['days']['all'].push(dataObject);

            });
        }

        function parseCSV2(rows) {
            statistics = {};
            statistics['months'] = {};
            statistics['months']['all'] = {};
            statistics['months']['alca'] = {};
            for (var i = 1; i < rows.length; i++) {
                if (rows[i]) {
                    var column = rows[i].split(",");
                    var labelStatus = column[8];
                    var date = new Date(column[0] * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();


                    var value = column[1];
                    var myDateStringMonths = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2);

                    if (statistics['months']['all'][myDateStringMonths] == null) {
                        statistics['months']['all'][myDateStringMonths] = 1;
                    } else {
                        statistics['months']['all'][myDateStringMonths]++;
                    }

                    if (labelStatus[0] !== "N") {
                        if (statistics['months']['alca'][myDateStringMonths] == null) {
                            statistics['months']['alca'][myDateStringMonths] = 1;
                        } else {
                            statistics['months']['alca'][myDateStringMonths]++;
                        }
                    }
                }
            }

            var tempArray = processedDataAndSorted(statistics['months']['all']);

            jQuery.each(tempArray, function(i, val) {
                var dataObject = {
                    date: val.date,
                    visits: val.visits
                };

                dataSets['months']['all'].push(dataObject);
            });

            var tempArray = processedDataAndSorted(statistics['months']['alca']);
            dataSets['months']['alca'] = [];
            jQuery.each(tempArray, function(i, val) {
                var dataObject = {
                    date: val.date,
                    visits: val.visits
                };

                dataSets['months']['alca'].push(dataObject);
            });

            console.log(dataSets['months']['alca']);
        }

        function processedDataAndSorted(array) {
            var tempArray = [];
            var tempArray2 = [];
            jQuery.each(array, function(i, val) {
                var dataObject = {
                    date: i,
                    visits: val
                };
                tempArray.push(dataObject);
            });
            tempArray = sortAtoZ(tempArray);
            return tempArray
        }

        function parseCSV3(rows) {
            statistics = {};
            for (var i = 1; i < rows.length; i++) {
                if (rows[i]) {
                    var column = rows[i].split(",");
                    var date = new Date(column[0] * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var dateWeek = date.getWeek();
                    var dateDay = date.getDay();

                    if ((dateWeek == 1) && (dateDay < 4) && (month == 12)) {
                        year++;
                    }

                    var myDateStringWeeks = year.toString() + " Week" + dateWeek;
                    if (statistics[myDateStringWeeks] == null) {
                        statistics[myDateStringWeeks] = 1;
                    } else {
                        statistics[myDateStringWeeks]++;
                    }

                }
            }

            jQuery.each(statistics, function(i, val) {
                var year = i.substring(0, 4);
                var weekNumber = i.substring(9, i.length)
                dateGotFromWeek = getDateOfISOWeek(weekNumber, year);
                var dataObject = {
                    date: dateGotFromWeek,
                    visits: val
                };
                test3.push(dataObject);
            });

            test3 = sortAtoZ(test3);

            jQuery.each(test3, function(i, val) {
                var dataObject = {
                    date: val.date,
                    visits: val.visits
                };

                dataSets['weeks']['all'].push(dataObject);
            });
        }

        // this methid is called each time the selected period of the chart is changed
        function handleZoom(event) {
            var startDate = event.startDate;
            var endDate = event.endDate;
            if (allowedToChange) {
                document.getElementById("startDate").value = AmCharts.formatDate(startDate, "DD/MM/YYYY");
                document.getElementById("endDate").value = AmCharts.formatDate(endDate, "DD/MM/YYYY");
            }

            changeGraphType(event);
        }

        function changeGraphType(event) {
            var startIndex = event.startIndex;
            var endIndex = event.endIndex;
            var startDate = document.getElementById("startDate").value;
            startDate = new Date(startDate.substring(3, 5) + "/" + startDate.substring(0, 2) + "/" + startDate.substring(6, 10));
            var endDate = document.getElementById("endDate").value;
            endDate = new Date(endDate.substring(3, 5) + "/" + endDate.substring(0, 2) + "/" + endDate.substring(6, 10));

            var timeDiffBetweenTwoDates = Math.abs(endDate.getTime() - startDate.getTime());
            var daysBetweenTwoDates = Math.ceil(timeDiffBetweenTwoDates / (1000 * 3600 * 24));

            if (allowedToChange) {
                if ((chartDataTypeStatus !== "days") && (daysBetweenTwoDates < 60)) {
                    change('days', chartDataTypeCategory);
                    chartDataTypeStatus = "days";
                } else if ((chartDataTypeStatus !== "weeks") && (daysBetweenTwoDates < 120) && (daysBetweenTwoDates > 62)) {
                    change('weeks', chartDataTypeCategory);
                    chartDataTypeStatus = "weeks";
                } else if ((chartDataTypeStatus !== "months") && (daysBetweenTwoDates > 122)) {
                    change('months', chartDataTypeCategory);
                    chartDataTypeStatus = "months";

                }

                if (allowedToChange) {
                    var selectDropdownMenu = document.getElementById("period");
                    var valueFromDropdownMenu = selectDropdownMenu.options[selectDropdownMenu.selectedIndex].value;
                    window.history.pushState("object", "Title", "?from=" + document.getElementById("startDate").value + "&to=" + document.getElementById("endDate").value + "&type=" + valueFromDropdownMenu);
                }

            }

        }

        function change(value, category) {

            var startDateString = document.getElementById("startDate").value;
            var endDateString = document.getElementById("endDate").value;
            var startDate = stringToDate(startDateString);
            var endDate = stringToDate(endDateString);

            var categoryAxis = chart.categoryAxis;

            if (value == "months") {
                chart.dataProvider = dataSets['months']['all'];
                chart.valueAxes[0].title = "Pull requests per month";
                categoryAxis.minPeriod = "MM";
                $('#period').val(value);
            } else if (value == "weeks") {
                chart.dataProvider = dataSets['weeks']['all'];
                chart.valueAxes[0].title = "Pull requests per week";
                categoryAxis.minPeriod = "WW";
                $('#period').val(value);
            } else if (value == "days") {
                chart.dataProvider = dataSets['days']['all'];
                chart.valueAxes[0].title = "Pull requests per day";
                categoryAxis.minPeriod = "DD";
                $('#period').val(value);
            }

            // categoryAxis.parseDates = false; // as our data is date-based, we set this to true
            categoryAxis.inside = false;
            allowedToChange = false;
            chart.validateNow();
            chart.validateData();
            zooooooom(startDate, endDate);
            allowedToChange = true;
        }

        // this method converts string from input fields to date object
        function stringToDate(str) {
            var dArr = str.split("/");
            var date = new Date(Number(dArr[2]), Number(dArr[1]) - 1, dArr[0]);
            return date;
        }

        // this method is called when user changes dates in the input field
        function changeZoomDates() {
            var startDateString = document.getElementById("startDate").value;
            var endDateString = document.getElementById("endDate").value;
            var startDate = stringToDate(startDateString);
            var endDate = stringToDate(endDateString);
            zooooooom(startDate, endDate);
        }

        function zooooooom(a, b) {
            //console.log("startDate="+a+" endDate=" + b);
            chart.zoomToDates(a, b)
        }

        function getComboA(sel) {
            var value = sel.value;
            change(value, chartDataTypeCategory);
            changeType();
        }

        function getComboB(sel) {
            var cat = sel.value;
            change(chartDataTypeStatus, cat);
            changeType();
        }

        function changeType() {
            var selectDropdownMenu = document.getElementById("period");
            var valueFromDropdownMenu = selectDropdownMenu.options[selectDropdownMenu.selectedIndex].value;
            window.history.pushState("object", "Title", "?from=" + document.getElementById("startDate").value + "&to=" + document.getElementById("endDate").value + "&type=" + valueFromDropdownMenu);
        }

        function sortAtoZ(array) {
            array.sort(function(a, b) {
                if (a.date > b.date) {
                    return 1;
                }
                if (a.date < b.date) {
                    return -1;
                }
                return 0;
            });
            return array
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

        Date.prototype.getWeek = function() {
            var date = new Date(this.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            // January 4 is always in week 1.
            var week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        }

        function getDateOfISOWeek(w, y) {
            var simple = new Date(y, 0, 1 + (w - 1) * 7);
            var dow = simple.getDay();
            var ISOweekStart = simple;
            if (dow <= 4)
                ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else
                ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

            var date = ISOweekStart.getFullYear() + "-" + ('0' + (ISOweekStart.getMonth() + 1)).slice(-2) + "-" + ('0' + ISOweekStart.getDate()).slice(-2);
            return date;
        }