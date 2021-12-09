import React, { useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import Home from "../screens/Home";
import { AuthContext, User } from "../firebase";

export default function Navigation() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [userCred, setUserCred] = useState<User | null>();
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        setUserCred,
        loadingAuthState,
        userCred,
      }}
    >
      <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
        <Stack.Navigator>
          {!userCred ? (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
