import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SignInText from "@/components/login/signin.text";
import Button from "@/components/common/button";
import { external } from "@/styles/external.style";
import { router, useLocalSearchParams } from "expo-router";
import { commonStyles } from "@/styles/common.style";
import color from "@/themes/app.colors";
import OTPTextInput from "react-native-otp-textinput";
import { style } from "./style";
import AuthContainer from "@/utils/container/AuthContainer";
import { windowHeight } from "@/themes/app.constant";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function PhoneNumberVerificationScreen() {
    const driver = useLocalSearchParams();
    const [otp, setOtp] = useState("");
    const [loader, setLoader] = useState(false);

//     const handleSubmit = async () => {
//       if(otp === ""){
//         Toast.show("Please fill the fields",{
//           placement: "bottom",
//           duration: 5000,
//           animationType:"slide-in"
//         })
//         try {
//           setLoader(true)
//           const otpNumbers = `${otp}`;
//           await axios
//           .post("http://192.168.0.111:7000/api/v1/driver/verify-otp", {
//             phone_number: driver?.phone_number,
//             otp: otpNumbers,
//             ...driver
//           }).then((res)=> {
//             console.log(res.data)
//             const driverData = {
//               ...driver,
//               token: res.data.token
//             }
//             setLoader(false)
//             router.push({
//               pathname: "/(routes)/email-verification",
//               params: driverData
//             });
//           }).catch((error) => {
//             console.log(error)
//             setLoader(false)
//             Toast.show("Your otp is incorrect",{
//               placement: "bottom",
//               duration: 5000,
//               type: "danger"
//             })
//           })
//         } catch (error) {
//           console.log(error)
//         }
//     //   } else {
//     //     if(driver.name) {
//     //       setLoader(true)
//     //       const otpNumbers = `${otp}`;
//     //       await axios
//     //       .post("http://192.168.0.111:7000/api/v1/driver/verify-otp", {
//     //         phone_number: driver?.phone_number,
//     //         otp: otpNumbers,
//     //         ...driver
//     //       }).then((res)=> {
//     //         console.log(res.data)
//     //         const driverData = {
//     //           ...driver,
//     //           token: res.data.token
//     //         }
//     //         setLoader(false)
//     //         router.push({
//     //           pathname: "/(routes)/email-verification",
//     //           params: driverData
//     //         });
//     //       }).catch((error) => {
//     //         console.log(error)
//     //         setLoader(false)
//     //         Toast.show("Your otp is incorrect",{
//     //           placement: "bottom",
//     //           duration: 5000,
//     //           type: "danger"
//     //         })
//     //       })
//     //   } else {
//     //     setLoader(true)
//     //     const otpNumbers = `${otp}`;
//     //     await axios
//     //     .post("http://192.168.0.111:7000/api/v1/driver/login", {
//     //       phone_number: driver?.phone_number,
//     //       otp: otpNumbers,
//     //     }).then(async(res)=> {
//     //       console.log(res.data)
//     //       setLoader(false)
//     //       await AsyncStorage.setItem("accessToken", res.data.accessToken);
//     //       router.push("/(tabs)/home");
//     //     }).catch((error) => {
//     //       console.log(error)
//     //       setLoader(false)
//     //         Toast.show("Your otp is incorrect",{
//     //         placement: "bottom",
//     //         duration: 5000,
//     //         type: "danger"
//     //       })
//     //     })
//     //   }
//     // }
//   }
// }

const handleSubmit = async () => {
  if (otp === "") {
    // Show a toast notification if OTP is empty
    Toast.show("Please fill the fields", {
      placement: "bottom",
      duration: 5000,
      animationType: "slide-in",
    });
    return; // Exit the function to prevent further execution
  }
  
  try {
    setLoader(true); // Show the loader while making the API call
    const otpNumbers = `${otp}`; // Convert OTP to a string
  
    // Make the API request to verify OTP
    await axios
      .post("http://192.168.0.111:7000/api/v1/driver/verify-otp", {
        phone_number: driver?.phone_number, // Driver's phone number
        otp: otpNumbers, // OTP entered by the user
        ...driver, // Additional driver details
      })
      .then((res) => {
        // On successful response
        console.log(res.data);
  
        // Merge the token into the driver data
        const driverData = {
          ...driver,
          token: res.data.token,
        };
  
        setLoader(false); // Hide the loader
  
        // Navigate to the email verification screen
        router.push({
          pathname: "/(routes)/signup",
          params: driverData,
        });
      })
      .catch((error) => {
        // Handle errors from the API call
        console.log(error);
        setLoader(false); // Hide the loader
  
        // Show an error toast if OTP is incorrect
        Toast.show("Your otp is incorrect", {
          placement: "bottom",
          duration: 5000,
          type: "danger", // Red toast indicating an error
        });
      });
  } catch (error) {
    // Catch any unexpected errors
    console.log(error);
  } finally {
    // Ensure the loader is hidden even if an error occurs
    setLoader(false);
  }
  
}
    return (
        <AuthContainer
          topSpace={windowHeight(240)}
          imageShow={true}
          container={
            <View>
              <SignInText
                title={"Phone Number Verification"}
                subtitle={"Check your phone number for the otp!"}
              />
              <OTPTextInput
                handleTextChange={(code) => setOtp(code)}
                inputCount={6}
                textInputStyle={style.otpTextInput}
                tintColor={color.subtitle}
                autoFocus={false}
              />
              <View style={[external.mt_30]}>
                <Button
                  title="Verify"
                  height={windowHeight(30)}
                  onPress={() => handleSubmit()}
                  disabled={loader}
                />
              </View>
              <View style={[external.mb_15]}>
                <View
                  style={[
                    external.pt_10,
                    external.Pb_10,
                    {
                      flexDirection: "row",
                      gap: 5,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={[commonStyles.regularText]}>Not Received yet?</Text>
                  <TouchableOpacity>
                    <Text style={[style.signUpText, { color: "#000" }]}>
                      Resend it
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        />
      );
    }