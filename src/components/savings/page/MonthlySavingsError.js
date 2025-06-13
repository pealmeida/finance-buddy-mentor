"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var alert_1 = require("@/components/ui/alert");
var button_1 = require("@/components/ui/button");
var MonthlySavingsError = function (_a) {
    var error = _a.error, onRetry = _a.onRetry;
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <alert_1.Alert variant="destructive" className="max-w-4xl mx-auto mb-4">
          <lucide_react_1.AlertCircle className="h-4 w-4"/>
          <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
        </alert_1.Alert>
        <div className="flex justify-center">
          <button_1.Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <lucide_react_1.RefreshCw className="h-4 w-4"/>
            Retry
          </button_1.Button>
        </div>
      </div>
    </div>);
};
exports.default = MonthlySavingsError;
