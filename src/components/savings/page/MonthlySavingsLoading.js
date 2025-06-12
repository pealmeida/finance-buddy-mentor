"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var MonthlySavingsLoading = function (_a) {
    var _b = _a.message, message = _b === void 0 ? 'Loading savings data...' : _b, debugInfo = _a.debugInfo;
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <lucide_react_1.Loader2 className="h-6 w-6 animate-spin text-blue-500"/>
          <p className="text-blue-700 font-medium">{message}</p>
        </div>
        <p className="text-sm text-gray-500">Please wait while we retrieve your information</p>
        {debugInfo && (<p className="text-xs text-gray-400 mt-4 max-w-md text-center">
            Debug: {debugInfo}
          </p>)}
      </div>
    </div>);
};
exports.default = MonthlySavingsLoading;
