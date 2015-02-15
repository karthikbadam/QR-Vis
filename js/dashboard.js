/**
 * Created by karthik on 2/14/15.
 */

var content = [
    'scatter',
    'jobs',
    'arc'
];

var ved = {
    version: 0.1,
    data: undefined,
    renderType: "svg"
};

var NUMBER_OF_FRAMES = 6;

function stringSplitter (data) {

    var size = Math.ceil(data.length/NUMBER_OF_FRAMES);
    var returnArray = new Array(NUMBER_OF_FRAMES);
    var offset;

    for (var i = 0; i < NUMBER_OF_FRAMES; i++) {
        offset = i * NUMBER_OF_FRAMES;
        if (i == NUMBER_OF_FRAMES - 1)
            returnArray[i] = data.substr(offset, data.length - 1);
        else
            returnArray[i] = data.substr(offset, offset + NUMBER_OF_FRAMES);
    }

    return returnArray;
}


$(document).ready (function () {
    // Set base directory
    //vg.config.baseURL = "../";

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
            var data = JSON.stringify(response.responseText);
            var qrcode = new QRCode(document.getElementById("viz-"+ filename), {
                width : 600,
                height : 600,
                id : "QR-"+ filename
            });

            var gif = new GIF({
                workers: 10,
                quality: 10
            });

            var packets = stringSplitter(data);

            for (var i = 0; i < packets.length; i++) {
                qrcode.makeCode(JSON.stringify(packets[i]));

                // or a canvas element
                gif.addFrame(document.getElementById("QR-"+ filename), {"copy": true, "delay": 200});
            }


        });

    });


});


