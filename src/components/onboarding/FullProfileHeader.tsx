
import React from 'react';

interface FullProfileHeaderProps {
  isEditMode: boolean;
}

const FullProfileHeader: React.FC<FullProfileHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? "Update Your Financial Profile" : "Complete Your Financial Profile"}
      </h1>
      <p className="text-gray-600">
        {isEditMode 
          ? "Make changes to your financial information and preferences" 
          : "Let's collect some information to personalize your financial recommendations"}
      </p>
    </div>
  );
};

export default FullProfileHeader;
