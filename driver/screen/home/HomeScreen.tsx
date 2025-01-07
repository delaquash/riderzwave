import {
    View,
    Text,
    FlatList,
    Modal,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet
  } from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  import Header from "@/components/common/Header";
  import { recentRidesData, rideData } from "@/configs/constants";
  import { useTheme } from "@react-navigation/native";
  import { external } from "@/styles/external.style";
  import styles from "./styles";
  import MapView, { Marker, Polyline } from "react-native-maps";
  import MapViewDirections from "react-native-maps-directions";
  import { windowHeight, windowWidth } from "@/themes/app.constant";
  import { Gps, Location } from "@/utils/icons";
  import color from "@/themes/app.colors";
  import Button from "@/components/common/button";
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import * as GeoLocation from "expo-location";
  import { Toast } from "react-native-toast-notifications";
//   import { useGetDriverData } from "@/hooks/useGetDriverData";
  import Constants from "expo-constants";
//   import * as Notifications from "expo-notifications";
//   import * as Device from "expo-device";
  import { router } from "expo-router";
import RenderRideItem from "@/components/ride/RenderItem";
import RideCard from "@/components/ride/RiceCard";


const HomeScreen = () => {
    const { colors } = useTheme();
    const [recentRides, setrecentRides] = useState([]);
    const [userData, setUserData] = useState<any>(null);
    const [isOn, setIsOn] = useState<any>();
    const [loading, setloading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [region, setRegion] = useState<any>({
      latitude: 6.5244,
      longitude: 3.3792,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    const handleStatusChange = () => {
        console.log("object")
    }
  return (
    <View style={[external.fx_1]}>
    <View style={styles.spaceBelow}>
      <Header isOn={true} toggleSwitch={() => handleStatusChange()} />
      <FlatList
        data={rideData}
        numColumns={2}
        renderItem={({ item }) => (
          <RenderRideItem item={item} colors={colors} />
        )}
      />
      <View style={[styles.rideContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.rideTitle, { color: colors.text }]}>
          Recent Rides
        </Text>
        <ScrollView>
          {recentRides?.map((item: any, index: number) => (
            <RideCard item={item} key={index} />
          ))}
          {recentRides?.length === 0 && (
            <Text>You didn't take any ride yet!</Text>
          )}
        </ScrollView>
      </View>
    </View>
    <Modal
      transparent={true}
      visible={isModalVisible}
      // onRequestClose={handleClose}
    >
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View>
            <Text style={styles.modalTitle}>New Ride Request Received!</Text>
            <MapView
              style={{ height: windowHeight(180) }}
            //   region={region}
            //   onRegionChangeComplete={(region) => setRegion(region)}
            >
              {/* {marker && <Marker coordinate={marker} />}
              {currentLocation && <Marker coordinate={currentLocation} />}
              {currentLocation && marker && (
                <MapViewDirections
                  origin={currentLocation}
                  destination={marker}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )} */}
            </MapView>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.leftView}>
                {/* <Location color={colors.text} /> */}
                <View
                  style={[
                    styles.verticaldot,
                    { borderColor: color.buttonBg },
                  ]}
                />
                <Gps colors={colors.text} />
              </View>
              <View style={styles.rightView}>
                <Text style={[styles.pickup, { color: colors.text }]}>
                  {/* {currentLocationName} */}
                </Text>
                <View style={styles.border} />
                <Text style={[styles.drop, { color: colors.text }]}>
                  {/* {destinationLocationName} */}
                </Text>
              </View>
            </View>
            <Text
              style={{
                paddingTop: windowHeight(5),
                fontSize: windowHeight(14),
              }}
            >
              {/* Distance: {distance} km */}
            </Text>
            <Text
              style={{
                paddingVertical: windowHeight(5),
                paddingBottom: windowHeight(5),
                fontSize: windowHeight(14),
              }}
            >
              Amount:
              {/* {(distance * parseInt(driver?.rate!)).toFixed(2)} BDT */}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: windowHeight(5),
              }}
            >
              <Button
                title="Decline"
                // onPress={handleClose}
                width={windowWidth(120)}
                height={windowHeight(30)}
                backgroundColor="crimson"
              />
              <Button
                title="Accept"
                // onPress={() => acceptRideHandler()}
                width={windowWidth(120)}
                height={windowHeight(30)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  </View>
  )
}

export default HomeScreen
