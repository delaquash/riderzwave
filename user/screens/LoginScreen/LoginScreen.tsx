import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AuthContainer from '@/utils/container/auth-container'
import { windowHeight, windowWidth } from '@/themes/app.constant'
import  styles  from "./styles";
import Images from '@/utils/images';
import SignInText from '@/components/login/signin.text';
import PhoneNumberInput from '@/components/login/phone-number.input';
import Button from '@/components/common/button';
import { router } from 'expo-router';
import { external } from '@/styles/external.style';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState("+234")
    const toast = useToast()
     const handleSubmit = async() => {
         if( phoneNumber === ""  || countryCode === ""){
             toast.show("Please fill all the fields", {
                 placement: "bottom",
                 duration: 50000,
                 dangerColor: "red"
             })
         } else {
            setLoading(true)
             const ValidPhoneNumber = `${countryCode}${phoneNumber}`
             await axios.post("http://192.168.0.111:7000/api/v1/user/register",{
                 phone_number: ValidPhoneNumber
             }).then((res)=> {
                setLoading(false)
                 router.push({
                     pathname: "/(routes)/otp-verification",
                     params: {
                         ValidPhoneNumber
                     }
                 })
             })
             .catch((error)=> {
                setLoading(false)
                 toast.show(
                     "Something went wrong! Please recheck your number",
                     {
                         type: "danger",
                         placement: "bottom",
                         duration: 500
                     }
                 )
             })
         }
     }
  return (
    <AuthContainer
        imageShow={true}
        topSpace={windowHeight(150)}
        container={
            <View>
                <View>
                    <View>
                        <Image 
                            style={styles.transformLine}
                            source={Images.line}
                        />
                        <SignInText />
                        <View style={[external.mt_25, external.Pb_10]}>
                            <PhoneNumberInput 
                                phoneNumber={phoneNumber}
                                setPhoneNumber={setPhoneNumber}
                                countryCode={countryCode}
                                setCountryCode={setCountryCode}
                            />
                            <View style={[external.mt_25, external.Pb_15]}>
                                <Button 
                                    title='Get OTP'
                                    onPress={()=>handleSubmit()}
                                    disabled={loading}
                                    // onPress={() =>router.push("/(routes)/otp-verification")}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        }
    />

  )
}

export default LoginScreen

