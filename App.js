import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { store } from "./state/store";
import { Provider } from "react-redux";
import MainApp from './MainApp';
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
