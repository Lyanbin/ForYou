function Promise(executor) {

    let _this = this;
    _this.status = 'pending';
    _this.value = undefined;
    _this.reason = undefined;

    _this.onResolvedCallbacks = [];
    _this.onRejectedCallbacks = [];

    function resolve(value) {
        if (_this.status === 'pending') {
            _this.status = 'resolved';
            _this.value = value;
            _this.onResolvedCallbacks.forEach(fn => {
                fn();
            });
        }
    }

    function reject(reason) {
        if (_this.status === 'pending') {
            _this.status = 'rejected';
            _this.reason = reason;
            _this.onRejectedCallbacks.forEach(fn => {
                fn();
            });
        }
    }
    try {
        executor(resolve, reject);
    } catch (e) {
        console.log(e);
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let _this = this;
    if (_this.status === 'resolved') {
        onFulfilled(_this.value);
    }
    if (_this.status === 'rejected') {
        onRejected(_this.reason);
    }
    if (_this.status === 'pending') {
        _this.onResolvedCallbacks.push(function () {
            onFulfilled(_this.value);
        });
        _this.onRejectedCallbacks.push(function () {
            onRejected(_this.reason);
        });
    }
}


let p = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(100)
    }, 1000)
})

p.then(function (data) {
    console.log('成功', data)
}, function (err) {
    console.log('失败', err)
})