import 'react-native-get-random-values';
import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index() {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const getData = async () => {
      try {
         setIsLoading(true)
         const accessToken = await AsyncStorage.getItem("accessToken");
         if (accessToken) {
           setisLoggedIn(true)
         } else {
           setisLoggedIn(false)
         }
      } catch (error) {
       console.log(error)
      } finally {
        if(isMounted) {
          setIsLoading(false)
        }
      }
    }
    getData();
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return null
  }
  return (
    // <Redirect href={!isLoggedIn ? "/(routes)/registration" : "/(tabs)/home"} />
    <Redirect href={!isLoggedIn ? "/(routes)/onboarding" : "/(tabs)/home"} />
  );
}
