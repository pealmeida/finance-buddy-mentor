import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Target, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { UserProfile, FinancialGoal } from "../../types/finance";
import { useTranslation } from "react-i18next";
import { useToast } from "../../hooks/use-toast";
import { fetchUserGoals } from "../../services/goalService";

interface FinancialGoalsProps {
  userProfile: UserProfile;
}

const FinancialGoals: React.FC<FinancialGoalsProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState<FinancialGoal[]>(
    userProfile.financialGoals ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);

        const fetchedGoals = await fetchUserGoals();

        setGoals(fetchedGoals);
      } catch (err) {
        console.error("Error loading goals for dashboard:", err);
        setError("Failed to load your financial goals");
        // Use the goals from props as fallback
        setGoals(userProfile.financialGoals ?? []);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [userProfile.id, userProfile.financialGoals]);

  const handleAddGoal = () => {
    navigate("/goals");
  };

  if (loading) {
    return (
      <div className='glass-panel rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>
            {t("dashboard.financialGoals")}
          </h2>
        </div>
        <div className='flex justify-center items-center py-10'>
          <Loader2 className='h-8 w-8 animate-spin text-finance-blue' />
        </div>
      </div>
    );
  }

  return (
    <div className='glass-panel rounded-2xl p-6'>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-purple-50 border border-purple-100'>
              <Target className='h-5 w-5 text-purple-500' />
            </div>
            {t("dashboard.financialGoals")}
          </div>
        </h2>
      </div>

      {goals && goals.length > 0 ? (
        <>
          <div className='space-y-4'>
            {goals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className='p-4 rounded-xl border hover:bg-gray-50 transition-all duration-300'>
                <div>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium'>{goal.name}</h3>
                    <span className='text-sm font-medium text-finance-purple'>
                      {Math.round(
                        (goal.currentAmount / goal.targetAmount) * 100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    className='h-1.5 mt-2 progress-animation'
                  />
                  <div className='flex items-center justify-between mt-1'>
                    <p className='text-xs text-gray-500'>
                      ${goal.currentAmount.toLocaleString()} of $
                      {goal.targetAmount.toLocaleString()}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {t("common.by", "By")}{" "}
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-6 flex justify-end'>
            <Link to='/goals'>
              <Button
                variant='ghost'
                size='sm'
                className='group text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium'>
                {t("common.viewAll")}
                <ChevronRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className='text-center py-10 text-gray-500'>
          <Target className='h-10 w-10 mx-auto mb-2 text-gray-300' />
          <p>{t("common.noGoalsYet")}</p>
          <Button
            variant='outline'
            className='mt-4 text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300'
            onClick={handleAddGoal}>
            <Plus className='h-4 w-4 mr-2' />
            {t("common.addGoal")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FinancialGoals;
