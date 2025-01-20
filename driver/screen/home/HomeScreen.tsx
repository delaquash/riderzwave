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
import { router } from "expo-router";
import RenderRideItem from "@/components/ride/RenderItem";
import RideCard from "@/components/ride/RiceCard";
import { useGetDriverData } from "@/hooks/useGetDriverData";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const HomeScreen = () => {
    const { colors } = useTheme();
    const notificationListener = useRef<any>();
    const { driver, isLoading: DriverDataLoading } = useGetDriverData();
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
    const [currentLocationName, setcurrentLocationName] = useState("");
    const [destinationLocationName, setdestinationLocationName] = useState("");
    const [distance, setdistance] = useState<any>();
    const [wsConnected, setWsConnected] = useState(false);
    const [marker, setMarker] = useState<any>(null);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [lastLocation, setLastLocation] = useState<any>(null);
    const ws = new WebSocket("ws://192.168.0.111:8081");
    // const [driver, setDriver] = useState<any>(null);


    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });


    useEffect(() => {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          // Handle the notification and extract data
          const orderData = JSON.parse(
            notification.request.content.data.orderData
          );
          setIsModalVisible(true);
          setCurrentLocation({
            latitude: orderData.currentLocation.latitude,
            longitude: orderData.currentLocation.longitude,
          });
          setMarker({
            latitude: orderData.marker.latitude,
            longitude: orderData.marker.longitude,
          });
          setRegion({
            latitude:
              (orderData.currentLocation.latitude + orderData.marker.latitude) /
              2,
            longitude:
              (orderData.currentLocation.longitude + orderData.marker.longitude) /
              2,
            latitudeDelta:
              Math.abs(
                orderData.currentLocation.latitude - orderData.marker.latitude
              ) * 2,
            longitudeDelta:
              Math.abs(
                orderData.currentLocation.longitude - orderData.marker.longitude
              ) * 2,
          });
          setdistance(orderData.distance);
          setcurrentLocationName(orderData.currentLocationName);
          setdestinationLocationName(orderData.destinationLocation);
          setUserData(orderData.user);
        });
  
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      };
    }, []);


    useEffect(() => {
      registerForPushNotificationsAsync();
    }, []);
  
    async function registerForPushNotificationsAsync() {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Toast.show("Failed to get push token for push notification!", {
            type: "danger",
          });
          return;
        }
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          Toast.show("Failed to get project id for push notification!", {
            type: "danger",
          });
        }
        try {
          const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;
          console.log(pushTokenString);
          // return pushTokenString;
        } catch (e: unknown) {
          Toast.show(`${e}`, {
            type: "danger",
          });
        }
      } else {
        Toast.show("Must use physical device for Push Notifications", {
          type: "danger",
        });
      }
  
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    }
  

    const handleStatusChange =async () => {
      if(!loading) {
        setloading(true)
        const accessToken = await AsyncStorage.getItem("accessToken")
        const changeStatus = await axios.put("http://192.168.0.111:7000/api/v1/driver/update-status", {
          status: isOn ? "active" : "inactive",
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if(changeStatus.data){
          setIsOn(!isOn)
          await AsyncStorage.setItem("status", changeStatus.data.driver.status);
          setloading(false)
        } else {
          setloading(false)
        }
      }
    }

    useEffect(()=> {
      const getStatus = async () => {
        const status = await AsyncStorage.getItem("status")
        setIsOn(status === "active" ? true : false);                
      }
      getStatus()
    }, [])
    const handleClose = () => {
      setIsModalVisible(false)
    }

    useEffect(() => {
        ws.onopen = () => {
          console.log("Connected to ws");
          setWsConnected(true);
        }

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          console.log("Received message:", data); // Debugging line
        }

        ws.onerror = (e) => {
          console.log("WebSocket error:", e);
        }

        return () => {
          ws.close();
        }
    }, [])

    const haversineDistance = (coords1: any, coords2: any) => {
      const toRad = (x: any) => (x * Math.PI) / 180;
  
      const R = 6371e3; // Radius of the Earth in meters
      const lat1 = toRad(coords1.latitude);
      const lat2 = toRad(coords2.latitude);
      const deltaLat = toRad(coords2.latitude - coords1.latitude);
      const deltaLon = toRad(coords2.longitude - coords1.longitude);
  
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      const distance = R * c; // Distance in meters
      return distance;
    };
  


    const sendLocationUpdate=(location: any)=> {
        if (ws.readyState === WebSocket.OPEN) {
          const message:any = JSON.stringify({
            "type": "locationUpdate",
            data: location,
            role: "driver",
            driver: driver?.id
          });
          ws.send(message);
      }
    }

    useEffect(()=> {
      (async () => {
        let { status } = await GeoLocation.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Toast.show("Please give permission to access location to use");
          return;
        }

        await GeoLocation.watchPositionAsync(
          {
            accuracy: Geolocation.Accuracy.High,
            distanceInterval: 1,
            timeInterval: 1000,
          }, (position) => {
            const { latitude, longitude} = position.coords
            const newLocation = { latitude, longitude };

            if(lastLocation){
              const distance = haversineDistance(lastLocation, newLocation);            
            if(lastLocation > 200){
              setCurrentLocation(newLocation)
              setLastLocation(newLocation)
            }

            if(driver && wsConnected) {
              setLastLocation(newLocation)
            } else {
                setCurrentLocation(newLocation)
                setLastLocation(newLocation)
                if(driver && wsConnected) {
                  sendLocationUpdate(newLocation)
                }
            }
          }
          }
        )
      })();
    }, [driver])
  return ( 
    <View style={[external.fx_1]}>
    <View style={styles.spaceBelow}>
      <Header isOn={true} toggleSwitch={() => handleStatusChange()} />
      {/* <FlatList
        data={rideData}
        numColumns={2}
        renderItem={({ item }) => (
          <RenderRideItem item={item} colors={colors} />
          // <Text>Render Item Screen</Text>

        )}
      /> */}
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
      onRequestClose={handleClose}
    >
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View>
            <Text style={styles.modalTitle}>New Ride Request Received!</Text>
            <MapView
              style={{ height: windowHeight(180) }}
              region={region}
              onRegionChangeComplete={(region) => setRegion(region)}
            >
              {marker && <Marker coordinate={marker} />}
              {currentLocation && <Marker coordinate={currentLocation} />}
              {currentLocation && marker && (
                <MapViewDirections
                  origin={currentLocation}
                  destination={marker}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )} 
            </MapView>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.leftView}>
                <Location color={colors.text} />
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
