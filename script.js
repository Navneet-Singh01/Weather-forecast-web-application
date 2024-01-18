const input = document.getElementById("input");
let inputValue;
const mainContent = Array.from(document.querySelectorAll(".main"));
const forcastContent = Array.from(document.querySelectorAll(".forecast"));

const currentTime = (dt) => {
  let dateTime = new Date(dt * 1000);
  //08-03-2024 formate instead of Fri Mar 08 2024
  let newDate = dateTime.toLocaleDateString();
  let newTime = dateTime.toLocaleTimeString();
  // console.log(newDate, newTime);
  let arrayOfDt = [];
  arrayOfDt.push(newDate, newTime);
  return arrayOfDt;
};

const fCurrentTime = (dt) => {
  let dateTime = new Date(dt * 1000);
  //formate  Fri Mar 08 2024
  let newDate = dateTime.toDateString();
  let newTime = dateTime.toLocaleTimeString();
  // console.log(newDate, newTime);
  let arrayOfDt = [];
  arrayOfDt.push(newDate, newTime);
  return arrayOfDt;
};

const showForcastContent= (result2)=>{
for( let i=0;i<40;i++){
  forcastContent.forEach((elements)=>{
    let dt = result2.list[i].dt;
    let fDate= fCurrentTime(dt);
    elements.getElementsByTagName('h4')[i].innerText = fDate[0].split(' ')[0];
    // console.log(fDate[0].split(' ')[0]);
    let fDate1= currentTime(dt);
    elements.getElementsByTagName('h6')[i].innerText = fDate1[0];
    elements.getElementsByTagName('span')[i].innerText = fDate1[1];

    elements.getElementsByTagName('img')[i].src = `https://openweathermap.org/img/wn/${result2.list[i].weather[0].icon}@2x.png`;
    // console.log(result2.list[i].weather[0].icon);
    elements.getElementsByTagName('p')[i].innerText = parseInt(result2.list[i].main.temp)+'℃';
  })
}
};

const showContent = (
  {
    clouds: { all },
    dt,
    main: { temp, pressure, temp_max, temp_min, humidity },
    visibility,
    wind: { speed, deg },
    weather,
  },
  name,state,country 
) => {
  mainContent.forEach((elements, i) => {
    const iconurl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    // console.log(weather[0].icon)
    elements.getElementsByTagName("img")[0].src = iconurl;
    elements.getElementsByTagName("h2")[0].innerText = weather[0].description;

    let date = currentTime(dt);

    elements.getElementsByTagName("h4")[0].innerText = date[0];
    elements.getElementsByTagName("h4")[1].innerText = `${name},${state},${country}`;
    console.log(name,state,country);
    elements.getElementsByTagName("span")[0].innerText = parseInt(temp);
    elements.getElementsByTagName("p")[0].innerText = `Min Tem: ${parseInt(temp_min)}`;
    elements.getElementsByTagName("p")[1].innerText = `Max Tem: ${parseInt(temp_max)}`;
    elements.getElementsByTagName("p")[2].innerText = `wind:    ${parseInt(speed)} km/hr`;
    elements.getElementsByTagName("p")[3].innerText = `wind:    ${parseInt(deg)}°`;
    elements.getElementsByTagName("p")[4].innerText = `Visisbilty: ${visibility}`;
    elements.getElementsByTagName("p")[5].innerText = `Humidity: ${humidity}%`;
    elements.getElementsByTagName("p")[6].innerText = `Pressure: ${pressure} hPa`;
    elements.getElementsByTagName("p")[7].innerText = `Clouds: ${all}%`;
  });
};

const fetchWData = async (lat, lon, name,state,country) => {
  const mainContentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c1afa819fb601a24d628ec05528a66cb&units=metric`;
  const forcastContentUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c1afa819fb601a24d628ec05528a66cb&units=metric`;

  try {
    const response1 = await fetch(mainContentUrl);
    const result1 = await response1.json();
    console.log(result1);
    const {
      clouds: { all },
      dt,
      main: { temp, pressure, temp_max, temp_min, humidity },
      visibility,
      wind: { speed, deg },
      weather,
    } = result1;
    showContent(
      {
        clouds: { all },
        dt,
        main: { temp, pressure, temp_max, temp_min, humidity },
        visibility,
        wind: { speed, deg },
        weather,
      },
      name,state,country
    );

    const response2 = await fetch(forcastContentUrl);
    const result2 = await response2.json();
    console.log(result2);
    showForcastContent(result2);
  } catch (error) {
    console.log(error);
  }
};

// coordinates of the city
const fetchCityData = async () => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=1&appid=c1afa819fb601a24d628ec05528a66cb`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    const resultObj = result[0];
    console.log(resultObj);
    // console.log(result);
    // address to be removed
    const { lat, lon, name,state,country } = resultObj;
    console.log(lat,lon, name,state,country);
    // calling for second api
    fetchWData(lat, lon, name,state,country);
  } catch (error) {
    console.log(error);
  }
};

input.addEventListener("keyup",(event) => {
    if (event.key === "Enter") {
      inputValue = input.value;
      fetchCityData(); // calling method to get coordinates of city enterd from api
      document.getElementsByClassName('hide')[0].style.visibility = "visible";
      document.getElementsByClassName('show')[0].style.display = "block";
    }
  });

const forward = document.getElementById('button-right')

forward.addEventListener('click', (event)=>{
  const container = document.getElementById('box')
  slideScroll(container,'right',1,500,10);
})

const backword = document.getElementById('button-left')

backword.addEventListener('click',(event)=>{
  const container = document.getElementById('box')
  slideScroll(container,'left',1,500,10);
})

function slideScroll(element,direction,speed,distance,step){
    scrollAmount = 0
    const slideTimer= setInterval(function(){
        if(direction=='left'){
            element.scrollLeft -= step;
        } else{
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if(scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    },speed);
}
