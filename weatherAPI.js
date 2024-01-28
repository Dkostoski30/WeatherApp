const apiKey = '2352b8c13775feecdba662f5968c275d';
const city = 'Ohrid';
const lat = 41.1231;
const lon = 20.8016;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const airQualityURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
const daysOfWeek = ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"];
var isNight = false;
function kelvinToCelsius(kelvin) {
    return parseInt(kelvin) - 273.15;
}
function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
function setTimeAndDay(){
    let day = new Date().getDay();
    let time = new Date().getTime();
    document.getElementById('Day').innerHTML =" " + daysOfWeek[day] ;
    document.getElementById('Time').innerHTML = convertTimestampToTime(time);
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function setTemperature(data){
    document.getElementById('CurrentTemp').innerHTML = kelvinToCelsius(data).toFixed(0);
}
function setDescription(data){
    data = capitalizeFirstLetter(data);
    document.getElementById('desc').innerHTML = data;
}
function setAirQuality(data){
    document.getElementById('AirQuality').innerHTML = "<div>"+data.list[0].main.aqi+"</div>";
}
function setWindSpeed(data){
    document.getElementById('WindSpeed').innerHTML = "<div><div>"+data+"</div>"+"<div>km/h</div></div>";
}
function isWithinHour(timestamp1, timestamp2) {
    // Convert timestamps to Date objects
    const date1 = new Date(timestamp1 * 1000); // Convert seconds to milliseconds
    const date2 = new Date(timestamp2 * 1000);

    // Calculate the absolute difference in milliseconds
    const timeDifference = Math.abs(date2 - date1)/1000;
    //    console.log(timeDifference);
    // Check if the time difference is within one hour (3600000 milliseconds)
    return timeDifference <= 3600000;
}
function setBackground(data){
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    let time = new Date().getTime();
    const sunrise = new Date(sunriseTimestamp * 1000);
    const sunset = new Date(sunsetTimestamp * 1000);
    //console.log(Math.abs(time-sunsetTimestamp));
    if(isWithinHour(time, sunriseTimestamp)){
        document.body.style.background = "#FFFF url(\"src/sunriseBackground.png\") no-repeat";
    //    console.log("Sunrise");
    }else if(isWithinHour(time, sunset.getTime())){
        document.body.style.background = "#FFFF url(\"src/sunsetBackground.png\") no-repeat;";
    //    console.log("Sunset");
    }else if(time>sunset){
        document.body.style.background = "#FFFF url(\"src/moonBackground.png\") no-repeat";
        isNight = true;
    }else{
        document.body.style.background = "#FFFF url(\"src/sunBackground.png\") no-repeat";
    }
    document.body.style.backgroundSize = "cover";
}
function setIcon(data){
    let shortDesc = data.weather[0].main;
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    let time = new Date().getTime();
    const sunrise = new Date(sunriseTimestamp * 1000);
    const sunset = new Date(sunsetTimestamp * 1000);
    if(shortDesc==="Clear"){
        if(isNight){
            document.getElementById('weatherIcon').src = "src/moon.png";
        }else{
            document.getElementById('weatherIcon').src = "src/sun.png";
        }
    }else if(shortDesc==="Clouds"){
        if(isNight){
            document.getElementById('weatherIcon').src = "src/clouds_night.png";
        }else{
            document.getElementById('weatherIcon').src = "src/clouds.png";
        }
    }else if(shortDesc==="Rain"){
        if(isNight){
            document.getElementById('weatherIcon').src = "src/rain.night.png";
        }else{
            document.getElementById('weatherIcon').src = "src/rain.png";
        }
    }
}
function setHumdity(data){
    document.getElementById('Humidity').innerHTML = "<div>"+data+"%</div>"
}
function setVisibility(data){
    document.getElementById('Visibility').innerHTML = "<div><div>"+data+"</div>"+"<div>km</div></div>";
}
document.addEventListener("DOMContentLoaded", ()=>{
    setTimeAndDay();
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let temp = data.main.temp;
            let desc = data.weather[0].description;
            setBackground(data);
            setIcon(data);
            setVisibility(data.visibility/1000);
            setWindSpeed(data.wind.speed)
            setHumdity(data.main.humidity);
            setTemperature(temp);
            setDescription(desc);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    fetch(airQualityURL)
        .then(response=>{
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data=>{
            setAirQuality(data);
        })
        .catch(error =>{
            console.error("Error fetching data: "+error);
        })
});