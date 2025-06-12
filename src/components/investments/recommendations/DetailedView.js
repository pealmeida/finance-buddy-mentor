"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AllocationChart_1 = require("./AllocationChart");
var AllocationBreakdown_1 = require("./AllocationBreakdown");
var ActionButton_1 = require("./ActionButton");
var DetailedView = function (_a) {
    var recommendation = _a.recommendation;
    return (<div className="mt-6 animate-scale-in">
      <AllocationSection recommendation={recommendation}/>
      
      <div className="mt-6 flex justify-end">
        <ActionButton_1.default />
      </div>
    </div>);
};
var AllocationSection = function (_a) {
    var recommendation = _a.recommendation;
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AllocationChart_1.default allocation={recommendation.allocation}/>
      
      <AllocationBreakdown_1.default allocation={recommendation.allocation} riskLevel={recommendation.riskLevel} expectedReturn={recommendation.expectedReturn} timeHorizon={recommendation.timeHorizon}/>
    </div>);
};
exports.default = DetailedView;
