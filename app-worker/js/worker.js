onmessage = function(e) {
    data = this.getFormatedValue(e.data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;

    decodeBuf();
}

this.maxValue = 32768;
this.samples = new Float32Array();
var getFormatedValue = function(data) {
    var data = new Int16Array(data.buffer),
        float32 = new Float32Array(data.length),
        i;

    for (i = 0; i < data.length; i++) {
        float32[i] = data[i] / this.maxValue;
    }
    return float32;
};

var decodeBuf = function() {
    //console.log(`I am time ticker... ${this.samples.length}`);
    var length = this.samples.length/2;
    var channel = 2;
    if (this.samples.length > 0) {
        //console.log(`post message`);
        var audioData1 = new Float32Array(length);
        var audioData2 = new Float32Array(length);
        offset = channel;
        for (i = 0; i < length; i++) {
            audioData1[i] = samples[offset];
            audioData2[i] = samples[offset + 1];
            offset += channel;
        }

        postMessage([audioData1, audioData2]);
        this.samples = new Float32Array();        
    }
};

//setInterval(decodeBuf, 300);