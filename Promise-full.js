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

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
        return value;
    }

    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
        return err;
    }

    let promise2;
    let _this = this;

    if (_this.status === 'resolved') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    let x = onFulfilled(_this.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (_this.status === 'rejected') {
        promise2 = new Promise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    let x = onRejected(_this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (_this.status === 'pending') {
        promise2 = new Promise(function (resolve, reject) {
            _this.onResolvedCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(_this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            _this.onRejectedCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onRejected(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }
}


function resolvePromise(promise2, x, resolve, reject) {
    // 接受四个参数，新Promise、返回值，成功和失败的回调
    // 有可能这里返回的x是别人的promise
    // 尽可能允许其他乱写
    if (promise2 === x) { //这里应该报一个类型错误
        return reject(new TypeError('循环引用了'))
    }
    // 看x是不是一个promise,promise应该是一个对象
    let called; // 表示是否调用过成功或者失败，用来解决问题7
    //下面判断上一次then返回的是普通值还是函数，来解决问题1、2
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 可能是promise {},看这个对象中是否有then方法，如果有then我就认为他是promise了
        try {
            let then = x.then;// 保存一下x的then方法
            if (typeof then === 'function') {
                // 成功
                //这里的y也是官方规范，如果还是promise，可以当下一次的x使用
                //用call方法修改指针为x，否则this指向window
                then.call(x, function (y) {
                    if (called) return //如果调用过就return掉
                    called = true
                    // y可能还是一个promise，在去解析直到返回的是一个普通值
                    resolvePromise(promise2, y, resolve, reject)//递归调用
                }, function (err) { //失败
                    if (called) return
                    called = true
                    reject(err);
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e);
        }
    } else { // 说明是一个普通值1
        resolve(x); // 表示成功了
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