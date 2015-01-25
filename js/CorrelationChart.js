/**
 * Created by karthik on 1/24/15.
 */

function CorrelationChart (options) {
    var _self = this;

    _self.stockData = options.stockData;
    _self.keys = Object.keys(stockData);

    for (var i = 0; i < _self.keys.length; i++) {
        for (var j = i+1; j < _self.keys.length; j++) {
            var key1 = _self.keys[i];
            var key2 = _self.keys[j];

            var s1 = stockId[key1];
            var s2 = stockId[key2];

            var correlation = CorrelationChart.getCorrelationValue (s1, s2);
        }
    }

}

CorrelationChart.prototype.getCorrelationValue = function (s1, s2) {
    

}