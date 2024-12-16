import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import SignInText from '@/components/login/signin.text'
import { commonStyles } from '@/styles/common.style'
import color from '@/themes/app.colors'
import { windowHeight } from '@/themes/app.constant'
import AuthContainer from '@/utils/container/auth-container'
import { style } from '../OtpVerification/styles'
import { external } from "@/styles/external.style";
import OTPTextInput from "react-native-otp-textinput";
import { useToast } from 'react-native-toast-notifications'
import axios from 'axios'


const EmailVerification = () => {
  const toast = useToast()
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useLocalSearchParams() as any
  const parsedUser = JSON.parse(user)

  const handleSubmit = async() => {
    await axios.post("http://192.168.0.111:7000/api/v1/user/email-otp-verification",{
        email: parsedUser?.email, 
        name: parsedUser?.name, 
        userId: parsedUser?.id
    }).then((res)=> {
        console.log(res)
    }).catch((error)=> {
        console.log(error)
    })
  }
  return (
    <AuthContainer
        topSpace={windowHeight(240)}
        imageShow={true}
        container={
            <View>
                <SignInText 
                    title={"Email Verification"}
                    subtitle={"Check Your Email for OTP Code"}
                />
                <OTPTextInput
                    inputCount={6}
                    handleTextChange={(code) => setOtp(code)}
                    textInputStyle={style.otpTextInput}
                    autoFocus={true}
                    tintColor={color.subtitle}
                />
                <View style={[external.mt_30]}>
                    <Button 
                        title="Verify"
                        // onPress={() => router.push("/(tabs)/home")}
                        // onPress={()=>handleSubmit()}
                    />
                </View>
                <View style={[external.mb_15]}>
                    <View style={[external.p_10, external.Pb_10,{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 5
                    }]}>
                        <Text style={[commonStyles.regularText]}>Not Received Yet</Text>
                        <TouchableOpacity>
                            <Text style={[style.signUpText, { color: "#000"}]}>Resend It</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
   />
  )
}

export default EmailVerification

const styles = StyleSheet.create({})