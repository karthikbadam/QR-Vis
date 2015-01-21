/**
 * Created by karthik on 1/20/15.
 */

function BarChart (options) {

    var _self = this;

    _self.data = options.data;
    _self.symbol = options.symbol;

    _self.margin = {
        top: 60,
        right: 40,
        bottom: 60,
        left: 40
    };

    _self.width = (800 - _self.margin.left - _self.margin.right),
        _self.height = (280 - _self.margin.top - _self.margin.bottom);


    _self.metaData = {
        chart: "Bar",

    }

    _self.div = d3.select("body").append("div").attr("id", "bar-chart_"+_self.symbol);

    _self.svg = _self.div.append("svg")
        .attr("width", _self.width + _self.margin.left - _self.margin.right)
        .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (_self.margin.left) + "," + _self.margin.top + ")");


    _self.x = d3.time.scale()
        .range([0, _self.width]);

    _self.y = d3.scale.linear()
        .range([_self.height, 0]);

    _self.x.domain(d3.extent(_self.data, function(stock) {
        return stock["Date"];
    }));

    _self.y.domain(d3.extent(_self.data, function(stock) {
        return stock["Volume"];
    }));

    //creates x and y axis
    _self.xAxis = d3.svg.axis()
        .scale(_self.x)
        .orient("bottom").ticks(7)
        .tickFormat(function(d) {
            return d3.time.format('%b%d/%y')(new Date(d));
        });

    _self.yAxis = d3.svg.axis()
        .scale(_self.y)
        .orient("left").ticks(6);

    //creates the mapping function for path line in SVG
    _self.line = d3.svg.line()
        .interpolate("Monotone")
        .x(function(d) {
            return _self.x(d["Date"]);
        })
        .y(function(d) {
            return _self.y(d["Volume"]);
        });

    //general definitions to keep everything within boundaries
    _self.svg.append("defs")
        .append("clipPath").attr("id", "clip-" + _self.symbol)
        .append("rect")
        .attr("width", _self.width).attr("height", _self.height);



}