onmessage = function(e) {
    data = this.getFormatedValue(e.data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
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

    if (this.samples.length > 0) {
        //console.log(`post message`);

        postMessage(this.samples)
        this.samples = new Float32Array();
        
    }
};

setInterval(decodeBuf, 100);