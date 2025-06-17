import React from "react";
import { FinancialGoal } from "../../types/finance";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit, Trash2, Target } from "lucide-react";
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
} from "../ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../../hooks/use-responsive";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface GoalListProps {
  goals: FinancialGoal[];
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goalId: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  if (!goals || goals.length === 0) {
    return (
      <div className='text-center py-12'>
        <Target className='mx-auto h-12 w-12 text-gray-300' />
        <p className='mt-4 text-gray-500'>
          {t("goals.noGoalsYet", "No financial goals yet")}
        </p>
        <p className='text-sm text-gray-400'>
          {t(
            "goals.addToGetStarted",
            "Add a goal to get started on your financial journey"
          )}
        </p>
      </div>
    );
  }

  const getPriorityDisplay = (priority: string) => {
    let priorityClass = "";
    let priorityText = "";

    switch (priority) {
      case "high":
        priorityClass = "bg-red-100 text-red-800";
        priorityText = t("goals.priority.high", "High Priority");
        break;
      case "medium":
        priorityClass = "bg-yellow-100 text-yellow-800";
        priorityText = t("goals.priority.medium", "Medium Priority");
        break;
      case "low":
        priorityClass = "bg-green-100 text-green-800";
        priorityText = t("goals.priority.low", "Low Priority");
        break;
      default:
        priorityClass = "bg-gray-100 text-gray-800";
        priorityText = priority.charAt(0).toUpperCase() + priority.slice(1);
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
        {priorityText}
      </span>
    );
  };

  if (isMobile) {
    return (
      <div className='space-y-4'>
        {goals.map((goal) => {
          const progress = Math.min(
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
            100
          );
          const targetDate =
            goal.targetDate instanceof Date
              ? goal.targetDate
              : new Date(goal.targetDate);

          return (
            <Card key={goal.id}>
              <CardHeader className='p-4 flex flex-row items-start justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>
                    {goal.name}
                  </CardTitle>
                  <div className='text-sm text-gray-500'>
                    ${goal.currentAmount.toLocaleString()} of $
                    {goal.targetAmount.toLocaleString()}
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(goal)}
                    className='h-8 w-8'>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("goals.deleteGoal", "Delete Financial Goal")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(
                            "goals.deleteConfirmation",
                            "Are you sure you want to delete this financial goal? This action cannot be undone."
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("common.cancel", "Cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-red-600 hover:bg-red-700'
                          onClick={() => onDelete(goal.id)}>
                          {t("common.delete", "Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className='space-y-2 p-4'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>
                    {t("goals.progress", "Progress")}:
                  </span>
                  <div className='flex items-center gap-2 w-1/2'>
                    <Progress value={progress} className='h-2 flex-grow' />
                    <span className='text-xs font-medium'>{progress}%</span>
                  </div>
                </div>
                <div className='flex flex-wrap justify-between gap-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>
                      {t("goals.targetDate", "Target Date")}:
                    </span>
                    <span>{targetDate.toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>
                      {t("goals.priorityLabel", "Priority")}:
                    </span>
                    {getPriorityDisplay(goal.priority)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("goals.goal", "Goal")}</TableHead>
            <TableHead>{t("goals.progress", "Progress")}</TableHead>
            <TableHead>{t("goals.targetDate", "Target Date")}</TableHead>
            <TableHead>{t("goals.priorityLabel", "Priority")}</TableHead>
            <TableHead className='text-right'>
              {t("common.actions", "Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const progress = Math.min(
              Math.round((goal.currentAmount / goal.targetAmount) * 100),
              100
            );
            const targetDate =
              goal.targetDate instanceof Date
                ? goal.targetDate
                : new Date(goal.targetDate);

            return (
              <TableRow key={goal.id}>
                <TableCell className='font-medium'>
                  <div className='flex flex-col'>
                    <span>{goal.name}</span>
                    <span className='text-xs text-gray-500'>
                      ${goal.currentAmount.toLocaleString()} of $
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='w-full'>
                    <div className='flex justify-between text-xs mb-1'>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className='h-2' />
                  </div>
                </TableCell>
                <TableCell>{targetDate.toLocaleDateString()}</TableCell>
                <TableCell>{getPriorityDisplay(goal.priority)}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(goal)}
                      className='h-8 w-8'>
                      <Edit className='h-4 w-4' />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("goals.deleteGoal", "Delete Financial Goal")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t(
                              "goals.deleteConfirmation",
                              "Are you sure you want to delete this financial goal? This action cannot be undone."
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("common.cancel", "Cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700'
                            onClick={() => onDelete(goal.id)}>
                            {t("common.delete", "Delete")}
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
