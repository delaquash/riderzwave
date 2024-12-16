import { View, Text } from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";

export default function index() {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  return (
    <Redirect href={!isLoggedIn ? "/(routes)/registration" : "/(tabs)/home"} />
  );
}
