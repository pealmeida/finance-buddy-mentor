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
        console.log("Dashboard: Loading goals for user:", userProfile.id);
        const fetchedGoals = await fetchUserGoals();
        console.log("Dashboard: Fetched goals:", fetchedGoals);
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
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>
          {t("dashboard.financialGoals")}
        </h2>
        <Link to='/goals'>
          <Button
            variant='ghost'
            className='text-finance-blue flex items-center gap-1 text-sm'>
            {t("common.viewAll")} <ChevronRight className='h-4 w-4' />
          </Button>
        </Link>
      </div>

      {goals && goals.length > 0 ? (
        <div className='space-y-4'>
          {goals.slice(0, 3).map((goal) => (
            <div
              key={goal.id}
              className='flex items-center space-x-4 p-4 rounded-xl border hover:bg-gray-50 transition-all duration-300'>
              <div className='h-10 w-10 rounded-full bg-finance-purple-light flex items-center justify-center'>
                <Target className='h-5 w-5 text-finance-purple' />
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-medium'>{goal.name}</h3>
                  <span className='text-sm font-medium text-finance-purple'>
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}
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
