import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import Swiper from "react-native-swiper";
import OnboardingImage3 from "../assets/onboard/onb3.svg";
import OnboardingImage2 from "../assets/onboard/onb2.svg";
import OnboardingImage1 from "../assets/onboard/onb1.svg";
import AntDesign from "@expo/vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleSkip = () => {
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
      navigation.replace("Welcome");
    }
  };

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
        onIndexChanged={(i) => setIndex(i)}
      >
        <View style={styles.slide}>
          <OnboardingImage3 width={width * 0.8} height={height * 0.5} />
          <Text style={styles.title}>Homework Easily</Text>
          <Text style={styles.text}>
            It is recommended that you complete assignments to improve your
            skills for beginner languages.
          </Text>
        </View>

        <View style={styles.slide}>
          <OnboardingImage1 width={width * 0.8} height={height * 0.5} />
          <Text style={styles.title}>Fun Events</Text>
          <Text style={styles.text}>
            Thanks to fun events, you will follow your progress better and you
            will be able to socialize.
          </Text>
        </View>

        <View style={styles.slide}>
          <OnboardingImage2 width={width * 0.8} height={height * 0.5} />
          <Text style={styles.title}>Timely Notifications</Text>
          <Text style={styles.text}>
            With timely notifications, you won't miss your lessons and homework,
            and you won't have to worry.
          </Text>
        </View>
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
  image: {
    width: width * 0.8,
    height: height * 0.5,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: height * 0.015,
    color: "#343765",
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
    color: "#FF6E4E",
    fontSize: width * 0.045,
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
    backgroundColor: "#2D2D2D",
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
    marginHorizontal: width * 0.01,
  },
  arrowButton: {
    backgroundColor: "#32357C",
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingScreen;
