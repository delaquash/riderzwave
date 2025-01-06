import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";


export const useGetDriverData = () => {
    const [isLoading, setisLoading] = useState(true);
    const [driver, setDriver] = useState<DriverType>()

    useEffect(()=> {
        const getLoggedInDriverData = async () => {
            const driverAccessToken = await AsyncStorage.getItem("driverAccessToken");
            axios.get("http://192.168.0.111:7000/api/v1/driver/getDriversLoggedIn", {
                headers: {
                    Authorization: `Bearer ${driverAccessToken}`
                }
            }).then((res: any) => {
                setDriver(res.data.driver)
                setisLoading(false)
            }).catch((error) => {
                console.log(error)
                setisLoading(false)
                
            })
        }
        getLoggedInDriverData()
    }, [])
    return { isLoading, driver }
}