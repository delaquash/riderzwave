import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { windowHeight, windowWidth } from '@/themes/app.constant';
import { router } from 'expo-router';
import Button from '@/components/common/button';
import PhoneNumberInput from '@/components/login/phone-number.input';
import SignInText from '@/components/login/signin.text';
import AuthContainer from '@/utils/container/AuthContainer';
import { external } from "@/styles/external.style";
import Images from "@/utils/images";
import styles from './style';

const LoginScreen = () => {
  const [phone_number, setphone_number] = useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = useState("+880");
    return (
      <AuthContainer
        topSpace={windowHeight(150)}
        imageShow={true}
        container={
          <View>
            <View>
              <View>
                <Image style={styles.transformLine} source={Images.line} />
                <SignInText />
                <View style={[external.mt_25, external.Pb_10]}>
                  <PhoneNumberInput
                    phone_number={phone_number}
                    setphone_number={setphone_number}
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                  />
                  <View style={[external.mt_25, external.Pb_15]}>
                    <Button
                      title="Get Otp"
                      disabled={loading}
                      height={windowHeight(35)}
                      // onPress={() => handleSubmit()}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: windowWidth(8),
                      paddingBottom: windowHeight(15),
                    }}
                  >
                    <Text style={{ fontSize: windowHeight(12) }}>
                      Don't have any rider account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/(routes)/signup")}
                    >
                      <Text style={{ color: "blue", fontSize: windowHeight(12) }}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
      />
    );
  }

export default LoginScreen

