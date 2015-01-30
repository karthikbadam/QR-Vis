/**
 * Created by karthik on 1/29/15.
 */


$(document).ready(function() {

    var gif = new GIF({
        workers: 2,
        quality: 10
    });

    var qrLeft = 75;
    var qrTop =  10;

    $("body").append('<div id="qrAnim" class="qrcode" style="left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')

    //make QR code with the chart
    var qrcode = new QRCode(document.getElementById("qrAnim"), {
        width : 200,
        height : 200
    });

    qrcode.makeCode("Karthik Karthik Karthik Karthik Karthik Karthik Karthik Karthik Karthik Karthik Karthik Karthik");

    // add a image element
    //gif.addFrame(imageElement);

    // or a canvas element
    gif.addFrame(document.getElementById("QRcanvas"), {"copy": true, "delay": 1000});

    qrcode.makeCode("Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah");

    gif.addFrame(document.getElementById("QRcanvas"));

    // or copy the pixels from a canvas context
    //gif.addFrame(ctx, {copy: true});

    gif.on('finished', function(blob) {
        $('body').append('<img id="QRCodesAnim" style="position: absolute; left: 500px; top: 500px" src="'+URL.createObjectURL(blob)+'"</img>')
        //window.open(URL.createObjectURL(blob));
    });

    gif.render();

});