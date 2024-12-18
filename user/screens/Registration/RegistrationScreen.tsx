import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useState } from "react";
// import {  } from "expo-image";
import { useTheme } from "@react-navigation/native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import TitleView from "@/components/signup/titleView";
import Input from "@/components/common/Input";
import Button from "@/components/common/button";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import fonts from "@/themes/app.fonts";

 interface FormDataType {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
  referralId?: string;
}
const RegistrationScreen = () => {
  const { colors } = useTheme();
  const { user } = useLocalSearchParams() as any;
  const parsedUser = JSON.parse(user);
  console.log(parsedUser)
  const [emailFormatWarning, setEmailFormatWarning] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phoneNumber: "",
    // countryCode: "",
    // referralId: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const handleRegistration = async () => {
    setLoading(true)
      await axios.post("http://192.168.0.111:7000/api/v1/user/email-otp-request",{
          email: formData.email, 
          name: formData.name, 
          userId: parsedUser?.id
      }).then((res)=> {
        setLoading(false)
        // console.log(res)
        const userData: any = {
          id: parsedUser?.id,
          name: formData.name,
          email: formData.email,
          phone_number: parsedUser?.phone_number,
          token: res.data.token
        };
        router.push({
          pathname: "/(routes)/email-verification",
          params: {
            user: JSON.stringify(userData)
          }
        })
          
      }).catch((error)=> {
        setLoading(false)
          console.log(error)
      })
  }


   return (
     <ScrollView>
      <View style={{ marginTop: -70 }}>
      <Image
        source={require("@/assets/images/rideScreen/RegisterPageImage.jpg")}
        style={{ width: "100%", borderRadius:50}}
        resizeMode="contain"
      />
      </View>
       <View style={{ marginTop: -30 }}>
         {/* logo */}
         <Text
           style={{
             fontFamily: "TT-Octosquares-Medium",
             fontSize: windowHeight(25),
             paddingTop: windowHeight(10),
             textAlign: "center",
             
           }}
         >
           Ride Wave
         </Text>
         <View style={{ padding: windowWidth(20) }}>
           <View
             style={[styles.subView, { backgroundColor: colors.background }]}
           >
             <View style={styles.space}>
              <View style={{display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 10}}>
                <Text style={styles.mainView}>Create Your Account</Text>
                <Text style={styles.subViews}>Explore the horizon by joining Ride Wave</Text>
              </View>
               
               <Input
                 title="Name"
                 placeholder="Enter your name"
                 value={formData?.name}
                 onChangeText={(text) => handleChange("name", text)}
                 showWarning={showWarning && formData.name === ""}
                 warning={"Please enter your name!"}
               />
               <Input
                 title="Phone Number"
                 placeholder="Enter your phone number"
                 value={parsedUser?.phone_number}
                 disabled={true}
                 editable={false}
               />
               <Input
                 title="Email Address"
                 placeholder="Enter your email address"
                 keyboardType="email-address"
                 value={formData.email}
                 onChangeText={(text) => handleChange("email", text)}
                 showWarning={(showWarning && formData.name === "") || emailFormatWarning !== ""}
                 warning={emailFormatWarning !== ""? "Please enter your email!": "Please enter a validate email!"}
                 emailFormatWarning={emailFormatWarning}
               />
               <View style={styles.margin}>
                 <Button
                   onPress={() => handleRegistration()}
                   title="Next"
                   disabled={loading}
                   backgroundColor={color.buttonBg}
                   textColor={color.whiteColor}
                 />
               </View>
             </View>
           </View>
         </View>
       </View>
     </ScrollView>
   );
};

export default RegistrationScreen;

 const styles = StyleSheet.create({
   main: {
     flex: 1,
   },
   subView: {
     height: "100%",
   },
   space: {
     marginHorizontal: windowWidth(4),
   },
   margin: {
     marginVertical: windowHeight(12),
   },

    mainView: {
      fontSize: fontSizes.FONT30,
      fontFamily: fonts.medium,
      marginTop: windowHeight(2),
    },
    subViews: {
      color: color.secondaryFont,
      marginTop: windowHeight(0.6),
      fontSize: fontSizes.FONT20,
      fontFamily: fonts.medium,
      marginBottom: windowHeight(2),
    },

 });
