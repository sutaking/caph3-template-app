onmessage = function(e) {
    //this.console.log(`recvied msg ${e.data}`);
    data = this.getFormatedValue(e.data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
}

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

