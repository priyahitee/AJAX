const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector(".countries");

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

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

// function getPosition is to obtain the current geographic position of the device using the Geolocation API
const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(  
      position => resolve(position),
      error => reject(error))
  })
}

const whereAmI = () => {
  getPosition()
  .then(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    // return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    return fetch(`https://geocod.xyz/api/public/getAddress?apikey=f1b98b24-d89e-43bb-8c9c-350ec13a4aed&lat=${lat}&lon=${lng}`)
  })
  .then(response => {
          // If the response is not successful (i.e response.ok is false)
          if (!response.ok) throw new Error('Problem getting location data');
            // If the response is successful (i.e response.ok is true) return promise value
          return response.json();
        })
        .then(data => {
          // Check If the response data contains an error (e.g., if the country data is missing)
          if (data.error) throw new Error(data.error.message);
          return fetch(`https://countries-api-836d.onrender.com/countries/name/${data.country}`);
        })
        .then(response => {
          // If the response is not successful (i.e response.ok is false)
          if (!response.ok) throw new Error('Problem getting country data');
           // If the response is successful (i.e response.ok is true) return promise value
          return response.json();
        })
        .then(data => renderCountry(data[0]))
        .catch(err => {
          renderError(`Location not found ${err.message}`);
        });
}

btn.addEventListener('click', whereAmI);