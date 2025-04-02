
import React from 'react';
import { useForm } from 'react-hook-form';
import { FinancialGoal } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { format, parseISO, parse } from 'date-fns';

interface GoalFormProps {
  goal: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onSave, onCancel, isSaving }) => {
  const form = useForm<FinancialGoal>({
    defaultValues: goal || {
      id: '',
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      priority: 'medium'
    }
  });

  const { register, handleSubmit, watch, formState: { errors } } = form;

  const onSubmit = (data: FinancialGoal) => {
    // Ensure the date is a Date object
    let formattedDate = data.targetDate;
    if (typeof data.targetDate === 'string') {
      try {
        formattedDate = new Date(data.targetDate);
        if (isNaN(formattedDate.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (e) {
        // If parsing fails, use current date
        formattedDate = new Date();
      }
    }
    
    onSave({
      ...data,
      id: goal?.id || '',
      targetDate: formattedDate
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {goal && goal.id ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Goal Name</Label>
          <Input
            id="name"
            placeholder="e.g., Emergency Fund, Down Payment, Retirement"
            {...register("name", { required: "Goal name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
            {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount.message}</p>}
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
            {errors.currentAmount && <p className="text-red-500 text-sm">{errors.currentAmount.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            {...register("targetDate", { required: "Target date is required" })}
            defaultValue={
              goal?.targetDate instanceof Date 
                ? format(goal.targetDate, 'yyyy-MM-dd')
                : typeof goal?.targetDate === 'string' 
                  ? format(new Date(goal.targetDate), 'yyyy-MM-dd')
                  : format(new Date(), 'yyyy-MM-dd')
            }
          />
          {errors.targetDate && <p className="text-red-500 text-sm">{errors.targetDate.message}</p>}
        </div>
        
        <div className="space-y-3">
          <Label>Priority</Label>
          <div className="flex flex-col space-y-2">
            <RadioGroup
              defaultValue={goal?.priority || "medium"}
              onValueChange={(value) => form.setValue('priority', value as 'low' | 'medium' | 'high')}
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
