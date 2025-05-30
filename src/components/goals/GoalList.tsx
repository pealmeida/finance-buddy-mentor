
import React from 'react';
import { FinancialGoal } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2, Target } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';

interface GoalListProps {
  goals: FinancialGoal[];
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onEdit, onDelete }) => {
  const { t } = useTranslation();
  
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500">{t('goals.noGoalsYet', 'No financial goals yet')}</p>
        <p className="text-sm text-gray-400">{t('goals.addToGetStarted', 'Add a goal to get started on your financial journey')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('goals.goal', 'Goal')}</TableHead>
            <TableHead>{t('goals.progress', 'Progress')}</TableHead>
            <TableHead>{t('goals.targetDate', 'Target Date')}</TableHead>
            <TableHead>{t('goals.priority', 'Priority')}</TableHead>
            <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const targetDate = goal.targetDate instanceof Date
              ? goal.targetDate
              : new Date(goal.targetDate);
            
            // Format the priority for display
            let priorityClass = "";
            let priorityText = "";
            switch (goal.priority) {
              case 'high':
                priorityClass = "bg-red-100 text-red-800";
                priorityText = t('goals.priority.high', 'High Priority');
                break;
              case 'medium':
                priorityClass = "bg-yellow-100 text-yellow-800";
                priorityText = t('goals.priority.medium', 'Medium Priority');
                break;
              case 'low':
                priorityClass = "bg-green-100 text-green-800";
                priorityText = t('goals.priority.low', 'Low Priority');
                break;
              default:
                priorityClass = "bg-gray-100 text-gray-800";
                priorityText = goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1);
            }
            
            return (
              <TableRow key={goal.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{goal.name}</span>
                    <span className="text-xs text-gray-500">${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  {targetDate.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
                    {priorityText}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(goal)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('goals.deleteGoal', 'Delete Financial Goal')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('goals.deleteConfirmation', 'Are you sure you want to delete this financial goal? This action cannot be undone.')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => onDelete(goal.id)}
                          >
                            {t('common.delete', 'Delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GoalList;
