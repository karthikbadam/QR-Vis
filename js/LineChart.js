/**
 * Created by karthik on 1/6/15.
 */

function LineChart (options) {

    var _self = this;

    _self.data = options.data;
    _self.symbol = options.symbol;

    _self.margin = {
        top: 60,
        right: 40,
        bottom: 60,
        left: 40
    };

    _self.width = (600 - _self.margin.left - _self.margin.right),
        _self.height = (500 - _self.margin.top - _self.margin.bottom);


    _self.metaData = {
        chart: "Line",
        x: "",
        y: "",
        color: "black"
    }

    _self.div = d3.select("body").append("div").attr("id", "chart_"+_self.symbol).attr("class", "chart");

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
        return stock["Close"];
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
            return _self.y(d["Close"]);
        });

    //general definitions to keep everything within boundaries
    _self.svg.append("defs")
        .append("clipPath").attr("id", "clip-" + _self.symbol)
        .append("rect")
        .attr("width", _self.width).attr("height", _self.height);


    //draws the path line
    _self.chartContainer = _self.svg.append("g")
        .attr("width", _self.width).attr("height", _self.height);

    _self.chartContainer.append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip-" + _self.symbol + ")")
        .data([_self.data])
        .attr("d", _self.line)
        .attr("stroke", "#444")
        .attr("fill", "transparent")
        .attr("stroke-width", "2px")
        .attr("z-index", 1);


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

    var position = $("#chart_"+_self.symbol).position();
    var qrLeft = position.left + _self.width/2 - 75;
    var qrTop =  position.top + 10;

    $("#chart_"+_self.symbol).append('<div id="qrcodeLine" class="qrcode" style="left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')

    //make QR code with the chart
    _self.qrcode = new QRCode(document.getElementById("qrcodeLine"), {
        width : 200,
        height : 200
    });

    _self.qrcode.makeCode(JSON.stringify(_self.metaData));

}