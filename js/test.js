/**
 * Created by karthik on 1/29/15.
 */


$(document).ready(function() {

    var gif = new GIF({
        workers: 10,
        quality: 10
    });

    var qrLeft = -1050;
    var qrTop =  10;

    var message = [{
            l: 1,
            t: 6,
            s: "great battle foretold to ultimately result in the death of a number of major figures (including the gods Odin, Thor..), the occurrence of various natural disasters, and the subsequent submersion of the world in water."
        },

        {
            l: 2,
            t: 6,
            s: " Afterward, the world will resurface anew and fertile, the surviving and returning gods will meet, and the world will be repopulated by two human survivors."
        },

        {
            l: 3,
            t: 6,
            s: " Ragnarok is an important event in the Norse canon, and has been the subject of scholarly discourse and theory"
        },

        {
            l: 4,
            t: 6,
            s: " The event is attested primarily in the Poetic Edda, compiled in the 13th century from earlier traditional sources, and the Prose Edda."
        },

        {
            l: 5,
            t: 6,
            s: " In the Prose Edda, and a single poem in the Poetic Edda, the event is referred to as"
        },

        {
            l: 6,
            t: 6,
            s: " The Old Norse compound ragnarok has a long history of interpretation. Its first element, ragna, is unproblematic, being the genitive plural of regi"
        }
    ];

    $("body").append('<div id="qrAnim" class="qrcode" style="left:'+ qrLeft +'px; top:' + qrTop + 'px;"></div>')

    //make QR code with the chart
    var qrcode = new QRCode(document.getElementById("qrAnim"), {
        width : 600,
        height : 600,
        id : "karthikIsAwesome"
    });

    qrcode.makeCode(JSON.stringify(message[0]));

    // or a canvas element
    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});

    qrcode.makeCode(JSON.stringify(message[1]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});

    qrcode.makeCode(JSON.stringify(message[2]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});

    qrcode.makeCode(JSON.stringify(message[3]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});

    qrcode.makeCode(JSON.stringify(message[4]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});

    qrcode.makeCode(JSON.stringify(message[5]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 100});


    var characterCount = 0;
    for (var i = 0; i < message.length; i++) {
        characterCount = characterCount + JSON.stringify(message[i]).length;
    }
    console.log("Total CHaracters" + characterCount);

    // or copy the pixels from a canvas context
    //gif.addFrame(ctx, {copy: true});

    gif.on('finished', function(blob) {
        $('body').append('<img id="QRCodesAnim" style="position: absolute; left: 10%; top: 10%" src="'+URL.createObjectURL(blob)+'"</img>')
        //window.open(URL.createObjectURL(blob));
    });

    gif.render();

});