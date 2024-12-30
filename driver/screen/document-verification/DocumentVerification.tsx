import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '@/themes/app.constant'
import ProgressBar from '@/components/common/ProgressBar'
import TitleView from '@/components/TitleView/TitleView'
import style from "../signup/style";
import color from '@/themes/app.colors'
import Input from '@/components/common/input'
import SelectInput from '@/components/SelectInput/SelectInput'
import Button from '@/components/common/button'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { Toast } from 'react-native-toast-notifications'
import { useTheme } from '@react-navigation/native'

const DocumentVerification = () => {
  const { colors } = useTheme();
  
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
        <View
          style={{
            padding: windowWidth(20),
          }}
        >
            <ProgressBar fill={1} />
            <View
              style={[style.subView, { backgroundColor: colors.background}]}
            >
              <View
                style={style.space}
              >
                <TitleView 
                  title={"Vehicle Registration"}
                  subTitle={"Explore a seemless journey by joining Ride Wave"}
                />
                <SelectInput 
                  title='Vehicle Type'
                  placeholder='Choose your vehicle type'
                  value={}
                
                />
              </View>
            </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default DocumentVerification

const styles = StyleSheet.create({})