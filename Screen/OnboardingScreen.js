import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343765",
  },
  text: {
    fontSize: 16,
    color: "#343765",
    textAlign: "center",
    lineHeight: 22,
  },
  skipContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  skipText: {
    color: "#FF6E4E",
    fontSize: 18,
  },
  navigationContainer: {
    position: "absolute",
    bottom: 50,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  paginationStyle: {
    position: "absolute",
    bottom: 70, // Adjusted so that the dots and arrows align well
    left: 0,
    right: 0,
    justifyContent: "center",
    flexDirection: "row",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#E0E0E0",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#2D2D2D",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  arrowButton: {
    backgroundColor: "#32357C",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
