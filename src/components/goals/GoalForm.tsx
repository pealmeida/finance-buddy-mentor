import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FinancialGoal } from "../../types/finance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Loader2 } from "lucide-react";
import { format, isValid, isAfter } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { CurrencyInputController } from "../ui/currency-input";

interface GoalFormProps {
  goal: FinancialGoal | null;
  onSave: (goal: FinancialGoal) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  onSave,
  onCancel,
  isSaving,
}) => {
  const { t } = useTranslation();
  const isNewGoal = !goal || !goal.id;

  // Format date for the form input
  const getDefaultDate = () => {
    if (goal?.targetDate) {
      const date =
        goal.targetDate instanceof Date
          ? goal.targetDate
          : new Date(goal.targetDate);
      return isValid(date)
        ? format(date, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
    }
    return format(new Date(), "yyyy-MM-dd");
  };

  const defaultValues = {
    id: goal?.id || "",
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || 0,
    currentAmount: goal?.currentAmount || 0,
    targetDate: getDefaultDate(),
    priority: goal?.priority || ("medium" as "low" | "medium" | "high"),
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const currentAmount = watch("currentAmount");
  const targetAmount = watch("targetAmount");
  const targetDate = watch("targetDate");

  // Validate current amount doesn't exceed target
  useEffect(() => {
    if (Number(currentAmount) > Number(targetAmount)) {
      setError("currentAmount", {
        type: "manual",
        message: t("goals.currentExceedsTarget"),
      });
    } else {
      clearErrors("currentAmount");
    }
  }, [currentAmount, targetAmount]);

  const onSubmit = (data: any) => {
    const date = new Date(data.targetDate);

    if (!isAfter(date, new Date())) {
      setError("targetDate", {
        type: "manual",
        message: t("goals.futureDateRequired"),
      });
      return;
    }

    const formattedGoal: FinancialGoal = {
      ...data,
      id: isNewGoal ? uuidv4() : goal!.id,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount),
      targetDate: date,
    };

    onSave(formattedGoal);
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold mb-4'>
        {isNewGoal
          ? t("goals.createNewGoal", "Create New Goal")
          : t("goals.editGoal", "Edit Goal")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='name'>{t("goals.goalName", "Goal Name")}</Label>
          <Input
            id='name'
            placeholder={t(
              "goals.goalNamePlaceholder",
              "e.g., Emergency Fund, Down Payment, Retirement"
            )}
            {...register("name", {
              required: t(
                "goals.nameRequired",
                "Goal name is required"
              ) as string,
            })}
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='targetAmount'>
              {t("goals.targetAmount", "Target Amount")} ($)
            </Label>
            <CurrencyInputController
              id='targetAmount'
              placeholder='10.000,00'
              field={register("targetAmount", {
                required: t(
                  "goals.targetAmountRequired",
                  "Target amount is required"
                ) as string,
                min: {
                  value: 1,
                  message: t(
                    "goals.amountPositive",
                    "Amount must be positive"
                  ) as string,
                },
              })}
            />
            {errors.targetAmount && (
              <p className='text-red-500 text-sm'>
                {errors.targetAmount.message as string}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='currentAmount'>
              {t("goals.currentAmount", "Current Amount")} ($)
            </Label>
            <CurrencyInputController
              id='currentAmount'
              placeholder='0,00'
              field={register("currentAmount", {
                required: t(
                  "goals.currentAmountRequired",
                  "Current amount is required"
                ) as string,
                min: {
                  value: 0,
                  message: t(
                    "goals.amountNotNegative",
                    "Amount cannot be negative"
                  ) as string,
                },
              })}
            />
            {errors.currentAmount && (
              <p className='text-red-500 text-sm'>
                {errors.currentAmount.message as string}
              </p>
            )}
          </div>
        </div>

        {targetAmount > 0 && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>{t("goals.progress", "Progress")}</span>
              <span>
                {Math.min(
                  100,
                  (Number(currentAmount) / Number(targetAmount)) * 100
                ).toFixed(0)}
                %
              </span>
            </div>
            <div className='h-2 w-full bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-finance-blue transition-all duration-300'
                style={{
                  width: `${Math.min(
                    100,
                    (Number(currentAmount) / Number(targetAmount)) * 100
                  )}%`,
                }}
                aria-valuenow={Math.min(
                  100,
                  (Number(currentAmount) / Number(targetAmount)) * 100
                )}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        <div className='space-y-2'>
          <Label htmlFor='targetDate'>
            {t("goals.targetDate", "Target Date")}
          </Label>
          <Input
            id='targetDate'
            type='date'
            min={format(new Date(), "yyyy-MM-dd")}
            {...register("targetDate", {
              required: t(
                "goals.targetDateRequired",
                "Target date is required"
              ) as string,
              validate: {
                validDate: (value) =>
                  isValid(new Date(value)) ||
                  t("goals.invalidDate", "Invalid date format"),
              },
            })}
            aria-invalid={errors.targetDate ? "true" : "false"}
          />
          {errors.targetDate && (
            <p className='text-red-500 text-sm' role='alert'>
              {errors.targetDate.message as string}
            </p>
          )}
        </div>

        <div className='space-y-3'>
          <Label>{t("goals.priorityLabel", "Priority")}</Label>
          <div className='flex flex-col space-y-2'>
            <RadioGroup
              defaultValue={defaultValues.priority}
              onValueChange={(value) =>
                setValue("priority", value as "low" | "medium" | "high")
              }
              className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='low' id='low' />
                <Label htmlFor='low'>
                  {t("goals.priority.low", "Low Priority")}
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='medium' id='medium' />
                <Label htmlFor='medium'>
                  {t("goals.priority.medium", "Medium Priority")}
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='high' id='high' />
                <Label htmlFor='high'>
                  {t("goals.priority.high", "High Priority")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className='flex justify-end space-x-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSaving}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            type='submit'
            className='bg-finance-blue hover:bg-finance-blue-dark'
            disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {t("common.saving", "Saving...")}
              </>
            ) : (
              t("goals.saveGoal", "Save Goal")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
