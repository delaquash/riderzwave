import { View, Text, TextInput } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { external } from "@/styles/external.style";
import styles from "@/screen/login/style"
import color from "@/themes/app.colors";
import React from "react";
import SelectInput from "../SelectInput/SelectInput";
import { countryItems } from "@/configs/countrylist";


interface Props {
  width?: number;
  phone_number: string;
  setPhone_number: (phone_number: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}
export default function PhoneNumberInput({ width, countryCode, phone_number, setCountryCode, setPhone_number }: Props) {
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
          {/* <TextInput
            style={[commonStyles.regularText]}
            placeholderTextColor={color.subtitle}
            placeholder="+880"
            keyboardType="numeric"
          /> */}
             <SelectInput 
            // title="+234"
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
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
}
