"use strict"

import playList from './playList.js';

let todosLang;
let isRus = false;
let timeOfDay;
let timeOfDay1;
const greetingTranslation = {
en : [['Good night'], ['Good morning'], ['Good afternoon'], ['Good evening']],
ru : [['Доброй ночи'], ['Доброе утро'], ['Добрый день'], ['Добрый вечер']]
};

// Часы и календарь;

function showTime() {
   const time = document.querySelector('.time');
   const dateNow = new Date();
   const currentTime = dateNow.toLocaleTimeString();
   time.textContent = currentTime;
   getTimeOfDay();
   setTimeout(showTime, 1000);
};
showTime();

function showDate(lang = 'en') {
   const date = document.querySelector('.date');
   const dateNow = new Date();
   const options = { weekday: 'long', month: 'long', day: 'numeric'};
   let currentDate;
   if (lang == 'ru') {
      currentDate = dateNow.toLocaleDateString('ru-Ru', options);
   } else {
      currentDate = dateNow.toLocaleDateString('en-En', options);
   }
   date.textContent = currentDate;
};
showDate();

// Приветствие;

function getTimeOfDay() {
   const date = new Date();
   const hours = date.getHours();
   if (0 <= hours && hours < 6) {
      timeOfDay = 'night';
      timeOfDay1 = 0;
   };
   if (6 <= hours && hours < 12) {
      timeOfDay = 'morning';
      timeOfDay1 = 1;
   };
   if (12 <= hours && hours < 18) {
      timeOfDay =  'afternoon';
      timeOfDay1 = 2;
   };
   if (18 <= hours && hours < 24) {
      timeOfDay = 'evening';
      timeOfDay1 = 3;
   };
};

function showGreeting(lang = 'en') {
   const greetingText = document.querySelector('.greeting');
   greetingText.textContent = greetingTranslation[lang][timeOfDay1];
}
showGreeting();

const names = document.querySelector('.names');
function removeValue () {
   names.value = '';
};
names.addEventListener('click', removeValue)

function setLocalStorage() {
   localStorage.setItem('names', names.value);
 };
 window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
   if(localStorage.getItem('names')) {
     names.value = localStorage.getItem('names');
   }
 };
window.addEventListener('load', getLocalStorage);

// Слайдер изображений

let randomNum;

function getRandomNum() {
   randomNum = Math.floor(Math.random() * 20 + 1).toString().padStart(2, '0');
};
getRandomNum();


function setBg() {
   const body = document.querySelector('body');
   let img = new Image();
   img.src = `https://raw.githubusercontent.com/Valeriy95/stage1-tasks/assets/images/${timeOfDay}/${randomNum.toString().padStart(2, '0')}.webp`;
   img.onload = () => {      
      body.style.background = `url('https://raw.githubusercontent.com/Valeriy95/stage1-tasks/assets/images/${timeOfDay}/${randomNum.toString().padStart(2, '0')}.webp') center/cover, rgba(0, 0, 0, 0.5)`;
  }; 
}

setBg();

const slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', getSlideNext);

function getSlideNext() {
    if (changeImageAPI.value == 'unsplash') {
      getLinkToImageUnsplash(changeImageAPI.value);
   } else if (changeImageAPI.value == 'flickr') {
      getLinkToImageUnsplash(changeImageAPI.value);  
   } else {
      (randomNum < 20) ? randomNum++ : randomNum = 1;
      setBg();
   }
};

const slidePrev = document.querySelector('.slide-prev');
slidePrev.addEventListener('click', getSlidePrev);

function getSlidePrev() {
    if (changeImageAPI.value == 'unsplash') {
      getLinkToImageUnsplash(changeImageAPI.value);
   } else if (changeImageAPI.value == 'flickr') {
      getLinkToImageUnsplash(changeImageAPI.value);  
   } else {
      (randomNum > 1) ? randomNum-- : randomNum = 20;
      setBg();
   }
};

// Виджет погоды

const city = document.querySelector('.city');
city.addEventListener('change', change);
city.value = 'Minsk';

async function getWeather(lang = 'en') {  
   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=7fc8479d420477b3afca25c033208929&units=metric`;  
   const weatherIcon = document.querySelector('.weather-icon');
   const temperature = document.querySelector('.temperature');
   const weatherDescription = document.querySelector('.weather-description');
   const wind = document.querySelector('.wind');
   const humidity = document.querySelector('.humidity');
   const weatherError = document.querySelector('.weather-error');
   const res = await fetch(url);
   const data = await res.json(); 
   if(data.name === undefined) {
      weatherIcon.className = 'weather-icon owf';
      temperature.textContent = '';
      weatherDescription.textContent = '';
      wind.textContent = '';
      humidity.textContent = '';
      weatherError.textContent = `Error! city not found for '${city.value}'`;
   } else {
      weatherIcon.className = 'weather-icon owf';
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.floor(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      weatherError.textContent = '';
      if(lang == 'ru') {
         wind.textContent = `Скорость ветра: ${Math.floor(data.wind.speed)} м/с`;
         humidity.textContent = `Влажность: ${data.main.humidity}%`;
      } else {
         wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
         humidity.textContent = `Humidity: ${data.main.humidity}%`;
      }
   }
};
getWeather();

function change() {
 getWeather();
};

function setLocalWeather() {
   localStorage.setItem('city', city.value);
};
window.addEventListener('beforeunload', setLocalWeather);

function getLocalWeather() {
   if(localStorage.getItem('city')) {
      city.value = localStorage.getItem('city');
      getWeather();
   }
};
window.addEventListener('load', getLocalWeather);


// Виджет цитата дня 

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
let num;
const changeQuote = document.querySelector('.change-quote');
changeQuote.addEventListener('click', getQuotes)

async function getQuotes() {  
   let quotes;
   if (isRus == false) {
      quotes = 'data.json';
   } else {
      quotes = 'dataRus.json';
   }
   const res = await fetch(quotes);
   const data = await res.json(); 
   num = Math.floor(Math.random() * 20);
   quote.textContent = `"${data[num].text}"`;
   author.textContent = data[num].author;
}
getQuotes();

async function getQuotesEn() {  
   const quotes = 'dataRus.json';
   const res = await fetch(quotes);
   const data = await res.json(); 
   quote.textContent = `"${data[num].text}"`;
   author.textContent = data[num].author;
}

async function getQuotesRu() {  
   const quotes = 'data.json';
   const res = await fetch(quotes);
   const data = await res.json(); 
   quote.textContent = `"${data[num].text}"`;
   author.textContent = data[num].author;
}


// 6. Аудиоплеер


let isPlay = false;
let playNum = 0;
const audio = new Audio();
const playBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const songname = document.querySelector('.song-name');
const songDuraction = document.querySelector('.song-duraction');
const wrapperPlayer = document.querySelector('.wrapper-player');
const playBtnPl = document.querySelector('.btn-play-pl');
const playNextBtnPl = document.querySelector('.btn-next-pl');
const playPrevBtnPl = document.querySelector('.btn-prev-pl');

playBtn.addEventListener('click', playAudio);
playBtnPl.addEventListener('click', playAudio);
function playAudio() {
  let styleActive = document.querySelector(`.num${playNum}`);
  styleActive.classList.add('item-active');
  wrapperPlayer.classList.remove('hidden');
  
  songname.textContent = playList[playNum].title;
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if(!isPlay) {
  audio.play();
  isPlay = true;
  playBtn.classList.add('pause');
  playBtnPl.classList.add('pause');   
  } else {
   audio.pause();
   isPlay = false;
   playBtn.classList.remove('pause');
   playBtnPl.classList.remove('pause');
  }
};

function songTime() {
   songDuraction.textContent = `${currentTimeDuration(audio.currentTime)} / ${currentTimeDuration(audio.duration)}`;
   setTimeout(songTime, 1000);
};
songTime();

function currentTimeDuration(seconds) {
   let sec = Math.floor(seconds);
   let min = Math.floor(sec / 60);
   min = min >= 10 ? min : '' + min;
   sec = Math.floor(sec % 60);
   sec = sec >=10 ? sec : '0' + sec;
   return min + ':' + sec;
}

playNextBtn.addEventListener('click', playNext);
playNextBtnPl.addEventListener('click', playNext);

function playNext() {
  let styleActive = document.querySelector(`.num${playNum}`);
  styleActive.classList.remove('item-active');
   if (playNum < 3) {
      playNum++;
      isPlay = false;
      playAudio();
   } else {
      playNum = 0;
      isPlay = false;
      playAudio();
   }
};

playPrevBtn.addEventListener('click', playPrev);
playPrevBtnPl.addEventListener('click', playPrev);

function playPrev() {
   let styleActive = document.querySelector(`.num${playNum}`);
   styleActive.classList.remove('item-active');
   if (playNum > 0) {
      playNum--;
      isPlay = false;
      playAudio();
   } else {
      playNum = 3;
      isPlay = false;
      playAudio();
   }
};

for(let i = 0; i < playList.length; i++) {
   const li = document.createElement('li');
   const playListContainer = document.querySelector('.play-list');
   li.classList.add('play-item');
   li.classList.add(`num${[i]}`);
   li.textContent = playList[i].title;
   playListContainer.append(li);
};

// 7. Продвинутый аудиоплеер

const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const volumeBtn = document.querySelector('.volume');
const range = document.querySelector('.range');
let counterVolume = 0;

function updateProgress (e) {
   const {duration, currentTime} = e.srcElement;
   const progressProcent = (currentTime / duration) * 100;
   progress.style.width = `${progressProcent}%`;
};

audio.addEventListener('timeupdate', updateProgress);

function setProgress(e) {
   const width = this.clientWidth;
   const clickX = e.offsetX;
   const duration = audio.duration;
   audio.currentTime = (clickX / width) * duration;
};

progressContainer.addEventListener("click", setProgress);

audio.addEventListener('ended', playNext);

range.addEventListener('change', function () {
   audio.volume = range.value / 100;
});

volumeBtn.addEventListener('click', volumeMuteBtn);

function volumeMuteBtn () {
  counterVolume++;
  if (counterVolume % 2 == 1) {
    audio.volume = 0;
    volumeBtn.style.opacity = '0.5';
  } 
  if (counterVolume % 2 == 0) {
    audio.volume = 1;
    volumeBtn.style.opacity = '1';
  }
};

// 8. Перевод приложения на два языка (en/ru или en/be);

function changeLanguagesEnRu (str) {
   const languages = document.querySelector('.languages');
   const imageCollection = document.querySelector('.image-collection');
   const hideBlock = document.querySelector('.hide-block');
   const tagBtn1 = document.querySelector('.tagBtn1');
   const tagBtn2 = document.querySelector('.tagBtn2');
   const progressBtn = document.querySelector('.progress-btn');
   const doneBtn = document.querySelector('.done-btn');
   const clearBtn = document.querySelector('.btn-clear');
   const inputToDo = document.querySelector('.input-ToDo');
   const inputTime = document.querySelector('.input-time-h');
   const inputDate = document.querySelector('.input-date-h');
   const inputGreeting = document.querySelector('.input-greeting-h');
   const inputQuote = document.querySelector('.input-quote-h');
   const inputWeather = document.querySelector('.input-weather-h');
   const inputAudio = document.querySelector('.input-audio-h');
   const inputTodolist = document.querySelector('.input-todolist-h');
   const editToDo = document.querySelectorAll('.edit-toDo');
   const deleteToDo = document.querySelectorAll('.delete-toDo');
   const spanListContainer = document.querySelectorAll('.todos-yet');
   
   if (str == 'ru') {
      isRus = true;
      showGreeting('ru');
      getWeather('ru');
      showDate('ru');
      if (names.value == '[Enter name]') {
         names.value = 'Введите имя';
      };
      if (city.value == 'Minsk') {
         city.value = 'Минск';
      };
      getQuotesEn();
      languages.textContent = 'Язык';
      imageCollection.textContent = 'Коллекция изображений';
      hideBlock.textContent = 'Скрыть/показать блоки';
      tagBtn1.textContent = 'Тег';
      tagBtn2.textContent = 'Тег';
      progressBtn.textContent = 'В процессе';
      doneBtn.textContent = 'Сделанные';
      clearBtn.textContent = 'Очистить';
      inputToDo.placeholder = 'Новый ToDo';
      inputTime.textContent = 'Время';
      inputDate.textContent = 'Дата';
      inputGreeting.textContent = 'Приветствие';
      inputQuote.textContent = 'Цитата';
      inputWeather.textContent = 'Погода';
      inputAudio.textContent = 'Аудио';
      chancelanguage[1].checked = true;
      todosLang = 'ru';   
      for (let i = 0; i < spanListContainer.length; i++) { 
	   spanListContainer[i].textContent = 'Пока задач нет';
      };
      for (let i = 0; i < editToDo.length; i++) { 
	   editToDo[i].textContent = 'Редак.';
      };
      for (let i = 0; i < deleteToDo.length; i++) { 
	   deleteToDo[i].textContent = 'Удалить';
      };
      };
   if (str == 'en') {
      isRus = false;
      showGreeting('en');
      getWeather('en');
      showDate('en');
       if (names.value == 'Введите имя') {
         names.value = '[Enter name]';
      };
      if (city.value == 'Минск') {
         city.value = 'Minsk';
      };
      getQuotesRu();
      languages.textContent = 'Language';
      imageCollection.textContent = 'Image collection';
      hideBlock.textContent = 'Hide/show blocks';
      tagBtn1.textContent = 'Tag';
      tagBtn2.textContent = 'Tag';
      progressBtn.textContent = 'In progress';
      doneBtn.textContent = 'Done';
      clearBtn.textContent = 'Clear all';
      inputToDo.placeholder = 'New ToDo';
      inputTime.textContent = 'Time';
      inputDate.textContent = 'Date';
      inputGreeting.textContent = 'Greeting';
      inputQuote.textContent = 'Quote';
      inputWeather.textContent = 'Weather';
      inputAudio.textContent = 'Audio';
      chancelanguage[0].checked = true;
      todosLang = 'en';
      for (let i = 0; i < spanListContainer.length; i++) { 
	   spanListContainer[i].textContent = 'No todos yet';
      };
      for(let i = 0; i < editToDo.length; i++) { 
	  editToDo[i].textContent = 'Edit';
      };
      for(let i = 0; i < deleteToDo.length; i++) { 
	  deleteToDo[i].textContent = 'Delete';
      };
      }
};

// 10. Настройки

const settingContainer = document.querySelector('.setting-container');
const settingIcon = document.querySelector('.setting-icon');
settingIcon.addEventListener('click', showSetCont);

function showSetCont () {
   settingContainer.classList.toggle('show-container-set');
};

const chancelanguage = document.querySelectorAll('input[type=radio][name="lang"]');
chancelanguage.forEach(chancelanguage => chancelanguage.addEventListener('change', function sur () {
   if(chancelanguage.value == 'ru') {
      changeLanguagesEnRu (chancelanguage.value);
      localStorage.setItem('chancelanguage', chancelanguage.value);
   } else if (chancelanguage.value == 'en') {
      changeLanguagesEnRu (chancelanguage.value);
      localStorage.setItem('chancelanguage', chancelanguage.value);
   }
}));

function getLocalLanguage() {
   if(localStorage.getItem('chancelanguage')) {
     chancelanguage.value = localStorage.getItem('chancelanguage');
     changeLanguagesEnRu (chancelanguage.value);
   }
 };
window.addEventListener('load', getLocalLanguage);
   
//  9. Получение фонового изображения от API

let timeOfDayUnsplash;
let timeOfDayFlickr;

async function getLinkToImageUnsplash(changeImage) {
   if (changeImage == 'github') {
      changeImageAPI[0].checked = true;
   };
   if (changeImage == 'unsplash') {
      if(timeOfDayUnsplash == null || timeOfDayUnsplash == '' || timeOfDayUnsplash == undefined) {
         timeOfDayUnsplash = timeOfDay;
       };
      const url = `https://api.unsplash.com/photos/random?query=${timeOfDayUnsplash}&client_id=TjmnzbgMoc-UhW_LILGZgsS9p_rcXLjTsy9L22RGQ6Y`;
      const res = await fetch(url);
      const data = await res.json();
      const body = document.querySelector('body');
      let img = new Image();
      img.src = data.urls.regular;
      img.onload = () => {      
         body.style.background = `url(${data.urls.regular}) center/cover, rgba(0, 0, 0, 0.5)`;
      }; 
      changeImageAPI[1].checked = true;
   } 
   if (changeImage == 'flickr') {
      if(timeOfDayFlickr == null || timeOfDayFlickr == '' || timeOfDayFlickr == undefined) {
         timeOfDayFlickr = timeOfDay;
       };
      const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ead20d55cac86a7c2b92802520507b81&tags=${timeOfDayFlickr}&extras=url_l&format=json&nojsoncallback=1`;
      const res = await fetch(url);
      const data = await res.json();
      let ranNum = Math.floor(Math.random() * 97 + 1);
      const body = document.querySelector('body');
      let img = new Image();
      img.src = data.photos.photo[ranNum].url_l;
      img.onload = () => {      
         body.style.background = `url(${data.photos.photo[ranNum].url_l}) center/cover, rgba(0, 0, 0, 0.5)`;
      }; 
      changeImageAPI[2].checked = true;
      }
 };


const changeImageAPI = document.querySelectorAll('input[type=radio][name="imgcollection"]');
changeImageAPI.forEach(changeImageAPI => changeImageAPI.addEventListener('change', function changeAPI () {
   if(changeImageAPI.value == 'github') {
      localStorage.setItem('changeImageAPI', changeImageAPI.value);
      getLinkToImageUnsplash(changeImageAPI.value);
      getLocalImageAPI();
      setBg();
   } else if (changeImageAPI.value == 'unsplash') {
      localStorage.setItem('changeImageAPI', changeImageAPI.value);
      getLinkToImageUnsplash(changeImageAPI.value);
      getLocalImageAPI();
   } else if (changeImageAPI.value == 'flickr') {
      localStorage.setItem('changeImageAPI', changeImageAPI.value);
      getLinkToImageUnsplash(changeImageAPI.value);
      getLocalImageAPI();
   }
}));

function getLocalImageAPI() {
   if(localStorage.getItem('changeImageAPI')) {
     changeImageAPI.value = localStorage.getItem('changeImageAPI');
     getLinkToImageUnsplash(changeImageAPI.value);
   }
 };
window.addEventListener('load', getLocalImageAPI);


const tagBtn1 = document.querySelector('.tagBtn1');
const tagBtn2 = document.querySelector('.tagBtn2');
tagBtn1.addEventListener('click', tagChangeUnsplash);
tagBtn2.addEventListener('click', tagChangeFlickr);

function tagChangeUnsplash () {
   getLocalLanguage()
   if (chancelanguage.value == 'ru') {
      timeOfDayUnsplash = prompt('Введите тег для Unsplash API. Например: природа')
   }
   if (chancelanguage.value == 'en') {
      timeOfDayUnsplash = prompt('Enter tag for Unsplash API. For example: nature');
   }
   getLinkToImageUnsplash(changeImageAPI.value);
}

function tagChangeFlickr () {
   getLocalLanguage()
   if (chancelanguage.value == 'ru') {
      timeOfDayFlickr = prompt('Введите тег для Flickr API. Например: природа');
   }
   if (chancelanguage.value == 'en') {
      timeOfDayFlickr = prompt('Enter tag for Flickr API. For example: nature');
   }
   getLinkToImageUnsplash(changeImageAPI.value);
}


const hideBlocBtn = document.querySelector('.hide-block');
const hideContainer = document.querySelector('.hide-block-container');
const hideBlocCloseBtn = document.querySelector('.hide-bloc-close');
const closeIconHide1 = document.querySelector('.close-icon-hide1');
const closeIconHide2 = document.querySelector('.close-icon-hide2');

hideBlocCloseBtn.addEventListener('click', hideBlocClose);
closeIconHide1.addEventListener('click', hideBlocClose);
closeIconHide2.addEventListener('click', hideBlocClose);

hideBlocBtn.addEventListener('click', hideBlocOpen);


function hideBlocOpen () {
   hideContainer.classList.remove('hidden');
};

function hideBlocClose () {
   hideContainer.classList.add('hidden');
}

const chHideTime = document.querySelector('input[type=checkbox][name="time"]');
chHideTime.addEventListener('click', changeHideTime);
                                                                            
const chHideDate = document.querySelector('input[type=checkbox][name="date"]');
chHideDate.addEventListener('click', changeHideDate);

const chHideGreeting = document.querySelector('input[type=checkbox][name="greeting"]');
chHideGreeting.addEventListener('click', changeHideGreeting);

const chHideQuote = document.querySelector('input[type=checkbox][name="quote"]');
chHideQuote.addEventListener('click', changeHideQuote);

const chHideWeather = document.querySelector('input[type=checkbox][name="weather"]');
chHideWeather.addEventListener('click', changeHideWeather);

const chHideAudio = document.querySelector('input[type=checkbox][name="audio"]');
chHideAudio.addEventListener('click', changeHideAudio);

const chHideTodolist = document.querySelector('input[type=checkbox][name="todolist"]');
chHideTodolist.addEventListener('click', changeHideToDo);


function changeHideTime () {
   const time = document.querySelector('.time');
   time.classList.toggle('opacity-bloc');

   if (time.classList.contains('opacity-bloc') == true) {
      time.classList.add('opacity-bloc');
      chHideTime.checked = true;
      localStorage.setItem('chHideTime', chHideTime.value);
   } else {
      time.classList.remove('opacity-bloc');
      chHideTime.checked = false;
      localStorage.removeItem('chHideTime');
   }
};


function changeHideDate () { 
   const date = document.querySelector('.date');
   date.classList.toggle('opacity-bloc');
   if(date.classList.contains('opacity-bloc') == true) {
      date.classList.add('opacity-bloc');
      chHideDate.checked = true;
      localStorage.setItem('chHideDate', chHideDate.value);
   } else {
      date.classList.remove('opacity-bloc');
      chHideDate.checked = false;
      localStorage.removeItem('chHideDate');
   }
};


function changeHideGreeting () {
   const greeting = document.querySelector('.greeting-container');
   greeting.classList.toggle('opacity-bloc');
   if(greeting.classList.contains('opacity-bloc') == true) {
      greeting.classList.add('opacity-bloc');
      chHideGreeting.checked = true;
      localStorage.setItem('chHideGreeting', chHideGreeting.value);
   } else {
      greeting.classList.remove('opacity-bloc');
      chHideGreeting.checked = false;
      localStorage.removeItem('chHideGreeting');
   }
};

function changeHideQuote () {
   const quote = document.querySelector('.quote');
   const author = document.querySelector('.author');
   const changeQuote = document.querySelector('.change-quote');
   quote.classList.toggle('opacity-bloc');
   author.classList.toggle('opacity-bloc');
   changeQuote.classList.toggle('opacity-bloc');
   if(quote.classList.contains('opacity-bloc') == true && author.classList.contains('opacity-bloc') == true && changeQuote.classList.contains('opacity-bloc') == true) {
      quote.classList.add('opacity-bloc');
      author.classList.add('opacity-bloc');
      changeQuote.classList.add('opacity-bloc');
      chHideQuote.checked = true;
      localStorage.setItem('chHideQuote', chHideQuote.value);
   } else {
      quote.classList.remove('opacity-bloc');
      author.classList.remove('opacity-bloc');
      changeQuote.classList.remove('opacity-bloc');
      chHideQuote.checked = false;
      localStorage.removeItem('chHideQuote');
   }
};

function changeHideWeather () {
   const weather = document.querySelector('.weather');
   weather.classList.toggle('opacity-bloc');
   if(weather.classList.contains('opacity-bloc') == true) {
      weather.classList.add('opacity-bloc');
      chHideWeather.checked = true;
      localStorage.setItem('chHideWeather', chHideWeather.value);
   } else {
      weather.classList.remove('opacity-bloc');
      chHideWeather.checked = false;
      localStorage.removeItem('chHideWeather');
   }
};

function changeHideAudio () {
   const player = document.querySelector('.player');
   const wrapperPlayer = document.querySelector('.wrapper-player');
   player.classList.toggle('opacity-bloc');
   wrapperPlayer.classList.toggle('opacity-bloc');
   if(player.classList.contains('opacity-bloc') == true && wrapperPlayer.classList.contains('opacity-bloc') == true) {
      player.classList.add('opacity-bloc');
      wrapperPlayer.classList.add('opacity-bloc');
      chHideAudio.checked = true;
      localStorage.setItem('chHideAudio', chHideAudio.value);
   } else {
      player.classList.remove('opacity-bloc');
      wrapperPlayer.classList.remove('opacity-bloc');
      chHideAudio.checked = false;
      localStorage.removeItem('chHideAudio');
   }
};

function changeHideToDo () {
   const wrapperTodo = document.querySelector('.wrapper-todo');
   wrapperTodo.classList.toggle('opacity-bloc');

   if (wrapperTodo.classList.contains('opacity-bloc') == true) {
      wrapperTodo.classList.add('opacity-bloc');
      chHideTodolist.checked = true;
      localStorage.setItem('chHideTodolist', chHideTodolist.value);
   } else {
      wrapperTodo.classList.remove('opacity-bloc');
      chHideTodolist.checked = false;
      localStorage.removeItem('chHideTodolist');
   }
};

function getchangeHideTime() {
   if(localStorage.getItem('chHideTime')) {
     chHideTime.value = localStorage.getItem('chHideTime');
     changeHideTime ()
   }
 };
window.addEventListener('load', getchangeHideTime);

function getchangeHideDate() {
   if(localStorage.getItem('chHideDate')) {
     chHideDate.value = localStorage.getItem('chHideDate');
     changeHideDate ()
   }
 };
window.addEventListener('load', getchangeHideDate);

function getchangeHideGreeting() {
   if(localStorage.getItem('chHideGreeting')) {
     chHideGreeting.value = localStorage.getItem('chHideGreeting');
     changeHideGreeting ()
   }
 };
window.addEventListener('load', getchangeHideGreeting);

function getchangeHideQuote() {
   if(localStorage.getItem('chHideQuote')) {
     chHideQuote.value = localStorage.getItem('chHideQuote');
     changeHideQuote ()
   }
 };
window.addEventListener('load', getchangeHideQuote);

function getchangeHideWeather() {
   if(localStorage.getItem('chHideWeather')) {
     chHideWeather.value = localStorage.getItem('chHideWeather');
     changeHideWeather ()
   }
 };
window.addEventListener('load', getchangeHideWeather);

function getchangeHideAudio() {
   if(localStorage.getItem('chHideAudio')) {
    chHideAudio.value = localStorage.getItem('chHideAudio');
     changeHideAudio ()
   }
 };
window.addEventListener('load', getchangeHideAudio);

function getchangeHideToDo() {
   if(localStorage.getItem('chHideTodolist')) {
     chHideTodolist.value = localStorage.getItem('chHideTodolist');
     changeHideToDo ();
   }
 };
window.addEventListener('load', getchangeHideToDo);

// 11. Todo list

const todoListIcon = document.querySelector('.todo-icon');
const todoListContainer = document.querySelector('.wrapper-todo');
todoListIcon.addEventListener('click', openCloseTodoList);

function openCloseTodoList () {
   todoListContainer.classList.toggle('hidden');
}

const todoInput = document.querySelector(".todo-input input");
const btnPenComp = document.querySelectorAll(".btn-pen-comp span");
const list = document.querySelector(".list-container");
const clearBtn = document.querySelector(".btn-clear");
const progressBtn = document.querySelector(".progress-btn");
const doneBtn = document.querySelector(".done-btn");

let editNumber;
let isEditedInput = false;
let todoListArr = JSON.parse(localStorage.getItem("todoList"));

progressBtn.addEventListener("click", () => {
   progressBtn.classList.add("active");
   doneBtn.classList.remove("active");
   showList("progress");
});

doneBtn.addEventListener("click", () => {
   doneBtn.classList.add("active");
   progressBtn.classList.remove("active");
   showList("done");
});

function showList(btn) {
   let li = "";
   if(todoListArr) {
      todoListArr.forEach((value, index) => {
         let isDone = value.status == "done" ? "checked" : "";
         if(btn == value.status) {
            li += `<li class="item ">
                     <label for="${index}">
                        <input type="checkbox" id="${index}" ${isDone}>
                        <p class="${isDone}">${value.name}</p>
                     </label>
                     <div class="settings-todo">
                        <p class="todo-menu-p">...</p>
                        <ul class="item-menu">
                           <li class="edit-toDo">Edit</li>
                           <li class="delete-toDo">Delete</li>
                        </ul>
                     </div>
                  </li>`;
         }
      });
   }
	function noTodosYet (str = 'en') {
		if (str == 'ru') {
		return `<span class="todos-yet">Пока задач нет</span>`
		} else if (str == 'en') {
		return `<span class="todos-yet">No todos yet</span>`
		}
	}
	
	list.innerHTML = li || noTodosYet(todosLang);
}
showList("progress");

function showMenu(selected) {
   let containerMenu = selected.parentElement.lastElementChild;
   containerMenu.classList.add("show");
   document.addEventListener("click", e => {
      if(e.target.tagName != "P" || e.target != selected) {
         containerMenu.classList.remove("show");
      }
   })
}

function editInput(taskNumber, valueName) {
   editNumber = taskNumber;
   isEditedInput = true;
   todoInput.value = valueName;
}

function deleteInput(deleteNumber) {
   todoListArr.splice(deleteNumber, 1);
   localStorage.setItem("todoList", JSON.stringify(todoListArr));
   showList("progress");
} 

clearBtn.addEventListener("click", () => {
   todoListArr.splice(0, todoListArr.length);
   localStorage.setItem("todoList", JSON.stringify(todoListArr));
   showList("progress");
});

function statusChecked(selected) {
   let blocName = selected.parentElement.lastElementChild;
   if(selected.checked) {
      blocName.classList.add("checked");
      todoListArr[selected.id].status = "done";
   } else {
      blocName.classList.remove("checked");
      todoListArr[selected.id].status = "progress";
   }
   localStorage.setItem("todoList", JSON.stringify(todoListArr)); 
};

todoInput.addEventListener("keyup", e => {
   let userInput = todoInput.value.trim();
   if(e.key == "Enter" && userInput) {
      if(!isEditedInput) {
         if (!todoListArr) {
            todoListArr = [];
         }
         let userInfo = {name: userInput, status: "progress"};
         todoListArr.push(userInfo);
      } else {
         isEditedInput = false;
         todoListArr[editNumber].name = userInput;
      }
      todoInput.value = "";
      localStorage.setItem("todoList", JSON.stringify(todoListArr));
      progressBtn.classList.add("active");
      doneBtn.classList.remove("active");
      showList("progress");
   }
});

list.addEventListener("click", deleteEditCheckedTask)

function deleteEditCheckedTask (e) {
   if (e.target.classList == 'todo-menu-p') {
      const parentNode = e.target.closest('p');
      showMenu(parentNode);
   }
   if (e.target.tagName == 'INPUT') {
      const parentNode = e.target.closest('input');
      statusChecked(parentNode);
   }
   if (e.target.classList == 'edit-toDo') {
      const editParentNode = e.target.parentNode.parentNode.previousElementSibling;
      const editNumber = editParentNode.firstElementChild;
      const editValueToDo = editParentNode.lastElementChild;
      editInput(editNumber.id, editValueToDo.textContent);
   }
   if (e.target.classList == 'delete-toDo') {
      const deleteToDoBtn = e.target.parentNode.parentNode.previousElementSibling.firstElementChild;
      deleteInput(deleteToDoBtn.id);
   }
};

