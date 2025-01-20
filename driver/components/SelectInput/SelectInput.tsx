import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import fonts from "@/themes/app.fonts";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import RNPickerSelect from "react-native-picker-select";


interface InputProps {
  title?: string;
  placeholder: string;
  items: { label: string; value: string }[];
  value?: string;
  warning?: string;
  onValueChange: (value: string) => void;
  showWarning?: boolean;
}

export default function SelectInput({
  title,
  placeholder,
  items,
  value,
  warning,
  onValueChange,
  showWarning,
}: InputProps) {
  const { colors } = useTheme();
  
  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 15,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      color: color.secondaryFont,
      backgroundColor: color.lightGray,
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      color: color.secondaryFont,
      backgroundColor: color.lightGray,
      paddingRight: 30,
    },
    iconContainer: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: 12,
    },
  };

  return (
    <View>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
       <TouchableOpacity style={styles.touchableWrapper} activeOpacity={0.7}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: placeholder,
            value: null,
          }}
          style={pickerSelectStyles}
          value={value}
          touchableWrapperProps={{
            activeOpacity: 1
          }}
          Icon={() => (
            <View style={styles.iconStyle}>
              <Text>▼</Text>
            </View>
          )}
        />
      </TouchableOpacity>
      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.medium,
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  warning: {
    color: color.red,
    marginTop: 3,
  },
  iconStyle: {
    position: 'absolute',
    right: 10,
  },
  touchableWrapper: {
    width: '100%',
  }
});

// const styles = StyleSheet.create({
//   title: {
//     fontFamily: fonts.medium,
//     fontSize: windowWidth(20),
//     marginVertical: windowHeight(8),
//   },
//   input: {
//     borderRadius: 5,
//     borderWidth: 1,
//     marginBottom: 5,
//     height: windowHeight(30),
//     color: color.secondaryFont,
//     paddingHorizontal: 10,
//   },
//   warning: {
//     color: color.red,
//     marginTop: 3,
//   },
// });