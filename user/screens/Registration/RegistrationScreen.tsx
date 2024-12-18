import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import TitleView from "@/components/signup/titleView";
import Input from "@/components/common/Input";
import Button from "@/components/common/button";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";

interface FormDataType {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  referralId: string;
}
const RegistrationScreen = () => {
  const { colors } = useTheme();
  const { user } = useLocalSearchParams() as any;
  const [emailFormatWarning, setEmailFormatWarning] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    referralId: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const handleRegistration = async () => {
    const userData: any = {
      id: user?.id,
      name: formData.name,
      email: formData.email,
      phone_number: user.phone_number
    }
    router.push({
      pathname: "/(routes)/email-verification/",
      params: {
        user: userData
      }
    })
  }
  return (
    <ScrollView>
      <View>
        {/* logo */}
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowHeight(25),
            paddingTop: windowHeight(50),
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
              <TitleView
                title={"Create Your Account"}
                subTitle="Explore the horizon by joining Ride Wave"
              />
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
                value={user?.phone_number}
                // value={parsedUser?.phone_number}
                disabled={true}
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
                  //   onPress={() => handleSubmit()}
                  title="Next"
                  //   disabled={loading}
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
});
