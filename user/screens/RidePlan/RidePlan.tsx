import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./style";
import MapView, { Marker } from "react-native-maps";
import { external } from "@/styles/external.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import MapViewDirections from "react-native-maps-directions";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Clock, LeftArrow, PickLocation, PickUpLocation } from "@/utils/icons";
import color from "@/themes/app.colors";
import DownArrow from "@/assets/icons/downArrow";
import PlaceHolder from "@/assets/icons/placeHolder";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Location from "expo-location";
import axios from "axios";
import _ from "lodash";
import { Toast } from "react-native-toast-notifications";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import Button from "@/components/common/button";
import { parseDuration } from "@/utils/time/ParsedDuration";
import moment from "moment";

const RidePlan = () => {
  const [marker, setMarker] = useState<any>(null);
  const [places, setPlaces] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [distance, setDistance] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [region, setRegion] = useState<any>({
    latitude: 9.082, // Nigeria's approximate center latitude
    longitude: 8.6753, // Nigeria's approximate center longitude
    latitudeDelta: 8.0, // Zoom level for regional coverage
    longitudeDelta: 8.0, // Zoom level for regional coverage
  });
  const [travelTimes, setTravelTimes] = useState({
    driving: null,
    walking: null,
    cycling: null,
    transit: null,
  });
  const [keyboardAvoidingHeight, setkeyboardAvoidingHeight] = useState(false);
  const [driverLists, setdriverLists] = useState([]);
  const [selectedDriver, setselectedDriver] = useState<DriverType>();
  const [driverLoader, setdriverLoader] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show(
          "Please approve your location tracking otherwise you can't use this app!",
          {
            type: "danger",
            placement: "bottom",
          }
        );
      }
      let locaton = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = locaton.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 8.0, // Zoom level for regional coverage
        longitudeDelta: 8.0, // Zoom level for regional coverage
      });
    })();
  }, []);

  const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  };

  const getEstimatedArrivalTime = (travelTime: any) => {
    const now = moment();
    const travelMinutes = parseDuration(travelTime);
    const arrivalTime = now.add(travelMinutes, "minutes");
    return arrivalTime.format("hh:mm A");
  };
  const fetchPlaces = async (input: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/autocomplete/json`,
        {
          params: {
            input,
            key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
            language: "en",
          },
        }
      );
      setPlaces(response.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchPlaces = useCallback(_.debounce(fetchPlaces, 100), []);

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchPlaces(query);
    } else {
      setPlaces([]);
    }
  }, [query, debouncedFetchPlaces]);

  const handleInputChange = (text: any) => {
    setQuery(text);
  };

  const fetchTravelTimes = async (origin: any, destination: any) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    let travelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    } as any;
    for (const mode of modes) {
      let params = {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: `${destination.latitude},${destination.longitude}`,
        key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!,
        mode: mode,
      } as any;

      if (mode === "driving") {
        params.departure_time = "now";
      }

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json`,
          { params }
        );

        const elements = response.data.rows[0].elements[0];
        if (elements.status === "OK") {
          travelTimes[mode] = elements.duration.text;
        }
      } catch (error) {
        console.log(error);
      }
    }
    setTravelTimes(travelTimes);
  };
  const handlePlaceSelect = async (placeId: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
            language: "en",
          },
        }
      );
      const { lat, lng } = response.data.result.geometry.location;
      const selectedDestination = { latitude: lat, longitude: lng };
      setRegion({
        ...region,
        latitude: lat,
        longitude: lng,
      });
      setMarker({
        latitude: lat,
        longitude: lng,
      });
      setPlaces([]);
      setLocationSelected(true);
      setkeyboardAvoidingHeight(false);
      if (currentLocation) {
        await fetchTravelTimes(currentLocation, selectedDestination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=> {
    if(marker && currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        marker.latitude,
        marker.longitude
      )
    }
  },[marker, currentLocation])
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[external.fx_1]}
    >
      <View>
        <View
          style={{ height: windowHeight(!keyboardAvoidingHeight ? 500 : 300) }}
        >
          <MapView
            style={{ flex: 1 }}
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
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={[styles.container]}>
          {locationSelected ? (
              <ScrollView
                style={{
                  height: windowHeight(280),
                  paddingBottom: windowWidth(20),
                }}
              >
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#b5b5b5",
                    flexDirection: "row",
                    paddingBottom: windowHeight(10)
                  }}
                >
                  <Pressable
                    onPress={()=>setLocationSelected(false)}
                  >
                    <LeftArrow />
                  </Pressable>
                  <Text
                    style={{
                      margin: "auto",
                      fontSize: 20,
                      fontWeight: "600",
                    }}
                  >
                    Gathering Options
                  </Text>
                </View>
                <View
                  style={{
                    padding: windowHeight(10)
                  }}
                >
                  <Pressable
                    style={{
                      marginVertical: 5,
                      padding: 10,
                      borderRadius: 10,
                      width: 420,
                      // borderWidth: selectedVehcile === driver.vehicle_type ? 2 : 0,
                    }}
                    onPress={() => {}}
                  >
                    <View style={{ margin: "auto"}}>
                      <Image 
                        source={require("@/assets/images/vehicles/car.png")}
                        style={{ width: 90, height: 80 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: windowHeight(10)
                      }}
                    >
                      <View>
                      <Text style={{ fontSize: 20, fontWeight: "600" }}>
                              {/* RideWave {driver?.vehicle_type} */}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                              {/* {getEstimatedArrivalTime(travelTimes.driving)}{" "} */}
                              dropoff
                            </Text>
                      </View>
                      <Text
                            style={{
                              fontSize: windowWidth(20),
                              fontWeight: "600",
                            }}
                          >
                            BDT{" "}
                            {/* {(
                              distance.toFixed(2) * parseInt(driver.rate)
                            ).toFixed(2)} */}
                          </Text>
                    </View>
                  </Pressable>
                  <View
                      style={{
                        paddingHorizontal: windowWidth(10),
                        marginTop: windowHeight(15),
                      }}
                    >
                      <Button
                        backgroundColor={"#000"}
                        textColor="#fff"
                        title={`Confirm Booking`}
                        // onPress={() => handleOrder()}
                      />
                    </View>
                </View>
              </ScrollView>
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()}>
                  <LeftArrow />
                </TouchableOpacity>
                <Text
                  style={{
                    margin: "auto",
                    fontSize: windowWidth(25),
                    fontWeight: "600",
                  }}
                >
                  Plan Your Ride
                </Text>
              </View>
              {/* Picking up time */}
              <View
                style={{
                  width: windowWidth(200),
                  height: windowWidth(28),
                  borderRadius: 20,
                  backgroundColor: color.lightGray,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: windowHeight(10),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock />
                  <Text
                    style={{
                      fontSize: windowWidth(12),
                      fontWeight: "600",
                      paddingHorizontal: 8,
                    }}
                  >
                    Pick up Now
                  </Text>
                  <DownArrow />
                </View>
              </View>
              {/* pick up location */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#0000",
                  borderRadius: 15,
                  marginBottom: windowHeight(15),
                  paddingHorizontal: windowWidth(15),
                  paddingVertical: windowHeight(5),
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <PickLocation />
                </View>
                <View
                  style={{
                    width: Dimensions.get("window").width * 1 - 110,
                    borderBottomWidth: 1,
                    borderBottomColor: "#999",
                    marginLeft: 5,
                    height: windowHeight(20),
                  }}
                >
                  <Text
                    style={{
                      color: "#2371F0",
                      fontSize: 18,
                      paddingLeft: 5,
                    }}
                  >
                    Current Location
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                }}
              >
                <PlaceHolder />
                <View
                  style={{
                    marginLeft: 5,
                    width: Dimensions.get("window").width * 1 - 110,
                  }}
                >
                  <GooglePlacesAutocomplete
                    placeholder="Where do you want to go to?"
                    onPress={(data, details = null) => {
                      setkeyboardAvoidingHeight(true);
                      setPlaces([
                        {
                          description: data.description,
                          place_id: data.place_id,
                        },
                      ]);
                    }}
                    query={{
                      language: "en",
                      key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
                    }}
                    styles={{
                      textInputContainer: {
                        width: "100%",
                      },
                      textInput: {
                        height: 38,
                        color: "#000",
                        fontSize: 16,
                      },
                      predefinedPlacesDescription: {
                        color: "#000",
                      },
                    }}
                    textInputProps={{
                      onChangeText: (text) => handleInputChange(text),
                      value: query,
                      onFocus: () => setkeyboardAvoidingHeight(true),
                    }}
                    onFail={(error) => console.log(error)}
                    fetchDetails={true}
                    debounce={200}
                  />
                </View>
              </View>
              {/* </View> */}
              {/* last sessions */}
              {places.map((place: any, index: number) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: windowHeight(20),
                  }}
                  onPress={() => handlePlaceSelect(place.place_id)}
                >
                  <PickUpLocation />
                  <Text
                    style={{
                      paddingLeft: 15,
                      fontSize: 18,
                    }}
                  >
                    {place.description}
                  </Text>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RidePlan;
