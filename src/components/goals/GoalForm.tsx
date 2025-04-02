
import React from 'react';
import { useForm } from 'react-hook-form';
import { FinancialGoal } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface GoalFormProps {
  goal: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onSave, onCancel, isSaving }) => {
  const isNewGoal = !goal || !goal.id;
  
  // Format date for the form input
  let defaultDate: string;
  if (goal?.targetDate) {
    const date = goal.targetDate instanceof Date 
      ? goal.targetDate 
      : new Date(goal.targetDate);
    
    defaultDate = isValid(date) 
      ? format(date, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd');
  } else {
    defaultDate = format(new Date(), 'yyyy-MM-dd');
  }
  
  const defaultValues = {
    id: goal?.id || '',
    name: goal?.name || '',
    targetAmount: goal?.targetAmount || 0,
    currentAmount: goal?.currentAmount || 0,
    targetDate: defaultDate,
    priority: goal?.priority || 'medium' as 'low' | 'medium' | 'high'
  };

  console.log('GoalForm defaultValues:', defaultValues);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    const formattedGoal: FinancialGoal = {
      ...data,
      id: isNewGoal ? uuidv4() : goal!.id,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount),
      targetDate: new Date(data.targetDate)
    };
    
    console.log('Formatted goal for save:', formattedGoal);
    onSave(formattedGoal);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {isNewGoal ? 'Create New Goal' : 'Edit Goal'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Goal Name</Label>
          <Input
            id="name"
            placeholder="e.g., Emergency Fund, Down Payment, Retirement"
            {...register("name", { required: "Goal name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="10000"
              {...register("targetAmount", { 
                required: "Target amount is required",
                min: { value: 1, message: "Amount must be positive" }
              })}
            />
            {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount.message as string}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount ($)</Label>
            <Input
              id="currentAmount"
              type="number"
              placeholder="0"
              {...register("currentAmount", { 
                required: "Current amount is required",
                min: { value: 0, message: "Amount cannot be negative" }
              })}
            />
            {errors.currentAmount && <p className="text-red-500 text-sm">{errors.currentAmount.message as string}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            {...register("targetDate", { required: "Target date is required" })}
          />
          {errors.targetDate && <p className="text-red-500 text-sm">{errors.targetDate.message as string}</p>}
        </div>
        
        <div className="space-y-3">
          <Label>Priority</Label>
          <div className="flex flex-col space-y-2">
            <RadioGroup
              defaultValue={defaultValues.priority}
              onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High Priority</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-finance-blue hover:bg-finance-blue-dark"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Goal'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
