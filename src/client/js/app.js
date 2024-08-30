/* Global Variables */  

const username = 'tuqa'; // username for geonames api
const weatherbitApiKey = 'b8949c2575de4fff8507436672c75e6d';
const pixabayApiKey ='45720506-0713448e22eac7c09fd833aae';

// Event listener to add function to existing HTML DOM element
// document.getElementById('generate').addEventListener('click', performAction);

 /* Function called by event listener */
export  async function performAction(e){

const tripDateInput = document.getElementById('departDate').value;
const tripDate = new Date(tripDateInput);
const currentDate = new Date();
const daysUntilTrip = Math.ceil((tripDate - currentDate) / (1000 * 60 * 60 * 24)); // Calculate days difference
console.log(`Days until trip: ${daysUntilTrip}`);

// handle Travel Time 
const tripEndInput = document.getElementById('returnDate').value;
const tripEnd = new Date(tripEndInput);
const tripTime = Math.ceil((tripEnd - tripDate) / (1000 * 60 * 60 * 24));

const city = document.getElementById('loc').value; 
const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`;

try {
    const {lat, lng ,countryName} = await getWeatherGeo(url);
    const weatherData = await getWeatherBit(lat , lng);
    await updateUIWithImg(city);
    console.log(weatherData.weatherDescription);
    document.getElementById('general').innerHTML=`${countryName}, is a Grear Distination`
    document.getElementById('travelTime').innerHTML = `The length of your Trip: ${tripTime} days`;
    document.getElementById('coordinate').innerHTML = `High - ${weatherData.highTemp}, Low - ${weatherData.lowTemp}`;
    document.getElementById('discription').innerHTML = `${weatherData.weatherDescription}`;

} catch (error) {
    console.error('Error:', error);
}
}




//Async GET
/* Function to GET Web API Data with geonames api*/
const getWeatherGeo = async (url) =>{
 const response = await fetch(url);
 try {
    const data = await response.json();
    const  location = data.geonames[0];
    const { lat, lng ,countryName} =location;
    console.log(lat, lng, countryName);
    return {lat ,lng, countryName}
 }catch(error){
    console.log("error", error);
 }
}


/* Function to GET Web API Data with Weatherbit API*/
const getWeatherBit = async (lat,lon) =>{
const weatherbitUrl =`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherbitApiKey}`;
 const response = await fetch(weatherbitUrl);
 try {
    const data = await response.json()
    const {  weather } = data.data[0];
    const highTemp = data.data[0].max_temp;
    const lowTemp = data.data[0].min_temp; 
    const weatherDescription = weather.description
    return { highTemp, lowTemp, weatherDescription };

 }catch(error){
    console.log("error", error);
 }
}


const sendData = async (data) => {
    const response = await fetch('http://localhost:5500/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to send data to server');
    }
};





//  pixabay api to update img
const getPixabayImages= async (location)=>{
    const query= encodeURIComponent(location);
    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${query}&image_type=photo&orientation=horizontal&per_page=3`;

    try {
        const response= await fetch(pixabayUrl);
        const data= await response.json()
        if (data.hits && data.hits.length >0){
            return data.hits[0].webformatURL; 
        }else{
            throw new Error('No images found for that location');
        }
    }catch (error) {
        console.error("Error fetching images from Pixabay:", error);
        return 'path/to/default-image.jpg'; 
    }
};


const updateUIWithImg= async (location)=>{
    try{
        const imgUrl= await getPixabayImages(location)
        document.getElementById('locImg').src = imgUrl;
    }catch(error){
        console.error('error updating with img' , errror)
    }
}




