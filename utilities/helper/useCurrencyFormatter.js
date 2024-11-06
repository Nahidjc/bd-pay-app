import { useTranslation } from "react-i18next";

export const useCurrencyFormatter = () => {
  const { i18n } = useTranslation();

  const formatCurrency = (amount) => {
    const isEnglish = i18n.language === "en";
    const formattedAmount = isEnglish
      ? amount.toLocaleString("en-US")
      : amount.toLocaleString("bn-BD");
    return `${formattedAmount}`;
  };

  return formatCurrency;
};

export const formatNotificationDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
