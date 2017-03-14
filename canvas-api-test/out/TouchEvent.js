var TouchEventListener = (function () {
    function TouchEventListener(type, func, capture) {
        this.capture = false;
        this.type = type;
        this.func = func;
        this.capture = capture;
    }
    return TouchEventListener;
}());
var TouchEventListenerManagement = (function () {
    function TouchEventListenerManagement() {
    }
    TouchEventListenerManagement.dispatch = function (e) {
        for (var i = 0; i < TouchEventListenerManagement.list.length; i++) {
            TouchEventListenerManagement.list[i].func(e);
        }
        TouchEventListenerManagement.list = [];
    };
    TouchEventListenerManagement.list = [];
    return TouchEventListenerManagement;
}());
//# sourceMappingURL=TouchEvent.js.map