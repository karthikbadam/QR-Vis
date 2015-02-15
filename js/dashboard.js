/**
 * Created by karthik on 2/14/15.
 */

var content = [
    'scatter',
//    'jobs',
//    'arc'
];

var ved = {
    version: 0.1,
    data: undefined,
    renderType: "svg"
};

var qrLeft = -1050;
var qrTop =  10;

var NUMBER_OF_FRAMES = 6;

function stringSplitter (data) {

    var size = Math.floor(data.length/NUMBER_OF_FRAMES);
    var returnArray = new Array(NUMBER_OF_FRAMES);
    var offset;

    for (var i = 0; i < NUMBER_OF_FRAMES; i++) {
        offset = i * size;

        if (i == NUMBER_OF_FRAMES - 1)
            returnArray[i] = data.substr(offset, data.length - offset);
        else
            returnArray[i] = data.substr(offset, size);

        console.log(i+":"+returnArray[i].length +":" + returnArray[i]);
    }

    return returnArray;
}


$(document).ready (function () {
    // Set base directory
    //vg.config.baseURL = "../";

    $("body").append('<div id="qrAnim" class="qrcode" style= "position: absolute; left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')
    var qrcode = new QRCode(document.getElementById("qrAnim"), {
        width : 600,
        height : 600,
        id : "QRcode"
    });



    content.forEach(function (filename) {

        //create a div for the visualization
        $("body").append('<div id="viz-'+ filename + '" class= "viz" ></div>');

        var divID = "#viz-"+ filename;
        //Vega to create visualization

        d3.xhr("spec/"+filename+".json", function(error, response) {

            ved.spec = JSON.parse(response.responseText);

            vg.parse.spec(ved.spec, function(chart) {
                d3.select(divID).selectAll("*").remove();
                var view = chart({
                    el: divID,
                    data: ved.data,
                    renderer: ved.renderType
                });

                (ved.view = view).update();

            });

            //add QR code
            var data = JSON.stringify(JSONC.compress( JSON.parse(response.responseText) ));

            //JSON.stringify(response.responseText);
            console.log(data.length);

            var gif = new GIF({
                workers: 40,
                quality: 10
            });

            var packets = stringSplitter(data);

            for (var i = 0; i < packets.length; i++) {

                var d = {};
                d.l = i + 1;
                d.t = packets.length;
                d.s = String(packets[i]);

                qrcode.makeCode(JSON.stringify(d));

                // or a canvas element
                gif.addFrame(document.getElementById("QRcode"), {"copy": true, "delay": 300});
            }

            gif.on('finished', function(blob) {
                $('#viz-'+filename).append('<img id="QRCodesAnim-'+ filename +'" style="padding: 100px;" src="'+URL.createObjectURL(blob)+'" </img>')

            });

            gif.render();

        });

    });


});


