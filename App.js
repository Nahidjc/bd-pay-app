import { store } from "./state/store";
import { Provider } from "react-redux";
import MainApp from "./MainApp";
import { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";

export default function App() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      SplashScreen.hide();
    };

    hideSplashScreen();
  }, []);

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
