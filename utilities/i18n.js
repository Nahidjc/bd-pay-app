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
      placeholder_name_or_number: "Enter Name or Number",
      send_money_message: "Send money to {{query}}",
      default_number: "a number",
      tap_to_proceed: "Tap to proceed to the next step",
      available_balance: "Available Balance",
      proceed: "Proceed",
      amount_placeholder: "5",
      recipient: "Recipient",
      invalid_amount: "Invalid Amount",
      enter_valid_amount: "Please enter a valid amount.",
      insufficient_balance: "Insufficient Balance",
      not_enough_balance:
        "You do not have enough balance for this transaction.",
      enter_valid_pin: "Please enter a valid 4-digit PIN.",
      transaction_failed: "Transaction Failed",
      transaction_failure_msg:
        "Unable to complete the transaction. Please try again.",
      confirm_pin: "Confirm PIN",
      note_placeholder: "Tap to write a note",
      amount_label: "Amount",
      pin_placeholder: "Enter PIN",
      reference_label: "Reference",
      confirm_send_money: "Confirm Send Money",
      total_label: "Total",
      charge_label: "Charge",
      no_charge: "+ No Charge Applicable",
      new_balance_label: "New Balance",
      send_money_info:
        "No charge for up to 25,000 BDT per month for sending money to your preferred number. If any transaction exceeds the limit, a specific charge will apply.",
      hold_to_send: "Hold to Send Money",
      time: "Time",
      transaction_id: "Transaction ID",
      copy_transaction_id: "Transaction ID Copied",
      auto_pay: "Enable Auto Pay",
      home_button: "Go to Home",
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
      placeholder_name_or_number: "নাম বা নম্বর দিন",
      send_money_message: "{{query}} -কে সেন্ড মানি করুন",
      default_number: "একটি নম্বর",
      tap_to_proceed: "পরের ধাপে যেতে ট্যাপ করুন",
      available_balance: "ব্যবহারযোগ্য ব্যালেন্স",
      proceed: "এগিয়ে যান",
      amount_placeholder: "৫",
      recipient: "প্রাপক",
      invalid_amount: "অবৈধ পরিমাণ",
      enter_valid_amount: "একটি বৈধ পরিমাণ লিখুন।",
      insufficient_balance: "অপর্যাপ্ত ব্যালেন্স",
      not_enough_balance: "এই লেনদেনের জন্য আপনার পর্যাপ্ত ব্যালেন্স নেই।",
      enter_valid_pin: "একটি বৈধ ৪-সংখ্যার পিন লিখুন।",
      transaction_failed: "লেনদেন ব্যর্থ হয়েছে",
      transaction_failure_msg:
        "লেনদেন সম্পন্ন করা সম্ভব নয়। আবার চেষ্টা করুন।",
      confirm_pin: "পিন কনফার্ম করুন",
      note_placeholder: "নোট লিখতে ট্যাপ করুন",
      amount_label: "পরিমাণ",
      pin_placeholder: "পিন নম্বর দিন",
      reference_label: "রেফারেন্স",
      confirm_send_money: "সেন্ড মানি নিশ্চিত করুন",
      total_label: "সর্বমোট",
      charge_label: "চার্জ",
      no_charge: "+ চার্জ প্রযোজ্য নয়",
      new_balance_label: "নতুন ব্যালেন্স",
      reference_label: "রেফারেন্স",
      send_money_info:
        "প্রিয় নাম্বারে প্রতি মাসে ২৫,০০০ টাকা পর্যন্ত সেন্ড মানি করতে কোনো চার্জ প্রযোজ্য হবে না। যদি কোনো লেনদেন লিমিট অতিক্রম করে, তখন নির্দিষ্ট চার্জ প্রযোজ্য হবে।",
      hold_to_send: "সেন্ড মানি করতে ট্যাপ করে ধরে রাখুন",
      time: "সময়",
      transaction_id: "ট্রানজেকশন আইডি",
      copy_transaction_id: "ট্রানজেকশন আইডি কপি করা হয়েছে",
      auto_pay: "অটো পে চালু করুন",
      home_button: "হোম-এ ফিরে যাই",

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
