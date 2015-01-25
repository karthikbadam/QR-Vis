/**
 * Created by karthik on 1/24/15.
 */

function CorrelationChart (options) {
    var _self = this;

    _self.stockData = options.stockData;
    _self.keys = Object.keys(stockData);

    _self.nodes = [];
    _self.links = [];

    for (var i = 0; i < _self.keys.length; i++) {

        var node1 = {};
        node1.name = _self.keys[i];
        node1.id = i;
        _self.nodes.push(node1);

        for (var j = i+1; j < _self.keys.length; j++) {
            var key1 = _self.keys[i];
            var key2 = _self.keys[j];

            var s1 = _self.stockData[key1];
            var s2 = _self.stockData[key2];

            var correlation = _self.getCorrelationValue (s1, s2);
            console.log(key1+", "+key2+": "+correlation);

            var link1 = {};
            link1.source = i;
            link1.target = j;
            link1.value = correlation;

            _self.links.push(link1);
        }
    }
}

CorrelationChart.prototype.createChart = function () {
    var _self = this;

    _self.margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    };

    _self.width = (500 - _self.margin.left - _self.margin.right),
        _self.height = (800 - _self.margin.top - _self.margin.bottom);

    _self.metaData = {
        chart: "Correlation",
        x: "",
        y: "",
        color: "black"
    }

    _self.div = d3.select("body").append("div").attr("id", "correlation-chart_"+_self.symbol);

    _self.svg = _self.div.append("svg")
        .attr("width", _self.width + _self.margin.left - _self.margin.right)
        .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (_self.margin.left) + "," + _self.margin.top + ")");

    _self.force = d3.layout.force()
        .charge(-120)
        .linkDistance(function(d) { return 320 - 160 * d.value })
        .size([_self.width, _self.height]);

    _self.force.nodes(_self.nodes)
        .links(_self.links)
        .start();

    _self.link = _self.svg.selectAll(".link")
        .data(_self.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "0.5px");

    _self.node = _self.svg.selectAll(".node")
        .data(_self.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 7)
        .style("fill", function(d) { return color(d.id); })
        .call(_self.force.drag);

    _self.node.append("title")
        .text(function(d) { return d.name; });

    _self.force.on("tick", function() {
        _self.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        _self.node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
}

CorrelationChart.prototype.getKeys = function () {
    var _self = this;
    return _self.keys;

}

CorrelationChart.prototype.getCorrelationValue = function (x, y) {
    var shortestArrayLength = 0;

    if(x.length == y.length) {
        shortestArrayLength = x.length;

    } else if(x.length > y.length) {
        shortestArrayLength = y.length;

    } else {
        shortestArrayLength = x.length;

    }

    var xy = [];
    var x2 = [];
    var y2 = [];

    for(var i = 0; i < shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);

    }

    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;

    for(var i = 0; i < shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];

    }

    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);

    var correlation = step1 / step4;

    if (isNaN(correlation)) return 0;
    return correlation;
}