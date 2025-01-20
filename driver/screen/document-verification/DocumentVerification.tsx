import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { windowHeight, windowWidth } from '@/themes/app.constant'
import ProgressBar from '@/components/common/ProgressBar'
import TitleView from '@/components/TitleView/TitleView'
import style from "../signup/style";
import color from '@/themes/app.colors'
import Input from '@/components/common/input'
import SelectInput from '@/components/SelectInput/SelectInput'
import Button from '@/components/common/button'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { Toast } from 'react-native-toast-notifications'
import { useTheme } from '@react-navigation/native'

const DocumentVerification = () => {
  const driverData = useLocalSearchParams();
  const { colors } = useTheme();
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "Car",
    registrationNumber: "",
    registrationDate: "",
    drivingLicenseNumber: "",
    color: "",
    rate: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async() => {
    setLoading(true)
    const driver = {
      ...driverData,
      vehicleType: formData.vehicleType,
      registrationNumber: formData.registrationNumber,
      registrationDate: formData.registrationDate,
      drivingLicenseNumber: formData.drivingLicenseNumber,
      color: formData.color,
      rate: formData.rate,
    };
    
    await axios.post("http://192.168.0.111:7000/api/v1/driver/send-otp-to-driver", {
      phone_number: `+234${driverData.phone_number}`,
    }).then((res) => {
      console.log(res.data)
      router.push({ 
        pathname: "/(routes)/phoneNumberVerification", 
        params: driver 
      })
      setLoading(false)
    }).catch((error)=> {
      setLoading(false)
      Toast.show(error.message, {
        placement: "bottom",
        type: "danger",
      })
    })
  }

  return (
    <ScrollView>
      <View>
        {/* logo */}
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowHeight(22),
            paddingTop: windowHeight(50),
            textAlign: "center",
          }}
        >
          Ride Wave
        </Text>
        <View
          style={{
            padding: windowWidth(20),
          }}
        >
            <ProgressBar fill={1} />
            <View
              style={[style.subView, { backgroundColor: colors.background}]}
            >
              <View
                style={style.space}
              >
                <TitleView 
                  title={"Vehicle Registration"}
                  subTitle={"Explore a seemless journey by joining Ride Wave"}
                />
                <SelectInput 
                  title='Vehicle Type'
                  placeholder='Choose your vehicle type'
                  value={formData.vehicleType}
                  onValueChange={(text)=>handleChange("vehicleType", text)}
                  showWarning={showWarning && formData.vehicleType === ""}
                  warning={"Please choose your vehicle type"}
                  items={[
                    { label: "Car", value: "Car" },
                    { label: "Motorcycle", value: "Motorcycle" },
                    { label: "cng", value: "cng" },
                  ]}
                />
                <Input 
                  title='Vehicle Registration Date'
                  placeholder='Enter Your Vehicle Registration Date'
                  value={formData.registrationDate}
                  onChangeText={(text)=> handleChange("registrationDate", text)}
                  showWarning={showWarning && formData.registrationDate === ""}
                  warning={"Please enter your Registration Date Number"}
                />
                <Input 
                  title={"Driving Licence Number"}
                  placeholder={"Enter your driving licence number"}
                  keyboardType='number-pad'
                  value={formData.drivingLicenseNumber}
                  onChangeText={(text)=> handleChange("drivingLicenseNumber", text)}
                  showWarning={showWarning && formData.drivingLicenseNumber === ""}
                  warning={"Please enter your Driving Licence Number"}
                
                />
                <Input
                title={"Vehicle Color"}
                placeholder={"Enter your vehicle color"}
                value={formData.color}
                onChangeText={(text) => handleChange("color", text)}
                showWarning={showWarning && formData.color === ""}
                warning={"Please enter your vehicle color!"}
              />
              <Input
                title={"Rate per km"}
                placeholder={
                  "How much you want to charge from your passenger per km."
                }
                keyboardType="number-pad"
                value={formData.rate}
                onChangeText={(text) => handleChange("rate", text)}
                showWarning={showWarning && formData.rate === ""}
                warning={
                  "Please enter how much you want to charge from your customer per km."
                }
              />
              </View>
              <View style={style.margin}>
                <Button 
                  onPress={()=>handleSubmit()}
                  title={"Submit"}
                  height={windowHeight(30)}
                  backgroundColor={color.buttonBg}
                  textColor={color.whiteColor}
                />
              </View>
            </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default DocumentVerification

const styles = StyleSheet.create({})