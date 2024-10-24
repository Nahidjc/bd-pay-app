import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Image,
} from "react-native";
import Swiper from "react-native-swiper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setOnboardingStatus } from "../state/storage";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleSkip = () => {
    setOnboardingStatus(true);
    navigation.navigate("Welcome");
  };

  const handlePrev = () => {
    if (index > 0) {
      swiperRef.current.scrollBy(-1);
    }
  };

  const handleNext = () => {
    if (index < 2) {
      swiperRef.current.scrollBy(1);
    } else {
      setOnboardingStatus(true);
      navigation.replace("Welcome");
    }
  };

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [index]);

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        loop={false}
        showsButtons={false}
        paginationStyle={styles.paginationStyle}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        onIndexChanged={(i) => {
          setIndex(i);
        }}
        scrollEnabled={true}
        removeClippedSubviews={false}
      >
        <Animated.View style={[styles.slide, { opacity: opacityAnim }]}>
          <Image
            source={require("../assets/onboard/Authentication.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Secure Authentication</Text>
          <Text style={styles.text}>
            Access your account with ease using advanced biometrics or manual
            entry. Enjoy peace of mind knowing your data is secure.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.slide, { opacity: opacityAnim }]}>
          <Image
            source={require("../assets/FinTech.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>FinTech Services</Text>
          <Text style={styles.text}>
            Effortlessly send money, cash out, cash in, and make payments at
            your convenience. Experience seamless transactions in real-time.
          </Text>
        </Animated.View>
        <Animated.View style={[styles.slide, { opacity: opacityAnim }]}>
          <Image
            source={require("../assets/onboard/Transaction.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Transaction Management</Text>
          <Text style={styles.text}>
            Keep track of all your transactions and view detailed statements
            anytime, anywhere. Stay on top of your finances effortlessly.
          </Text>
        </Animated.View>
      </Swiper>

      <TouchableOpacity style={styles.skipContainer} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.arrowButton, index === 0 && { opacity: 0.2 }]}
          disabled={index === 0}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#e2136e",
    textAlign: "center",
  },
  text: {
    fontSize: width * 0.04,
    color: "#343765",
    textAlign: "center",
    lineHeight: width * 0.055,
    paddingHorizontal: width * 0.05,
  },
  skipContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.05 : height * 0.05,
    right: width * 0.05,
    zIndex: 10,
  },
  skipText: {
    color: "#e2136e",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginVertical: 20,
  },
  navigationContainer: {
    position: "absolute",
    bottom: height * 0.05,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  paginationStyle: {
    bottom: height * 0.15,
  },
  dot: {
    backgroundColor: "#E0E0E0",
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    marginHorizontal: width * 0.01,
  },
  activeDot: {
    backgroundColor: "#e2136e", // Brand color
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
    marginHorizontal: width * 0.01,
  },
  arrowButton: {
    backgroundColor: "#e2136e", // Brand color
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingScreen;
