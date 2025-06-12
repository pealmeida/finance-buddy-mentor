"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var react_i18next_1 = require("react-i18next");
var ActionButton = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<button_1.Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2">
      {t('investments.getDetailedPlan', 'Get Detailed Plan')}
      <lucide_react_1.ArrowRight className="h-4 w-4"/>
    </button_1.Button>);
};
exports.default = ActionButton;
