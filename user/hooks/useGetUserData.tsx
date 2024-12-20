import axios from "axios";
import { useEffect, useState } from "react";

import { View, Text } from 'react-native'
import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
useEffect(() => {},)


const useGetUserData = () => {
    const [user, setuser] = useState<UserType>()
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
        const getLoggedInUserData = async () => {
            const accessToken = await AsyncStorage.getItem("accessToken");
            axios.get("http://192.168.0.111:7000/api/v1/user/getUsersLoggedIn", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then((res: any) => {
                setuser(res.data.user)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
                setLoading(false)
            })
        }
        getLoggedInUserData()
    }, [])
return { loading, user }
}

export default useGetUserData