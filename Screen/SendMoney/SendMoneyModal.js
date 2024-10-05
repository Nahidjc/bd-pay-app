import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SendMoneyModal = ({
  visible,
  onClose,
  recipientName,
  recipientPhone,
  amount,
  charge,
  newBalance,
  reference,
  progress,
  onPressIn,
  onPressOut,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("confirm_send_money")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{recipientName[0]}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{recipientName}</Text>
              <Text style={styles.phone}>{recipientPhone}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>{t("total_label")}</Text>
              <Text style={styles.amountValue}>৳{amount.toFixed(2)}</Text>
              <Text style={styles.chargeText}>
                {charge > 0
                  ? `${t("charge_label")} ৳${charge.toFixed(2)}`
                  : t("no_charge")}
              </Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountColumn}>
              <Text style={styles.amountLabel}>{t("new_balance_label")}</Text>
              <Text style={styles.amountValue}>৳{newBalance.toFixed(2)}</Text>
            </View>
          </View>

          {reference && (
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceText}>
                {t("reference_label")}: {reference}
              </Text>
            </View>
          )}

          <View style={styles.infoContainer}>
            <Image
              source={require("../../assets/images/paypal.png")}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{t("send_money_info")}</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
          <LinearGradient
            colors={["#E91E63", "#E91E63"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.sendButton}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Text style={styles.sendButtonText}>
                {t("hold_to_send")}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

SendMoneyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recipientName: PropTypes.string.isRequired,
  recipientPhone: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  charge: PropTypes.number.isRequired,
  newBalance: PropTypes.number.isRequired,
  reference: PropTypes.string,
  progress: PropTypes.number.isRequired,
  onPressIn: PropTypes.func.isRequired,
  onPressOut: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0080",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  closeText: {
    fontSize: 24,
    color: "#FF0080",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF69B4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  profileInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "gray",
  },
  amountContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
  },
  amountColumn: {
    flex: 1,
    padding: 10,
    alignItems: "flex-start",
  },
  amountDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 2,
  },
  chargeText: {
    fontSize: 12,
    color: "#666",
  },
  referenceContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  referenceText: {
    fontSize: 14,
    color: "#666",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "gray",
  },
  bottomContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF0080",
  },
  gradientButton: {
    borderRadius: 8,
  },
  sendButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SendMoneyModal;
