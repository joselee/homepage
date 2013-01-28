(function() {

    this.Conmio = this.Conmio || {};

    this.Conmio.ViewManager = function(options) {
        this.el = options.el;
        _.bindAll(this);
        this.viewStack = [];
        this.views = [];
    };

    _.extend(this.Conmio.ViewManager.prototype, {
        el: null,
        viewStack: [],
        hideCurrent: function() {
            if (this.viewStack.length > 0) {
                _.last(this.viewStack).trigger("detach").el.detach();
            }
        },
        detachAll: function() {
            while (this.viewStack.length > 0) {
                this.viewStack.pop().trigger("detach").el.detach();
            }
        },
        show: function(view) {
            if (this.viewStack.length == 1 && this.viewStack[0] == view) {
                return this;
            }
            this.detachAll();
            this.viewStack.push(view);

            return this._show(view);
        },
        _show: function(view) {
            this.el.append(view.el);
            view.trigger("attach");

            return this;
        },
        push: function(view) {
            if (view == _.last(this.viewStack)) {
                return this;
            }
            this.hideCurrent();

            this.el.append(view.el);
            view.trigger("attach");

            this.viewStack.push(view);
            return this;
        },
        pop: function() {
            var current = _.last(this.viewStack);
            if (current) {
                this.hideCurrent();
            }

            this.viewStack.pop();

            var nextup = _.last(this.viewStack);
            if (nextup) {
                this._show(nextup);
            }
        }
    });
})();