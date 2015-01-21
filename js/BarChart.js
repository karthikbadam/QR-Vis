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
        _self.height = (200 - _self.margin.top - _self.margin.bottom);


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

    //general definitions to keep everything within boundaries
    _self.svg.append("defs")
        .append("clipPath").attr("id", "bar-clip-" + _self.symbol)
        .append("rect")
        .attr("width", _self.width).attr("height", _self.height);

    _self.chartContainer = _self.svg.selectAll(".bar")
        .data(_self.data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("clip-path", "url(#bar-clip-" + _self.symbol + ")")
        .attr("x", function(d) {
            return _self.x(d["Date"]);
        })
        .attr("width", 2)
        .attr("y", function(d) {
            return _self.y(d["Volume"]);
        })
        .attr("height", function(d) {
            return _self.height - _self.y(d["Volume"]);
        })
        .attr("fill", "#444")
        .attr("fill-opacity", 0.3);

    //draws the axis
    _self.chartContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + _self.height + ")")
        .call(_self.xAxis);

    _self.chartContainer.append("g")
        .attr("class", "y axis")
        .call(_self.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 4)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    //draws the text -- name of the stock
    _self.chartContainer.append("text")
        .attr("transform", "translate(" + 10 + ",0)")
        .text(_self.symbol)
        .attr("stroke-opacity", 0.3)
        .attr("fill-opacity", 0.3)
        .attr("stroke","#F00")
        .attr("font-size", "11px");


    //make QR code with the chart
    _self.qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 150,
        height : 150
    });

    _self.qrcode.makeCode(JSON.stringify(_self.metaData));

}