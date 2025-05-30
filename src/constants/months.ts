
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
    t('common.months.january', 'January'),
    t('common.months.february', 'February'), 
    t('common.months.march', 'March'),
    t('common.months.april', 'April'),
    t('common.months.may', 'May'),
    t('common.months.june', 'June'),
    t('common.months.july', 'July'),
    t('common.months.august', 'August'),
    t('common.months.september', 'September'),
    t('common.months.october', 'October'),
    t('common.months.november', 'November'),
    t('common.months.december', 'December')
  ];
  
  const getTranslatedMonthsShort = () => [
    t('common.months.jan', 'Jan'),
    t('common.months.feb', 'Feb'),
    t('common.months.mar', 'Mar'),
    t('common.months.apr', 'Apr'),
    t('common.months.may', 'May'),
    t('common.months.jun', 'Jun'),
    t('common.months.jul', 'Jul'),
    t('common.months.aug', 'Aug'),
    t('common.months.sep', 'Sep'),
    t('common.months.oct', 'Oct'),
    t('common.months.nov', 'Nov'),
    t('common.months.dec', 'Dec')
  ];
  
  return {
    getTranslatedMonths,
    getTranslatedMonthsShort
  };
};
