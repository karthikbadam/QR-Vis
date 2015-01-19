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

var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

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

if (isCanvasSupported() && window.File && window.FileReader && typeof MediaStreamTrack != 'undefined') {

    setwebcam();

    initCanvas(800, 600);
    qrcode.callback = read;
    document.getElementById("mainbody").style.display = "inline";
    MediaStreamTrack.getSources(gotSources);

} else {

    document.getElementById("mainbody").style.display = "inline";
    document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
        '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
        '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
}


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

}


function captureToCanvas() {
    if (stype != 1)
        return;

    if (gUM) {
        try {
            gCtx.drawImage(v, 0, 0);
            try {
                var decoded = qrcode.decode();

            }

            catch (e) {
                console.log(e);
                setTimeout(captureToCanvas, 500);
            }
            ;
        }
        catch (e) {
            console.log(e);
            setTimeout(captureToCanvas, 500);
        }
        ;
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a) {
    /*
    var html = "<br>";
    if (a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
        html += "<a target='_blank' href='" + a + "'>" + a + "</a><br>";
    html += "<b>" + htmlEntities(a) + "</b><br><br>";
    document.getElementById("result").innerHTML = html;
    */

    alert(a);
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

function setimg() {

    document.getElementById("result").innerHTML = "";

    if (stype == 2)
        return;

    document.getElementById("outdiv").innerHTML = imghtml;

    document.getElementById("qrimg").style.opacity = 1.0;
    document.getElementById("webcamimg").style.opacity = 0.2;

    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);
    qrfile.addEventListener("dragover", dragover, false);
    qrfile.addEventListener("drop", drop, false);

    stype = 2;
}

$(document).ready(function() {

    $('#captureButton').onclick(function() {

        //show video if not present
        if (!$('#outdiv').html()) {

            $('qr-canvas').hide();

            if (isCanvasSupported() && window.File && window.FileReader && typeof MediaStreamTrack != 'undefined') {

                setwebcam();

                initCanvas(800, 600);
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

    });

    $('#analyzeButton').onclick(function() {

        //show blank screen for visualization
        if ($('#outdiv').html()) {
            $('#outdiv').innerHTML = "";
            $('qr-canvas').hide();
        }


    });

});