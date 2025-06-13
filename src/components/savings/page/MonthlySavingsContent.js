"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var MonthlySavings_1 = require("@/components/savings/MonthlySavings");
var MonthlySavingsContent = function (_a) {
    var userProfile = _a.userProfile, onProfileUpdate = _a.onProfileUpdate, isSubmitting = _a.isSubmitting;
    return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Monthly Savings</h1>
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <MonthlySavings_1.default profile={userProfile} onSave={onProfileUpdate} isSaving={isSubmitting}/>
          </div>
        </div>
      </div>
    </div>);
};
// Memoize the component to prevent unnecessary re-renders
exports.default = (0, react_1.memo)(MonthlySavingsContent);
