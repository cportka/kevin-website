/* =========================================================================
   weather.js — live conditions for a place (keyless, CORS, all optional).

   Generalised from the LA widget's data layer to any latitude/longitude and
   timezone. Each source is independent and degrades gracefully: if a request
   fails the diorama keeps its sensible defaults. Marine (wave height) is only
   meaningful on a coast; air quality tints the sky when smoggy. Tide, which the
   original read from a US-only NOAA station, is modelled here as a smooth
   semidiurnal curve so it works anywhere.
   ========================================================================= */
import { isoToMinutes } from "../engine/astronomy.js";

export var WEATHER_ORIGINS = [
  "https://api.open-meteo.com",
  "https://marine-api.open-meteo.com",
  "https://air-quality-api.open-meteo.com"
];

function j(url) {
  return fetch(url, { mode: "cors" })
    .then(function (r) { return r && r.ok ? r.json() : null; })
    .catch(function () { return null; });
}

/** Sensible defaults so a scene is alive before (or without) any data. */
export function defaultState() {
  return {
    temp: null, code: 1, cloud: 25, windKph: 9,
    sunrise: 6 * 60 + 5, sunset: 19 * 60 + 40,
    waveM: 0.8, aqi: 45, tide: 0.5, isDay: 1
  };
}

/**
 * A smooth 0..1 tide level modelled from the local minute (two highs/lows a day,
 * ~12h25m period). Not a real prediction — a believable rhythm for the waterline.
 */
export function modelTide(minutes) {
  var period = 12 * 60 + 25;
  return 0.5 - 0.5 * Math.cos((minutes / period) * 2 * Math.PI);
}

/**
 * Fetch conditions into `state` (mutated in place) for {latitude, longitude,
 * timezone}. `onUpdate(state)` fires after each source lands. `coastal` gates the
 * marine request. Units: temperature 'fahrenheit'|'celsius', wind 'kmh'|'mph'.
 * Returns a Promise that resolves once the primary forecast has been applied.
 */
export function fetchWeather(place, state, opts) {
  opts = opts || {};
  var onUpdate = opts.onUpdate || function () {};
  var tempUnit = opts.temperatureUnit || "fahrenheit";
  var windUnit = "kmh"; // internal model is always km/h
  var lat = place.latitude, lon = place.longitude;
  var tz = "&timezone=" + encodeURIComponent(place.timezone || "auto");

  var primary = j("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
    "&current=temperature_2m,weather_code,is_day,wind_speed_10m,cloud_cover&daily=sunrise,sunset" +
    "&temperature_unit=" + tempUnit + "&wind_speed_unit=" + windUnit + "&forecast_days=1" + tz
  ).then(function (d) {
    if (d && d.current) {
      var c = d.current;
      if (typeof c.temperature_2m === "number") state.temp = Math.round(c.temperature_2m);
      if (typeof c.weather_code === "number") state.code = c.weather_code;
      if (typeof c.cloud_cover === "number") state.cloud = c.cloud_cover;
      if (typeof c.wind_speed_10m === "number") state.windKph = c.wind_speed_10m;
      if (typeof c.is_day === "number") state.isDay = c.is_day;
      // The zone the API resolved from the coordinates. Sunrise/sunset below are
      // wall-clock times IN that zone, so whoever reads them has to keep the clock
      // and the zone together — hand it back on the state.
      if (d.timezone) state.timezone = d.timezone;
      if (d.daily) {
        if (d.daily.sunrise && d.daily.sunrise[0]) { var sr = isoToMinutes(d.daily.sunrise[0]); if (sr != null) state.sunrise = sr; }
        if (d.daily.sunset && d.daily.sunset[0]) { var ss = isoToMinutes(d.daily.sunset[0]); if (ss != null) state.sunset = ss; }
      }
    }
    onUpdate(state);
    return state;
  });

  if (opts.coastal) {
    j("https://marine-api.open-meteo.com/v1/marine?latitude=" + lat + "&longitude=" + lon + "&current=wave_height" + tz)
      .then(function (d) { if (d && d.current && typeof d.current.wave_height === "number") { state.waveM = d.current.wave_height; onUpdate(state); } });
  }

  if (opts.airQuality !== false) {
    j("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + lat + "&longitude=" + lon + "&current=us_aqi" + tz)
      .then(function (d) { if (d && d.current && typeof d.current.us_aqi === "number") { state.aqi = d.current.us_aqi; onUpdate(state); } });
  }

  return primary;
}
