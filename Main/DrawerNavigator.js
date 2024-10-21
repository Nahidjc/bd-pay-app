import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import TransactionLimitScreen from "../Screen/TransactionLimit/TransactionLimit";
import { CustomDrawerContent } from "../components/Drawer/CustomDrawerContent";
import SettingsScreen from "../Screen/Setting/Setting";
import Header from "../components/Navigation/Header";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        drawerPosition: "right",
        headerShown: false,
      }}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
      <Drawer.Screen
        name="Limit"
        component={TransactionLimitScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} title="Limit" />,
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#E91E63",
          },
          header: (props) => <Header {...props} title="Setting" />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
