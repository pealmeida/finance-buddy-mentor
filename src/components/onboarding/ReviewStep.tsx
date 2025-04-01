
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';

const ReviewStep: React.FC = () => {
  const { profile } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Review & Complete</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Personal Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{profile.email}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{profile.name}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{profile.age}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Monthly Income:</span>
              <span className="font-medium">${profile.monthlyIncome?.toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Risk Profile</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Risk Tolerance:</span>
              <span className="font-medium capitalize">{profile.riskProfile}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Emergency Fund:</span>
              <span className="font-medium">{profile.hasEmergencyFund ? 'Yes' : 'No'}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">High Interest Debts:</span>
              <span className="font-medium">{profile.hasDebts ? 'Yes' : 'No'}</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Financial Goals</h3>
          {profile.financialGoals && profile.financialGoals.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {profile.financialGoals.map((goal) => (
                <div key={goal.id} className="py-1">
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-sm text-gray-600">
                    ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()} | 
                    <span className="capitalize"> {goal.priority} priority</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500">No goals added</div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Current Investments</h3>
          {profile.investments && profile.investments.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {profile.investments.map((investment) => (
                <div key={investment.id} className="py-1">
                  <p className="font-medium">{investment.name}</p>
                  <p className="text-sm text-gray-600">
                    {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)} | 
                    ${investment.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500">No investments added</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
