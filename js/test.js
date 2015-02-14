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


    var barGraph = {
        "width": 400,
        "height": 200,
        "padding": {"top": 10, "left": 30, "bottom": 20, "right": 10},
        "data": [
            {
                "name": "table",
                "values": [
                    {"x":"A", "y":28}, {"x":"B", "y":55}, {"x":"C", "y":43},
                    {"x":"D", "y":91}, {"x":"E", "y":81}, {"x":"F", "y":53},
                    {"x":"G", "y":19}, {"x":"H", "y":87}, {"x":"I", "y":52}
                ]
            }
        ],
        "scales": [
            {"name":"x", "type":"ordinal", "range":"width", "domain":{"data":"table", "field":"data.x"}},
            {"name":"y", "range":"height", "nice":true, "domain":{"data":"table", "field":"data.y"}}
        ],
        "axes": [
            {"type":"x", "scale":"x"},
            {"type":"y", "scale":"y"}
        ],
        "marks": [
            {
                "type": "rect",
                "from": {"data":"table"},
                "properties": {
                    "enter": {
                        "x": {"scale":"x", "field":"data.x"},
                        "width": {"scale":"x", "band":true, "offset":-1},
                        "y": {"scale":"y", "field":"data.y"},
                        "y2": {"scale":"y", "value":0}
                    },
                    "update": { "fill": {"value":"steelblue"} },
                    "hover": { "fill": {"value":"red"} }
                }
            }
        ]
    };




    var message = [{
            l: 1,
            t: 6,
            s: "great battle foretold to ultimately result in the death of a number of major figures, various natural disasters, and the submersion of the world in water."
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
    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});

    qrcode.makeCode(JSON.stringify(message[1]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});

    qrcode.makeCode(JSON.stringify(message[2]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});

    qrcode.makeCode(JSON.stringify(message[3]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});

    qrcode.makeCode(JSON.stringify(message[4]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});

    qrcode.makeCode(JSON.stringify(message[5]));

    gif.addFrame(document.getElementById("karthikIsAwesome"), {"copy": true, "delay": 300});


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