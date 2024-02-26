
const imgContainer = document.querySelector('.images');

const wait = seconds => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000)
    });
};

const createImage = imgPath => {
    return new Promise((resolve, reject) => {
       const image = document.createElement('img');
       image.src = imgPath;
       image.addEventListener('load', function(){
        imgContainer.append(image);
        resolve(image)
       });
       image.addEventListener('error', function(){
        reject(new Error("Image not found!"))
       })
    })
}

let currentImg;

//Consuming the promise which we created for createImage
createImage('img/img-1.jpg')
.then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(5);
})
.then(()=> {
    currentImg.style.display = 'none';
    console.log('Image 1 hide');
    return createImage('img/img-2.jpg')
})
.then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(5);
})
.then(()=> {
    currentImg.style.display = 'none';
    console.log('Image 2 hide');
    return createImage('img/img-3.jpg')
})
.then(img => {
    currentImg = img;
    console.log('Image 3 loaded');
    return wait(5);
})
.then(()=> {
    currentImg.style.display = 'none';
    console.log('Image 3 hide');
})
.catch(err => console.log(err))

