
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveAllButtonProps {
  onSave: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const SaveAllButton: React.FC<SaveAllButtonProps> = ({
  onSave,
  disabled,
  isSaving
}) => {
  return (
    <Button 
      onClick={onSave} 
      className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
      disabled={disabled}
    >
      {isSaving ? (
        <>Saving...</>
      ) : (
        <>
          <Save size={16} />
          Save All
        </>
      )}
    </Button>
  );
};

export default SaveAllButton;
