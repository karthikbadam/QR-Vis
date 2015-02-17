/**
 * Created by karthik on 1/8/15.
 */

var gCtx = null;
var gCanvas = null;
var c = 0;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;
var captureCanvas = false;

var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

var msg = null;

var imghtml = '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>' +
    '<div id="imghelp">drag and drop a QRCode here' +
    '<br>or select a file' +
    '<input type="file" onchange="handleFiles(this.files)"/>' +
    '</div>' +
    '</div>';

var vidhtml = '<video id="v" autoplay></video>';

function gotSources(sourceInfos) {

    for (var i = 0; i !== sourceInfos.length; ++i) {

        var sourceInfo = sourceInfos[i];
        var option = document.createElement('option');

        option.value = sourceInfo.id;

        if (sourceInfo.kind === 'audio') {

            option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
            audioSelect.appendChild(option);

        } else if (sourceInfo.kind === 'video') {

            option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);

        } else {

            console.log('Some other kind of source: ', sourceInfo);

        }
    }
}

initiate();

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {

    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length > 0) {
        handleFiles(files);
    }
    else if (dt.getData('URL')) {
        qrcode.decode(dt.getData('URL'));
    }
}

function handleFiles(f) {

    var o = [];

    for (var i = 0; i < f.length; i++) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

                qrcode.decode(e.target.result);
            };
        })(f[i]);

        reader.readAsDataURL(f[i]);
    }
}

function initCanvas(w, h) {

    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);

    var cropper = new CroppingTool();

//    gCanvas.addEventListener('click', function () {
//
//        try {
//            //captureCanvas = true;
//            var decoded = qrcode.decode();
//        }
//
//        catch (e) {
//            console.log(e);
//        };
//
//    }, false);
//
//    gCanvas.addEventListener('touchstart', function () {
//
//        try {
//            //captureCanvas = true;
//            var decoded = qrcode.decode();
//        }
//
//        catch (e) {
//            console.log(e);
//        };
//
//    }, false);

    gCanvas.addEventListener('mousedown', cropper.start, false);
    gCanvas.addEventListener('touchstart', cropper.start, false);

    gCanvas.addEventListener('mousemove', cropper.move, false);
    gCanvas.addEventListener('touchmove', cropper.move, false);

    gCanvas.addEventListener('mouseup', cropper.end, false);
    gCanvas.addEventListener('touchend', cropper.end, false);


    $("body").append('<button id="readQR">Capture</button>');
    $('#readQR').click(function (){
        decodeQR();

    });
}


var c = 0;

function decodeQR() {

    console.log(c);

    c++;

    try {

        // single thread programming for wimps
        var decoded = qrcode.decode();

//        //using web workers!
//        var worker = new Worker("js/worker.js");
//
//        worker.onmessage = function(event) {
//            if (event.data != "") {
//                console.log("qr code read");
//                read(event.data);
//            } else
//                console.log("qr code read empty");
//
//        };
//
//        // get image data
//        var canvas_qr = document.getElementById("qr-canvas");
//        var context = canvas_qr.getContext('2d');
//
//        var offset = $('#highlightRect').offset();
//        var clipperWidth = $('#highlightRect').width();
//        var clipperHeight = $('#highlightRect').height();
//
//        var data = {};
//
//        var imagedata = context.getImageData(offset.left, offset.top, clipperWidth, clipperHeight);
//        data.width = clipperWidth;
//        data.height = clipperHeight;
//
//        worker.postMessage(imagedata, [imagedata.data.buffer]);
    }

    catch (e) {
        console.log(e);
    };

    if (!allLoaded) {

       setTimeout(decodeQR, 250 );
    }
}

function CroppingTool () {

    var _self = this;
    var offset = $('#qr-canvas').offset();
    var offsetx = offset.left;
    var offsety = offset.top;

    this.start = function (event) {

        var x = 0;
        var y = 0;

        event.preventDefault();

        gCtx.fillStyle = "rgba(255, 170, 170, 0.2)";

        if (event.type == "touchstart") {
            x = event.changedTouches[0].clientX - offsetx;
            y = event.changedTouches[0].clientY - offsety;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        _self.startx = x;
        _self.starty = y;

        $('#highlightRect').remove();

        if (!_self.started) {
            $('body').append('<div id="highlightRect" style="background-color: rgba(255, 170, 170, 0.2); border: solid 1px #222; position: absolute; z-index: 100;"></div>');
            $('#highlightRect').width(5);
            $('#highlightRect').height(5);
            $('#highlightRect').offset({left: x, top: y});
        }

        _self.started = true;

    };

    this.move = function (event) {

        event.preventDefault();

        if (_self.started) {
            var x = 0;
            var y = 0;

            if (event.type == "touchmove") {
                x = event.changedTouches[0].clientX;
                y = event.changedTouches[0].clientY;
            } else {
                x = event.clientX;
                y = event.clientY;
            }


            //$('#highlightRect').width(x - _self.startx);
            //$('#highlightRect').height(y - _self.starty);
        }

    };

    this.end = function (event) {

        var x = 0;
        var y = 0;

        event.preventDefault();

        if (event.type == "touchend") {
            x = event.changedTouches[0].clientX - offsetx;
            y = event.changedTouches[0].clientY - offsety;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        if (_self.started) {
            var left = _self.startx;
            var top = _self.starty;

            if (x < _self.startx)
                left = x;

            if (y < _self.starty)
                top = y;

            $('#highlightRect').offset({left: left, top: top});
            $('#highlightRect').width(Math.abs(x - _self.startx));
            $('#highlightRect').height(Math.abs(y - _self.starty));

        }
        _self.started = false;
    };
}


function captureToCanvas() {
    if (stype != 1)
        return;

    if (gUM) {
        try {
            gCtx.drawImage(v, 0, 0, gCanvas.width, gCanvas.height);
            if (!captureCanvas)

                setTimeout(captureToCanvas, 220);

        }
        catch (e) {
            console.log(e);
            if (!captureCanvas)
                setTimeout(captureToCanvas, 220);
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var allLoaded = false;
var counter = 0;
var loader;

function read(a) {
    /*
    var html = "<br>";
    if (a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
        html += "<a target='_blank' href='" + a + "'>" + a + "</a><br>";
    html += "<b>" + htmlEntities(a) + "</b><br><br>";
    document.getElementById("result").innerHTML = html;
    */

    console.log("read frame");

    captureCanvas = false;
    var message =  JSON.parse(a);

    var total = message.t;

    if (msg == null) {

        loader = $("#progressLoader").percentageLoader();

        msg = [];
        for (var i = 0; i < total; i++) {
            msg.push({});
            msg[i].s = "";
            msg[i].filled = false;
        }

    }

    if (!msg[message.l - 1].filled) {
        msg[message.l - 1].s = message.s;
        msg[message.l - 1].filled = true;
    }

    var check = true;
    counter = 0;
    for (var i = 0; i < total; i++) {
        if (!msg[i].filled)
            check = false;
        else
            counter++;
    }

    loader.setProgress(counter/total);

    if (check) {
        allLoaded = true;
        var messagePassed = "";
        for (var i = 0; i < total; i++) {
            messagePassed = messagePassed + msg[i].s;
        }
        alert(messagePassed);
        //allLoaded = false;
    }
    //console.log("Frame: "+message.l+" ;Total:"+message.t);
}

function isCanvasSupported() {

    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));

}

function success(stream) {
    window.stream = stream; // make stream available to console

    if (webkit) {
        v.src = window.webkitURL.createObjectURL(stream);
        v.play();
    } else if (moz) {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM = true;

    setTimeout(captureToCanvas, 500);

}

function error(error) {
    gUM = false;
    return;
}

function setwebcam() {


    var n = navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v = document.getElementById("v");
    if (!!window.stream) {
        v.src = null;
        window.stream.stop();
    }

    var audioSource = audioSelect.value;
    var videoSource = videoSelect.value;
//    var constraints = {
//        audio: {
//            optional: [{sourceId: audioSource}]
//        },
//        video: {
//            optional: [{sourceId: videoSource}]
//        }
//    };

    var constraints = {
        audio: false,
        video: {
            optional: [{sourceId: videoSource}]
        }
    };

    if (n.getUserMedia) {

        n.getUserMedia(constraints, success, error);

    } else if (n.webkitGetUserMedia) {

        webkit = true;
        n.webkitGetUserMedia(constraints, success, error);

    } else if (n.mozGetUserMedia) {

        moz = true;
        n.mozGetUserMedia(constraints, success, error);

    }

    document.getElementById("qrimg").style.opacity = 0.2;
    document.getElementById("webcamimg").style.opacity = 1.0;

    stype = 1;

    setTimeout(captureToCanvas, 500);
}

function replaceWebcam() {
    var n = navigator;
    v = document.getElementById("v");
    if (!!window.stream) {
        v.src = null;
        window.stream.stop();
    }

    var audioSource = audioSelect.value;
    var videoSource = videoSelect.value;

    var constraints = {
        audio: false,
        video: {
            optional: [{sourceId: videoSource}]
        }
    };

    if (n.getUserMedia) {

        n.getUserMedia(constraints, success, error);

    } else if (n.webkitGetUserMedia) {

        webkit = true;
        n.webkitGetUserMedia(constraints, success, error);

    } else if (n.mozGetUserMedia) {

        moz = true;
        n.mozGetUserMedia(constraints, success, error);

    }

    document.getElementById("qrimg").style.opacity = 0.2;
    document.getElementById("webcamimg").style.opacity = 1.0;

    stype = 1;

    setTimeout(captureToCanvas, 500);
}


audioSelect.onchange = replaceWebcam;
videoSelect.onchange = replaceWebcam;

//function setimg() {
//
//    document.getElementById("result").innerHTML = "";
//
//    if (stype == 2)
//        return;
//
//    document.getElementById("outdiv").innerHTML = imghtml;
//
//    document.getElementById("qrimg").style.opacity = 1.0;
//    document.getElementById("webcamimg").style.opacity = 0.2;
//
//    var qrfile = document.getElementById("qrfile");
//    qrfile.addEventListener("dragenter", dragenter, false);
//    qrfile.addEventListener("dragover", dragover, false);
//    qrfile.addEventListener("drop", drop, false);
//
//    stype = 2;
//}

function initiate () {
if  (isCanvasSupported() && window.File && window.FileReader && typeof MediaStreamTrack != 'undefined') {

        setwebcam();
        var width = $(document).width();
        var height = $(document).height();

        initCanvas(width, height);
        qrcode.callback = read;
        document.getElementById("mainbody").style.display = "inline";
        MediaStreamTrack.getSources(gotSources);

    } else {

        document.getElementById("mainbody").style.display = "inline";
        document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
            '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
            '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}


$(document).ready(function() {

    $('#captureButton').click(function() {

        //show video if not present
        if (!$('#outdiv').html()) {

            $('qr-canvas').show();
            initiate();
        }

    });

    $('#analyzeButton').click(function() {

        //show blank screen for visualization
        if ($('#outdiv').html()) {
            $('#outdiv').innerHTML = "";
            $('qr-canvas').hide();
        }


    });

});