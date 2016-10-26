"use strict";
var Linter = (function () {
    function Linter(config) {
        this.config = config;
        this.widgets = [];
    }
    Linter.prototype.init = function () {
        var _this = this;
        this.worker = new Worker(this.config.workerBundle);
        this.worker.addEventListener('message', function (res) {
            try {
                if (res.data.output) {
                    var output = JSON.parse(res.data.output);
                    console.log(res.data.output);
                    _this.renderErrors(output);
                    _this.config.textEditor.showErrors(output);
                }
                else {
                    _this.config.onError(res.data.error);
                }
            }
            catch (e) {
                _this.config.onError(e);
            }
        });
        this.config.textEditor.on('change', function () {
            return _this.lint(_this.config.textEditor.getValue());
        });
        this.lint(this.config.textEditor.getValue());
    };
    Linter.prototype.lint = function (program) {
        this.worker.postMessage(JSON.stringify({ program: program }));
    };
    Linter.prototype.renderErrors = function (errors) {
        if (!errors || !errors.length) {
            this.config.reporter.setHeader('Good job! No warnings in your code!');
            this.config.reporter.clearContent();
        }
        else {
            this.config.reporter.setHeader('Warnings');
            this.config.reporter.reportErrors(errors);
        }
    };
    return Linter;
}());
exports.Linter = Linter;
//# sourceMappingURL=linter.js.map