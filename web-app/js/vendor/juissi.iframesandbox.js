window.Conmio = window.Conmio || {};

(function() {
    window.Conmio.iFrameSandbox = function(options) {
        var self = this;

        this.onload = options.onload || function() {};

        var frame = document.createElement("iframe");

        frame.style.position = "absolute";
        frame.style.top = "-100%";

        frame.onload = function() {
            self.onload(frame.contentWindow.document);
            document.body.removeChild(frame);
        };

        frame.src = options.url;

        document.body.appendChild(frame);
    }
}());
