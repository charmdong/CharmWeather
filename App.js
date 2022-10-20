import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react/cjs/react.development";
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get("window").width;
const API_KEY = "6de25efd916beedd583a9be522a0e02d";
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

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
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json);
    setDays(json.list);
  }; 

  const getDate = (dt) => {
    let result = dt.replaceAll('-', '/').substr(0, 13);
    result += "h";
    return result;
  }

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
        {days.length === 0 ? 
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
                <Fontisto name={icons[day.weather[0].main]} size={108} color="black" />
                <Text style={styles.date}>{getDate(day.dt_txt)}</Text>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}C°</Text>
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
  container: { 
    flex: 1, 
    backgroundColor: "tomato" 
  },
  city: { 
    flex: 1.2, 
    justifyContent: "center", 
    alignItems: "center",
    marginTop: 30,
  },
  cityName: {
    fontSize: 68, 
    fontWeight: "500",
    color: "white",
  }, 
  weather: { 

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems:"center",
    color: "white",
  },
  date: {
    marginTop: 30,
    fontSize: 40,
    color: "white",
  },
  temp: {
    marginTop: 30,
    fontSize: 88,
    color: "white",
  },
  description: {
    marginTop:30,
    fontSize: 60,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  }
});

export default App;
