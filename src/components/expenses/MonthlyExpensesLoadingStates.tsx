
import React from 'react';
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ loading, error, onRefresh }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64'>
        <div className='flex items-center gap-2 text-red-500'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <p>{t('expenses.loadingExpenses')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md space-y-4'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{t('expenses.errorLoadingData')} {error}</AlertDescription>
        </Alert>

        {onRefresh && (
          <div className='flex justify-center'>
            <Button
              onClick={onRefresh}
              variant='outline'
              className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
              {t('common.refresh')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

interface EmptyStateProps {
  onRefresh?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
  const { t } = useTranslation();

  return (
    <div className='p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4'>
      <p className='text-gray-500'>
        {t('expenses.noExpensesData')}
      </p>

      {onRefresh && (
        <Button
          onClick={onRefresh}
          variant='outline'
          className='flex items-center gap-2'>
          <RefreshCw className='h-4 w-4' />
          {t('common.refresh')}
        </Button>
      )}
    </div>
  );
};
