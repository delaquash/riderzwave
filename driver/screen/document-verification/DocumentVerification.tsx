import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { windowHeight } from '@/themes/app.constant'
import ProgressBar from '@/components/common/ProgressBar'

const DocumentVerification = () => {
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
        <View>
            <ProgressBar fill={1}/>
        </View>
      </View>
    </ScrollView>
  )
}

export default DocumentVerification

const styles = StyleSheet.create({})