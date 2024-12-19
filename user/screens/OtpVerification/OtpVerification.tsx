import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import SignInText from "@/components/login/signin.text";
import OTPTextInput from "react-native-otp-textinput";
import { style } from "./styles";
import color from "@/themes/app.colors";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { router, useLocalSearchParams } from "expo-router";
import { commonStyles } from "@/styles/common.style";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpVerification = () => {
    const toast = useToast()
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const {ValidPhoneNumber} = useLocalSearchParams()

    const handleSubmit = async() => {
        if( otp === "" ){
            toast.show("Please fill all the fields", {
                placement: "bottom",
                duration: 5000,
                dangerColor: "red"
            })
        } else {
            setLoading(true)
            const otpNumber= `${otp}`
            await axios.post("http://192.168.0.111:7000/api/v1/user/verifyOtp",{
                otp: otpNumber,
                phone_number: ValidPhoneNumber
            }).then(async(res)=> {
                setLoading(false)
                if(res.data.user.email === null){
                    router.push({
                        pathname: "/(routes)/registration",
                        params: {
                            user: JSON.stringify(res.data.user)
                        } 
                    })
                    toast.show(res.data.message)
                } else {
                    await AsyncStorage.setItem("accessToken", res.data.token)
                    router.push("/(tabs)/home")
                }
            }).catch((error)=> {
                setLoading(false)
                toast.show(
                    "Something went wrong! Please recheck your number",
                    {
                        type: "danger",
                        placement: "bottom",
                    }
                )
            })
        }
    }
    
  return (
   <AuthContainer
        topSpace={windowHeight(240)}
        imageShow={true}
        container={
            <View>
                <SignInText 
                    title={"OTP Verification"}
                    subtitle={"Check Your Phone for OTP Code"}
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
                        onPress={()=>handleSubmit()}
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

export default OtpVerification
