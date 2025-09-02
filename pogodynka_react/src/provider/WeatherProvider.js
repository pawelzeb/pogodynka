// WeatherContext.js
import { createContext, useState } from "react";

export const WeatherContext = createContext();

export function WeatherProvider({ children, onUnsubscribe, onSubscribe }) {
  const [weatherData, setWeatherData] = useState(null);

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData, onUnsubscribe, onSubscribe }}>
      {children}
    </WeatherContext.Provider>
  );
}
