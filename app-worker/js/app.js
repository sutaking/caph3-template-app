var myApp = angular
.module('myApp', ['caph.focus'])
.controller('myController', ['$scope', 'focusController', 'FocusUtil', '$timeout',function($scope, focusController, FocusUtil, $timeout) {

    var toggle = function(t) {
        var start = $('#start');
        var stop = $('#stop');
        
        if (t) {
            focusController.enable(start);
            focusController.enable(stop);
        }
        else {
            focusController.disable(start);
            focusController.disable(stop);
        }
        
    }

    $scope.playSound = function() {
        //console.log($('#audio-sound'))
        $('#audio-sound')[0].play();
    }

    let audio = $('#audio-sound')[0];
    audio.onplay = function() {
        t2 = performance.now();
        log(`Muisc play: ${t2.toFixed(2)}, timeing: ${(t2-t1).toFixed(2)}`);
        t1 = 0;
    }

    $scope.onClick = function(e) {
        console.log(e);
        $(`#${e}`).addClass('selected');
        $timeout(function() {
            $(`#${e}`).removeClass('selected');
        },300);

        switch (e) {
            case 'version':
                //var version = window.webapis.audiocapture.getVersion();
                log("The plugin version is : " + version);             
                break;
            case 'add':
                toggle(true);
                log("Before invoke addAudioBufferListener");
                //window.webapis.audiocapture.removeAudioBufferListener(listenerID);
                //listenerID = window.webapis.audiocapture.addAudioBufferListener(getAudioBuffer);
                log("The Audio Buffer Listener ID is : ~~~" + listenerID);
                break;
            case 'start':
                //window.webapis.audiocapture.startCapture();
                log("You click the start button");
                break;
            case 'stop':
                //window.webapis.audiocapture.stopCapture();
		        log("You click the stop button");
                break;
            case 'remove':
                toggle(false);                
                //window.webapis.audiocapture.removeAudioBufferListener(listenerID);
                log("RemoveAudioBufferListener will be invoked~");
                break;
            case 'play':
                isCanvas = true;
                isFeed = true;
                t4 = 0;
                log('-------- start Timing ------------');
                t1 = performance.now();
                log(`Play click: ${t1.toFixed(2)}`);
                //audio.src = './audio.mp3';
                //audio.play();
                
                ws.send('start');
                break;
            default:
                return;
        }       
    }
}]);

var result = ''; // for print log
var listenerID = 0;
var player;
var isCanvas, isFeed = false;
var t1, t2, t3, t4;

var myWorker, ws;

window.onload = function () {
    // TODO:: Do your initialization job

	log('[App status] onload');

	//init player
	player = new PCMPlayer({
		encoding: '16bitInt',
		channels: 2,
		sampleRate: 44100,//
		flushingTime: 100
	});

    //window.webapis.audiocapture.getVersion();
    const url = 'ws://109.123.120.200:5000';
    ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('open', event => (console.log(`[${new Date()}] ws server open sucess!`)));
    ws.addEventListener('close', event => (console.log(`[${new Date()}] ws server closed!`)));
    ws.addEventListener('message', event => {
        /*var isFeed = false;
        if(!isFeed) {
            console.log(`feed data: ${performance.now()}`);
            isFeed = true;
        }*/
        
        let raw = new Uint8Array(event.data);
        myWorker.postMessage(raw);
        //player.feed(raw);
    });

    myWorker = new Worker('js/worker.js');

    myWorker.onmessage = function(e) {
        //result.textContent = e.data;
        //console.log(`Message received from worker ${e.data}`);
        //player.feed(e.data);
        //console.log(e.data[0]);
        player.testFlush(e.data);
        
    }
    
};

//for printing log
function log(string) {
    //result = result + ' <br> ' + string;
    result = `
    ${string}<br>
    ${result}
    `
    //console.log(result);
 
    let elem = document.getElementById('result');
    elem.innerHTML = result;
}

var c1;
function getAudioBuffer(data) {
    //console.log(`${ (performance.now()-c1).toFixed()} ms`);
    //console.log("getAudioBuffer~~~~~~~~~~~~~~~~~~  data:[" + data.byteLength + "]");
    var audiodata = new Uint16Array(data);
    //player.feed(audiodata);
    myWorker.postMessage(audiodata);
    //c1 = performance.now();
}

