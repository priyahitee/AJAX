const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
    const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1;
  };

  const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
  };

const getPosition = function () {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const whereAmI = async function(){
    try{
           // Geolocation
    const pos = await getPosition();
    const { latitude:lat, longitude:lng } = pos.coords;

     // Reverse geocoding
    const resGeo = await fetch(`https://geocod.xyz/api/public/getAddress?apikey=f1b98b24-d89e-43bb-8c9c-350ec13a4aed&lat=${lat}&lon=${lng}`);
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const reqData = await resGeo.json();

    //Country data
    const response = await fetch(`https://countries-api-836d.onrender.com/countries/name/${reqData.country}`);

    if (!response.ok) throw new Error('Problem getting location data');
    const data = await response.json();
    console.log(data[0])
    renderCountry(data[0]);
    return `You are in ${data.city}, ${data.country}`
    }
   catch(err){
    renderError(`💥 ${err.message}`);
    
    // Reject promise returned from async function
    throw err;
   }
  };

// Returning values from Async function

//old way of consuming promises
// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err.message} 💥`))
//   .finally(() => console.log('3: Finished getting location'));

(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message} 💥`);
  }
  console.log('3: Finished getting location');
})();

  // btn.addEventListener('click', whereAmI);