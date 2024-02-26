const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const getJSON = (url, errorMsg = "Something went wrong") => {
  return fetch(url).then((response) => {
    //if response.ok is false, undefined location in api list throw error message
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
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
};

// Promise.all Running Promises in Parallel

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(
    //   `https://countries-api-836d.onrender.com/countries/name/${c1}`
    // );
    // const [data2] = await getJSON(
    //   `https://countries-api-836d.onrender.com/countries/name/${c2}`
    // );
    // const [data3] = await getJSON(
    //   `https://countries-api-836d.onrender.com/countries/name/${c3}`
    // );
    // console.log([data1.capital, data2.capital, data3.capital]);

    const data = await Promise.all([
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c1}`),
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c2}`),
      getJSON(`https://countries-api-836d.onrender.com/countries/name/${c3}`),
    ]);
    console.log(data.map((d) => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3Countries("portugal", "tanzania", "spain");

// Other Promise Combinators: race, allSettled and any

//1. Promise.Race

(async function(){
  const data = await Promise.race([
    getJSON(`https://countries-api-836d.onrender.com/countries/name/italy`),
    getJSON(`https://countries-api-836d.onrender.com/countries/name/portugal`),
    getJSON(`https://countries-api-836d.onrender.com/countries/name/spain`),
  ])
  console.log(data[0].capital);
})();

const timeOut = function(sec){
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long!`))
    }, sec*1000)
  })
}

Promise.race([
  getJSON(`https://countries-api-836d.onrender.com/countries/name/italy`),
  timeOut(2),
])
.then(res => console.log(res[0]))
.catch(err => console.error(err));

// 2.Promise.allSettled takes array of promises return values of all promises value in array it is not short circuted like Promise.all to throw errror

Promise.allSettled([
  Promise.resolve('success1'),
  Promise.reject('success'),
  Promise.resolve('success2')
])
.then(res => console.log(res));


// 3.Promise.any just like race to return first fullfilled promises value which wins the race but it ignores the rejected promises.
Promise.any([
  Promise.resolve('success1'),
  Promise.reject('success'),
  Promise.resolve('success2')
])
.then(res => console.log(res));