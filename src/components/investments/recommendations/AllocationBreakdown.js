"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var tooltip_1 = require("@/components/ui/tooltip");
var AllocationBreakdown = function (_a) {
    var allocation = _a.allocation, riskLevel = _a.riskLevel, expectedReturn = _a.expectedReturn, timeHorizon = _a.timeHorizon;
    return (<div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Allocation Breakdown</h4>
        <div className="space-y-2">
          {allocation.map(function (item) { return (<div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.type}</span>
              </div>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>); })}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Investment Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Risk Level:</span>
            <span className="font-medium capitalize">{riskLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Expected Return:</span>
            <span className="font-medium">{expectedReturn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time Horizon:</span>
            <span className="font-medium">{timeHorizon}</span>
          </div>
        </div>
      </div>
      
      <tooltip_1.TooltipProvider>
        <tooltip_1.Tooltip>
          <tooltip_1.TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
              <lucide_react_1.Info className="h-3 w-3"/>
              <span>About expected returns</span>
            </div>
          </tooltip_1.TooltipTrigger>
          <tooltip_1.TooltipContent className="max-w-xs">
            <p className="text-xs">
              Expected returns are based on historical data and market projections. 
              Actual returns may vary. Past performance does not guarantee future results.
            </p>
          </tooltip_1.TooltipContent>
        </tooltip_1.Tooltip>
      </tooltip_1.TooltipProvider>
    </div>);
};
exports.default = AllocationBreakdown;
