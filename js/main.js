/**
 * Created by karthik on 1/6/15.
 */

var googStock = "data/GOOG.csv";
var stockList = "data/stocks.csv";

var closeValues = [];
var keys = null;
var parseDate = d3.time.format("%Y-%m-%d").parse;

var stockSymbols = [];
var companyNames = [];

var stockData = {};


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
        var linechartObject = new LineChart({
            data: data,
            companyName: "Google",
            symbol: "GOOG"
        });

        //create a bar chart
        //creates a stock object for future reference
        var barchartObject = new BarChart({
            data: data,
            companyName: "Google",
            symbol: "GOOG"
        });

    });

    d3.csv(stockList, function(error, data) {

        //reading the data
        data.forEach(function (d) {
            //collects all stock values into a data structure
            stockSymbols.push(d.symbols);
            companyNames.push(d.company);
        });

        stockSymbols.forEach(function (stockId) {

            d3.csv("data/"+stockId+".csv", function (data) {

                stockData[stockId] = [];

                data.forEach(function(stock_instance) {

                    //convert date format
                    stock_instance["Date"] = parseDate(String(stock_instance["Date"]));

                    //closing value
                    stock_instance["Close"] = +stock_instance["Close"];
                    stock_instance["Volume"] = +stock_instance["Volume"];

                    stock_instance['Normalized'] = stock_instance["Close"];

                    stockData[stockId].push(stock_instance["Close"]);
                });
            });
        });

    })


});

