import { useTranslation } from "react-i18next";

export const useCurrencyFormatter = () => {
  const { t, i18n } = useTranslation();

  const formatCurrency = (amount) => {
    const isEnglish = i18n.language === "en";
    const formattedAmount = isEnglish
      ? amount.toLocaleString("en-US")
      : amount.toLocaleString("bn-BD");
    return `${formattedAmount}`;
  };

  return formatCurrency;
};
