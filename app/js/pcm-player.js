function PCMPlayer(option) {
    this.init(option);
}

var analyser;
var Context;
var canvas;
var capYPositionArray;
var width;
var height;
var gradient;
var setTime;

PCMPlayer.prototype.init = function(option) {
    var defaults = {
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000
    };
    this.option = Object.assign({}, defaults, option);
    this.samples = new Float32Array();
    this.flush = this.flush.bind(this);
    this.interval = setInterval(this.flush, this.option.flushingTime);
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
    analyser = this.audioCtx.createAnalyser();
    canvas = document.getElementById('canvas');
    capYPositionArray = [];
    width = canvas.width;
    height = canvas.height;
    Context = canvas.getContext('2d');
    gradient = Context.createLinearGradient(0, 300, 0, height);
    gradient.addColorStop(1, '#00ff00');
    gradient.addColorStop(0.7, '#ffff00');
    gradient.addColorStop(0, '#ff0000');
    setTime = requestAnimationFrame(this.drawMeter);
};

PCMPlayer.prototype.getMaxValue = function() {
    var encodings = {
        '8bitInt': 128,
        '16bitInt': 32768,
        '32bitInt': 2147483648,
        '32bitFloat': 1
    }

    return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
};

PCMPlayer.prototype.getTypedArray = function() {
    var typedArrays = {
        '8bitInt': Int8Array,
        '16bitInt': Int16Array,
        '32bitInt': Int32Array,
        '32bitFloat': Float32Array
    }

    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
};

PCMPlayer.prototype.createContext = function() {
    this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    this.startTime = this.audioCtx.currentTime;
};

/*PCMPlayer.prototype.download = function() {
    this.rec && this.rec.stop();
    console.log('Stopped recording.');

    this.rec.exportWAV(function (blob) {
        callback(blob);
    }, "audio/wav");

    function callback (AudioBLOB){
        socket.send(AudioBLOB);
    };
};*/

PCMPlayer.prototype.isTypedArray = function(data) {
    return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
};

PCMPlayer.prototype.feed = function(data) {
    if (!this.isTypedArray(data)) return;

    //console.log(`${performance.now()} feed size: ${data.byteLength}`);
    if (isFeed) {
        t3 = performance.now()
        log(`data feed: ${t3.toFixed(2)}, timing: ${(t3-t2).toFixed(2)}`);
        isFeed = false;
        t2 = 0;
    }

    data = this.getFormatedValue(data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
    //console.log('feed sample len: ${this.samples.length}');
};

PCMPlayer.prototype.getFormatedValue = function(data) {
    var data = new this.typedArray(data.buffer),
        float32 = new Float32Array(data.length),
        i;

    for (i = 0; i < data.length; i++) {
        float32[i] = data[i] / this.maxValue;
    }
    return float32;
};

PCMPlayer.prototype.volume = function(volume) {
    //this.gainNode.gain.value = 0;//volume;
};

PCMPlayer.prototype.destroy = function() {
    if (this.interval) {
        clearInterval(this.interval);
    }
    this.samples = null;
    this.audioCtx.close().then(function(){
        console.log("close audioContext successfully");
        Context.clearRect(0, 0, width, height);     //clear canvas
    });
    this.audioCtx = null;
};

PCMPlayer.prototype.flush = function() {
    //console.log('flush sample len: ${this.samples.length}');
    if (!this.samples.length) return;

    var length = this.samples.length / this.option.channels,
        audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate),
        audioData,
        channel,
        offset,
        i,
        decrement;


    for (channel = 0; channel < this.option.channels; channel++) {
        audioData = audioBuffer.getChannelData(channel);
        offset = channel;
        for (i = 0; i < length; i++) {
            audioData[i] = this.samples[offset];
            offset += this.option.channels;
        }
    }

    if (this.startTime < this.audioCtx.currentTime) {
        this.startTime = this.audioCtx.currentTime;
    }
    
    this.bufferSource = this.audioCtx.createBufferSource();
    this.bufferSource.connect(analyser);
    this.bufferSource.loop = false;
    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.start(0);
    this.samples = new Float32Array();

};


PCMPlayer.prototype.drawMeter = function() {
    const array = new Uint8Array(analyser.frequencyBinCount); //采样频率
    analyser.getByteFrequencyData(array);
    Context.clearRect(0, 0, width, height);
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (isCanvas && value > 0) {
            t4 = performance.now()
            log(`drawMeter analyser: ${t4.toFixed(2)}, timing: ${(t4-t3).toFixed(2)}`);
            isCanvas = false;
            t3 = 0;
        }
        if (capYPositionArray.length < array.length) {
            capYPositionArray.push(value);
        }
        Context.fillStyle = "#fff";
        if (value < capYPositionArray[i]) {
            Context.fillRect(i, height - (--capYPositionArray[i]), 1, 1);
        } else {
            Context.fillRect(i, height - value, 1, 1);
            capYPositionArray[i] = value;
        }
        Context.fillStyle = gradient;
        Context.fillRect(i, height - value, 1, height);
    }
    setTime = requestAnimationFrame(PCMPlayer.prototype.drawMeter);
    delete array;
};