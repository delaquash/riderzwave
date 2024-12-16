import { View, Text, TextInput } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { external } from "@/styles/external.style";
import styles from "@/screens/LoginScreen/styles";
import color from "@/themes/app.colors";
import SelectInput from "../common/select-input";
import { useState } from "react";
import { countryItems } from "@/configs/countryList";


interface Props {
  width?: number;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}


export default function PhoneNumberInput({ width, countryCode, phoneNumber, setCountryCode, setPhoneNumber }: Props) {
  
  return (
    <View>
      <Text
        style={[commonStyles.mediumTextBlack, { marginTop: windowHeight(8) }]}
      >
        Phone Number
      </Text>
      <View
        style={[
          external.fd_row,
          external.ai_center,
          external.mt_5,
          { flexDirection: "row" },
        ]}
      >
        <View
          style={[
            styles.countryCodeContainer,
            {
              borderColor: color.border,
            },
          ]}
        >
         
          <SelectInput 
            title="+234"
            placeholder="Select Country Code"
            value={countryCode}
            showWarning={false}
            warning={"Please select your country code"}
            onValueChange={(text)=>setCountryCode(text)}
            items={countryItems}
          
          />
        </View>
        <View
          style={[
            styles.phoneNumberInput,
            {
              width: width || windowWidth(326),
              borderColor: color.border,
            },
          ]}
        >
          <TextInput
            style={[commonStyles.regularText]}
            placeholderTextColor={color.subtitle}
            placeholder={"Enter your number"}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
}
