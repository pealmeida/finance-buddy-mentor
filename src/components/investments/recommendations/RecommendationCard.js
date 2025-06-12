"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var RecommendationCard = function (_a) {
    var recommendation = _a.recommendation, isExpanded = _a.isExpanded, onToggle = _a.onToggle, renderDetailedView = _a.renderDetailedView;
    return (<card_1.Card key={recommendation.id} className="finance-card overflow-hidden">
      <card_1.CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-finance-blue-light flex items-center justify-center">
              <lucide_react_1.BarChart3 className="h-5 w-5 text-finance-blue"/>
            </div>
            <div>
              <h3 className="font-medium">{recommendation.title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                  {recommendation.riskLevel}
                </span>
                <span className="text-xs text-gray-500">
                  {recommendation.expectedReturn} expected return
                </span>
              </div>
            </div>
          </div>
          <button_1.Button variant="ghost" size="sm" onClick={function () { return onToggle(recommendation.id); }} className="text-gray-500">
            {isExpanded ? <lucide_react_1.ChevronUp className="h-5 w-5"/> : <lucide_react_1.ChevronDown className="h-5 w-5"/>}
          </button_1.Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>
        
        {isExpanded && renderDetailedView(recommendation)}
      </card_1.CardContent>
    </card_1.Card>);
};
exports.default = RecommendationCard;
