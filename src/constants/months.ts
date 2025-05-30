
import { useTranslation } from 'react-i18next';

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Hook to get translated month names
export const useTranslatedMonths = () => {
  const { t } = useTranslation();
  
  const getTranslatedMonths = () => [
    t('months.january', 'January'),
    t('months.february', 'February'), 
    t('months.march', 'March'),
    t('months.april', 'April'),
    t('months.may', 'May'),
    t('months.june', 'June'),
    t('months.july', 'July'),
    t('months.august', 'August'),
    t('months.september', 'September'),
    t('months.october', 'October'),
    t('months.november', 'November'),
    t('months.december', 'December')
  ];
  
  const getTranslatedMonthsShort = () => [
    t('months.jan', 'Jan'),
    t('months.feb', 'Feb'),
    t('months.mar', 'Mar'),
    t('months.apr', 'Apr'),
    t('months.may', 'May'),
    t('months.jun', 'Jun'),
    t('months.jul', 'Jul'),
    t('months.aug', 'Aug'),
    t('months.sep', 'Sep'),
    t('months.oct', 'Oct'),
    t('months.nov', 'Nov'),
    t('months.dec', 'Dec')
  ];
  
  return {
    getTranslatedMonths,
    getTranslatedMonthsShort
  };
};
