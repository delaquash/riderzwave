import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { rideIcons } from "@/configs/constants";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { useGetDriverData } from "@/hooks/useGetDriverData";


const RenderRideItem = ({item, colors}: any) => {
    const { driver } = useGetDriverData();
    const iconIndex = parseInt(item.id) - 1;
    const icon = rideIcons[iconIndex];
  return (
    <View>
      <Text>RenderRideItem</Text>
    </View>
  )
}

export default RenderRideItem;

const styles = StyleSheet.create({})