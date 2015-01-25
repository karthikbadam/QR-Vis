/**
 * Created by karthik on 1/24/15.
 */

function CorrelationChart(options) {
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

        for (var j = i + 1; j < _self.keys.length; j++) {
            var key1 = _self.keys[i];
            var key2 = _self.keys[j];

            var s1 = _self.stockData[key1];
            var s2 = _self.stockData[key2];

            var correlation = _self.getCorrelationValue(s1, s2);
            console.log(key1 + ", " + key2 + ": " + correlation);

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

    var radius = _self.radius = 7;

    _self.width = (600 - _self.margin.left - _self.margin.right),
        _self.height = (600 - _self.margin.top - _self.margin.bottom);

    _self.metaData = {
        chart: "Correlation",
        x: "",
        y: "",
        color: "black"
    }

    _self.div = d3.select("body").append("div").attr("id", "correlation-chart").attr("class", "chart");

    _self.svg = _self.div.append("svg")
        .attr("width", _self.width + _self.margin.left - _self.margin.right)
        .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (_self.margin.left) + "," + _self.margin.top + ")");

    _self.force = d3.layout.force()
        .charge(-120)
        .linkDistance(function (d) {
            return (-300 * d.value + 320);
        })
        .size([_self.width, _self.height]);

    _self.force.nodes(_self.nodes)
        .links(_self.links)
        .start();

    _self.link = _self.svg.selectAll(".link")
        .data(_self.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", function (d) {
            if (d.value > 0) {
                return "#90EE90";
            } else {
                return "#F08080";
            }
        })
        .attr("stroke-width", "0.5px");

    _self.node = _self.svg.selectAll(".node")
        .data(_self.nodes)
        .enter()
        .append("g")
        .attr("class", "node");


    _self.node.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius)
        .style("fill", function (d) {
            return "#222";
        });
    //.call(_self.force.drag);

    _self.node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name
        });

    _self.force.on("tick", function () {
        _self.link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        _self.node.attr("transform", function (d) {
            d.x = Math.max(radius, Math.min(_self.width - 30 - radius, d.x));
            d.y = Math.max(radius, Math.min(_self.height - radius, d.y));
            return "translate(" + d.x + "," + d.y + ")";
        });

        //.attr("x", function(d) { return d.x = Math.max(radius, Math.min(_self.width - 30 - radius, d.x)); })
        //.attr("y", function(d) { return d.y = Math.max(radius, Math.min(_self.height - radius, d.y)); });
    });

    var position = $("#correlation-chart").position();
    var qrLeft = position.left - 200;
    var qrTop =  position.top + _self.height - 200;

    $("#correlation-chart").append('<div id="qrcodeCorrelation" class="qrcode" style="left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')

    //make QR code with the chart
    _self.qrcode = new QRCode(document.getElementById("qrcodeCorrelation"), {
        width : 200,
        height : 200
    });

    _self.qrcode.makeCode(JSON.stringify(_self.metaData));


}

CorrelationChart.prototype.getKeys = function () {
    var _self = this;
    return _self.keys;

}

CorrelationChart.prototype.getCorrelationValue = function (x, y) {
    var shortestArrayLength = 0;

    if (x.length == y.length) {
        shortestArrayLength = x.length;

    } else if (x.length > y.length) {
        shortestArrayLength = y.length;

    } else {
        shortestArrayLength = x.length;

    }

    var xy = [];
    var x2 = [];
    var y2 = [];

    for (var i = 0; i < shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);

    }

    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;

    for (var i = 0; i < shortestArrayLength; i++) {
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