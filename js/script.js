//selecting elements
const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack=wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // console.log(e);
  //if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    //    console.log("Enter presses")
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

const apiKey = "d5e4c0d1270486dd2b57b2a32119cc0c";

function onSuccess(position) {
  // console.log(position);
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  // console.log(error);
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  // console.log(city);
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}
function fetchData() {
  infoTxt.innerText = "Getting weather details.....";
  infoTxt.classList.add("pending");

  // fetch(api).then(response => console.log(response.json()));
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
        wIcon.src="./images/clear.svg";
    }
    else if(id>=200 && id<=232){
        wIcon.src="./images/storm.svg";
    }
    else if(id>=600 && id<=622){
        wIcon.src="./images/snow.svg";
    }
    else if(id>=701 && id<=781){
        wIcon.src="./images/haze.svg";
    }
    else if(id>=801 && id<=804){
        wIcon.src="./images/cloud.svg";
    }
    else if((id>=300 && id<=321) || (id>=500 && id<=531)){
        wIcon.src="./images/rain.svg";
    }


    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;


    infoTxt.classList.remove("pending", "error");
    // console.log(info);
    wrapper.classList.add("active");
  }
//   console.log(info); 
}

arrowBack.addEventListener("click",()=>{
  wrapper.classList.remove("active");
  inputField.value="";
});
