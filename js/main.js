/**
 * Created by karthik on 1/6/15.
 */

var googStock = "data/GOOG.csv";

var closeValues = [];
var keys = null;
var parseDate = d3.time.format("%Y-%m-%d").parse;


$(document).ready(function() {

    d3.csv(googStock, function (error, data) {

        //reading the data
        data.forEach(function (d) {
            if (keys == null) {
                keys = Object.keys(d);
            }
            d["Date"] = parseDate(String(d["Date"]));
            d["Close"] = +d["Close"];
            d["Volume"] = +d["Volume"];

            closeValues.push(d["Close"]);
        });

        //create a line chart
        //creates a stock object for future reference
        var chartObject = new LineChart({
            data: data,
            companyName: "Google",
            symbol: "GOOG"
        });




    });



});

