import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";

interface SavingsErrorStateProps {
  error: string;
}

const SavingsErrorState: React.FC<SavingsErrorStateProps> = ({ error }) => {
  return (
    <div className='p-8 bg-white rounded-lg shadow-md space-y-4'>
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>Error loading data: {error}</AlertDescription>
      </Alert>
    </div>
  );
};

export default SavingsErrorState;
