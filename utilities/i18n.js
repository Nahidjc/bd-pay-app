import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome back to BD Pay",
      send: "Send Money",
      cashOut: "Cash Out",
      payment: "Payment",
      addMoney: "Add Money",
      balance_label: "Last Updated Balance",
      header_title: "Header Title",
      some_other_key: "Some Other Text",
      menu: "BD Pay Menu",
      home: "Home",
      statement: "Statement",
      limit: "Limit",
      coupon: "Coupon",
      info_update: "Update Info",
      nominee_update: "Update Nominee Info",
      refer_app: "Refer App",
      logout: "Logout",
    },
  },
  bn: {
    translation: {
      welcome: "বিডি-পে তে স্বাগতম",
      send: "সেন্ড মানি",
      cashOut: "ক্যাশ আউট",
      payment: "পেমেন্ট",
      addMoney: "অ্যাড মানি",
      balance_label: "সর্বশেষ আপডেট ব্যালেন্স",
      header_title: "হেডার শিরোনাম",
      some_other_key: "অন্যান্য টেক্সট",
      menu: "বিডি-পে মেনু",
      home: "হোম",
      statement: "স্টেটমেন্ট",
      limit: "লিমিট",
      coupon: "কুপন",
      info_update: "তথ্য হালনাগাদ",
      nominee_update: "নমিনির তথ্য হালনাগাদ",
      refer_app: "রেফার অ্যাপ",
      logout: "লগআউট",
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: "bn",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
