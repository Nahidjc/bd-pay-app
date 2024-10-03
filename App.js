import { store } from "./state/store";
import { Provider } from "react-redux";
import MainApp from "./MainApp";
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
