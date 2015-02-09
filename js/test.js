/**
 * Created by karthik on 1/29/15.
 */


$(document).ready(function() {

    var gif = new GIF({
        workers: 5,
        quality: 10
    });

    var qrLeft = -1050;
    var qrTop =  10;

    $("body").append('<div id="qrAnim" class="qrcode" style="left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')

    //make QR code with the chart
    var qrcode = new QRCode(document.getElementById("qrAnim"), {
        width : 600,
        height : 600,
        idName : "karthikIsAwesome"
    });

    qrcode.makeCode(JSON.stringify({
        l: 1,
        t: 3,
        s: "great battle foretold to ultimately result in the death of a number of major figures (including the gods Odin, Thor, Tyr, Freyr, Heimdallr, and Loki), the occurrence of various natural disasters, and the subsequent submersion of the world in water."
    }));

    // or a canvas element
    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 2000});

    qrcode.makeCode(JSON.stringify({
        l: 2,
        t: 3,
        s: "Afterward, the world will resurface anew and fertile, the surviving and returning gods will meet, and the world will be repopulated by two human survivors."
    }));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 2000});

    qrcode.makeCode(JSON.stringify({
        l: 3,
        t: 3,
        s: "Ragnarok is an important event in the Norse canon, and has been the subject of scholarly discourse and theory"
    }));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 2000});


    // or copy the pixels from a canvas context
    //gif.addFrame(ctx, {copy: true});

    gif.on('finished', function(blob) {
        $('body').append('<img id="QRCodesAnim" style="position: absolute; left: 10%; top: 10%" src="'+URL.createObjectURL(blob)+'"</img>')
        //window.open(URL.createObjectURL(blob));
    });

    gif.render();

});