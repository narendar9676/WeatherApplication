let key = "6cee9a1329ad4ddd97a83343251303";

function getdata() {
    let city = document.getElementById('cityname').value;
    let currentAPI = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`;
    let forecastAPI = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=1`;
    let pastWeekAPI = `https://api.weatherapi.com/v1/history.json?key=${key}&q=${city}&dt=`;

    axios.get(currentAPI)
        .then((result) => {
            displayCurrent(result);
        })
        .catch(() => {
            alert("City not found");
        });

    axios.get(forecastAPI)
        .then((result) => {
            displayForecast(result);
        })
        .catch(() => {
            alert("City not found");
        });

    loadPastWeekData(city, pastWeekAPI);
}

function loadPastWeekData(city, pastWeekAPI) {
    let pastForecastContainer = document.getElementById("pastForecast");
    pastForecastContainer.innerHTML = "";
    let date = new Date();

    for (let i = 7; i >= 1; i--) {
        let pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - i);
        let formattedDate = pastDate.toISOString().split('T')[0];

        axios.get(pastWeekAPI + formattedDate)
            .then((result) => {
                let pastData = result.data.forecast.forecastday[0];

                let pastWeatherItem = document.createElement("div");
                pastWeatherItem.classList.add("past-forecast-item");
                pastWeatherItem.innerHTML = `
                    <h3>${formattedDate}</h3>
                    <img src="${pastData.day.condition.icon}" alt="Weather icon">
                    <p>${pastData.day.avgtemp_c}°C</p>
                `;
                
                pastForecastContainer.appendChild(pastWeatherItem);
            })
            .catch(() => {
                console.log("Error fetching past data");
            });
    }
}

function displayCurrent(res) {
    let data = res.data;
    document.getElementById("locatindetid").innerHTML = `
        <h1>${data.location.name}</h1>
        <h5>${data.location.country}</h5>
        <h1>${data.current.temp_c}°C</h1>
    `;
    document.getElementById("icon").innerHTML = `
        <img src="${data.current.condition.icon}" alt="Weather icon">
    `;
}

function displayForecast(res) {
    let forecastData = res.data.forecast.forecastday[0].hour;
    let forecastHTML = '';
    const times = [6, 9, 12, 15, 18, 21];

    times.forEach(time => {
        let forecast = forecastData.find(hour => new Date(hour.time).getHours() === time);
        if (forecast) {
            let hour = time > 12 ? time - 12 : time;
            let ampm = time >= 12 ? 'PM' : 'AM';
            forecastHTML += `
                <div class="forecast-item">
                    <h3>${hour} ${ampm}</h3>
                    <img src="${forecast.condition.icon}" alt="Weather icon">
                    <p>${forecast.temp_c}°C</p>
                </div>
            `;
        }
    });

    document.getElementById("forecast").innerHTML = forecastHTML;
}
