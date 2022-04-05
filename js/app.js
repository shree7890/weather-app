const key = "243ff04262c5adfaad93f58a78029da0";
// element selector
let weather = {};
const cloud = document.getElementById("cloud");
const name = document.getElementById("name");
const temp = document.getElementById("temp");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const searchText = document.getElementById("searchText");
const searchBtn = document.getElementById("search");
const iconImage = document.getElementById("icon-image");
const searchHistory = document.getElementById("search-history");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const lat = coords.latitude;
      const lon = coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();
      loadData(data);
    },
    (err) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=Habiganj&appid=${key}&units=metric`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => loadData(data));
    }
  );
}

const loadData = (data) => {
  const icon = data.weather[0].icon;
  const url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  iconImage.setAttribute("src", url);
  cloud.innerText = `${data.weather[0].main} sky`;
  name.innerText = `City name: ${data.name}, ${data.sys.country}`;
  temp.innerText = `Temp: ${data.main.temp}°C`;
  pressure.innerText = `Pressure: ${data.main.pressure}`;
  humidity.innerText = `Humidity: ${data.main.humidity}`;
  // console.log(data);
};

// city name search

searchBtn.addEventListener("click", function () {
  const value = searchText.value.toLowerCase().trim();
  searchText.value = "";
  if (!value) {
    alert("Please valid city name");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${key}&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      loadData(data);
      // history data show
      const icon = data.weather[0].icon;
      const url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const name = data.name;
      const country = data.sys.country;
      const temp = data.main.temp;
      // - 273.15).toFixed(2);
      const pressure = data.main.pressure;
      const humidity = data.main.humidity;
      weather = {
        url,
        name,
        country,
        temp,
        pressure,
        humidity,
      };

      const historyCard = document.querySelectorAll(".history");
      // console.log(historyCard);
      const history = localStorageGetData();
      if (history.length === 4) {
        historyCard[3].remove();
        history.pop(weather);
        history.unshift(weather);
      } else {
        history.unshift(weather);
      }
      const div = document.createElement("div");
      div.innerHTML = `
     <div class="d-flex history mt-3">
            <div>
              <img
                src="${url}"
                alt="weather image"
              />
            </div>
            <div>
              <h3>City Name: ${name} and Country: ${country}</h3>
              <h4>${temp}°C</h4>
              <span>Pressure: ${pressure}</span>
              <span>Humidity: ${humidity}</span>
            </div>
          </div>
    `;
      searchHistory.insertAdjacentElement("afterbegin", div);
      localStorage.setItem("history", JSON.stringify(history));
    });
});

function localStorageGetData() {
  const history = localStorage.getItem("history");
  let arr = [];
  if (history) {
    arr = JSON.parse(history);
  }
  return arr;
}

window.onload = () => {
  const history = localStorageGetData();
  history.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
     <div class="d-flex history mt-3">
            <div>
              <img
                src="${item.url}"
                alt="weather image"
              />
            </div>
            <div>
              <h3>City Name: ${item.name} and Country: ${item.country}</h3>
              <h4>${item.temp}°C</h4>
              <span>Pressure: ${item.pressure}</span>
              <span>Humidity: ${item.humidity}</span>
            </div>
          </div>
    `;
    searchHistory.appendChild(div);
  });
};
