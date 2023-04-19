const search = document.querySelector('.search button');
const searchBox = document.querySelector('.search');
const error = document.querySelector('.error');

const loadModal = document.querySelector(".page-loading");

const weatherAPIKey = 'c23b1d28140788f772fa4de635fc98af';
let city, historyArray = ["London","Paris","Tokyo","New York"];//Default Search History

// Select History buttons
const historyOne = document.getElementById('one');
const historyTwo = document.getElementById('two');
const historyThree = document.getElementById('three');
const historyFour = document.getElementById('four');

// User location weather search
window.addEventListener('load', () => {
    function success(pos) {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}`)
            .then(response => response.json())
            .then(json => {
                city = json.name;
                searchWeather();
                return;
            })
    }

    function error() {
        city = "New York";
        searchWeather();
    }
    navigator.geolocation.getCurrentPosition(success,error);
});

// Search History buttons
historyOne.addEventListener('click', () => {
    city = historyOne.innerHTML;
    searchWeather();
});
historyTwo.addEventListener('click', () => {
    city = historyTwo.innerHTML;
    searchWeather();
});
historyThree.addEventListener('click', () => {
    city = historyThree.innerHTML;
    searchWeather();
});
historyFour.addEventListener('click', () => {
    city = historyFour.innerHTML;
    searchWeather();
});

search.addEventListener('click', () => {
    city = document.querySelector('.search input').value;
    searchWeather();
});

function searchWeather() {
    if (city === '')
        return;

    //Show Page Loading
    loadModal.style.display = "flex";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {
            //Hidden Page Loading
            loadModal.style.display = "none";

            if (json.cod === '404') {
                //Show Error Alert
                error.style.display = 'flex';
                error.classList.add('show');

                //Hidden Error Alert
                setTimeout(()=>{
                    error.classList.remove('show');
                    error.style.display = 'none';
                },3000);
                return;
            }

            // Update document title
            document.title = `Sunshine Weather | ${city}`;

            // Search History
            historyArray.pop();
            historyArray.unshift(city);

            historyOne.innerHTML = historyArray[0];
            historyTwo.innerHTML = historyArray[1];
            historyThree.innerHTML = historyArray[2];
            historyFour.innerHTML = historyArray[3];

            // Real time
            const dateUnix = json.dt;
            const timezone = json.timezone;
            
            const weekDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            
            const date = new Date((dateUnix + timezone) * 1000);
            const weekDayName = weekDayNames[date.getUTCDay()];
            const monthName = monthNames[date.getUTCMonth()];
            const hours = addZeros(date.getUTCHours());
            const minutes = addZeros(date.getUTCMinutes());

            function addZeros(num){
                if (num.toString().length < 2) {
                    return "0".concat(num);
                } else {
                    return num;
                }
            }
            
            const getDate = `${weekDayName} ${date.getUTCDate()}, ${monthName} ${hours}:${minutes}`;

            // Weather features
            const image = document.querySelector('.weather-info img');
            const background = document.querySelector('.container');
            const cloudy = document.querySelector('.cloudy span');
            const cityName = document.querySelector('.city');
            const time = document.querySelector('.time');
            const temperature = document.querySelector('.temp');
            const description = document.querySelector('.description');
            const humidity = document.querySelector('.humidity span');
            const wind = document.querySelector('.wind span');

            const weather = json.weather[0].main;
            if (weather == "Thunderstorm") {
                image.src = `images/Rain.png`;
            } else {
                image.src = `images/${weather}.png`;
            }

            if (parseInt(hours) > 7 && parseInt(hours) < 20) {
                background.style.backgroundImage = `url("images/backgrounds/${weather}-day.jpg")`;
            } else {
                background.style.backgroundImage = `url("images/backgrounds/${weather}-night.jpg")`;
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            cityName.innerHTML = `${json.name}`;
            time.innerHTML = `${getDate}`;
            cloudy.innerHTML = `${json.clouds.all}%`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
        });


};

const mentionName = document.getElementById("name").addEventListener("click", ()=> {
    document.querySelector(".popup").classList.add("active");
});

const closeButton = document.querySelector(".close").addEventListener("click", ()=> {
    document.querySelector(".popup").classList.remove("active");
});