import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react/cjs/react.development";
import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get("window").width;
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

function App(props) {

  const [city ,setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    // 사용자 위치 정보
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&unit=metric`);
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
    
  }; 

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.weather}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days?.length === 0 ? 
          (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" style={{
                marginTop: 10
              }}/>
            </View>
          ) 
          :
          (
            days.map((day, index) => 
              <View key={index} style={styles.day}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            )
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "yellow" },
  city: { flex: 1.2, justifyContent: "center", alignItems: "center" },
  cityName: {fontSize: 68, fontWeight: "500"}, 
  weather: { 

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems:"center"
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop:-30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20
  }
});

export default App;
