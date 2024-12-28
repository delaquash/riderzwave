import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import styles from './style';
import { windowHeight, windowWidth } from '@/themes/app.constant';
import TitleView from '@/components/TitleView/TitleView';
import ProgressBar from '@/components/common/ProgressBar';
import Input from '@/components/common/input';
import SelectInput from '@/components/SelectInput/SelectInput';
import { useTheme } from '@react-navigation/native';
import Button from '@/components/common/button';
import color from '@/themes/app.colors';
import { countryNameItems } from '@/configs/countryNameList';


const SignUp = () => {
    const { colors } = useTheme();
    const [emailFormatWarning, setEmailFormatWarning] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      phoneNumber: "",
      email: "",
      country: "Nigeria NG",
    });
  
    const handleChange = (key: string, value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    };
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
            <View style={{ padding: windowWidth(20) }}>
              <ProgressBar fill={1} />
              <View
                style={[styles.subView, { backgroundColor: colors.background }]}
              >
                <View style={styles.space}>
                  <TitleView
                    title={"Create your account"}
                    subTitle={"Explore your life by joining Ride Wave"}
                  />
                  <Input
                    title="Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChangeText={(text) => handleChange("name", text)}
                    showWarning={showWarning && formData.name === ""}
                    warning={"Please enter your name!"}
                  />
                  <SelectInput
                    title="Country"
                    placeholder="Select your country"
                    value={formData.country}
                    onValueChange={(text) => handleChange("countryCode", text)}
                    showWarning={showWarning && formData.country === ""}
                    items={countryNameItems}
                  />
                  <Input
                    title="Phone Number"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => handleChange("phoneNumber", text)}
                    showWarning={showWarning && formData.phoneNumber === ""}
                    warning={"Please enter your phone number!"}
                  />
                  <Input
                    title={"Email Address"}
                    placeholder={"Enter your email address"}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    showWarning={
                      showWarning &&
                      (formData.email === "" || emailFormatWarning !== "")
                    }
                    warning={
                      emailFormatWarning !== ""
                        ? "Please enter your email!"
                        : "Please enter a validate email!"
                    }
                    emailFormatWarning={emailFormatWarning}
                  />
                </View>
                <View style={styles.margin}>
                  <Button
                    // onPress={gotoDocument}
                    height={windowHeight(30)}
                    title={"Next"}
                    backgroundColor={color.buttonBg}
                    textColor={color.whiteColor}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }
export default SignUp

