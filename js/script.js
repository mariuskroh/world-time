const endpoint = "https://raw.githubusercontent.com/mariusKroh/worldTime/master/timezones.json";
const timezones = [];
const secondHand = document.querySelector(".second-hand");
const minHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const container = document.querySelector(".clock-container")
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search");
const submitButton = document.querySelector(".make-clock")
const suggestions = document.querySelector(".suggestions")

// get timezones.json
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => timezones.push(...data))
  .catch(err => console.log(err));

// find&display search query
function findMatches(wordToMatch, timezones) {
  return timezones.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.country.match(regex)
  })
}

function displayMatches() {
  const matchArray = findMatches(this.value, timezones);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `${this.value}`)
    const countryName = place.country.replace(regex, `${this.value}`)
    return `<li class="suggestion">${cityName}, ${countryName} UTCOffset: ${place.offset}</li>`;
  }).join("")
  suggestions.innerHTML = html;
}

// toggle highlight class on mouseover - can probably be simplified
function addHighlight(e) {
  const target = e.target;
  if (target.tagName != "LI") return;
  target.classList.add("highlight");
}

function removeHighlight(e) {
  const target = e.target;
  if (target.tagName != "LI") return;
  target.classList.remove("highlight");
}

// populate form when clicking on a suggestion
function populateForm(e) {
  const target = e.target;
  if (target.tagName != "LI") return;
  searchInput.value = target.innerHTML;
}




function pauseTransition(currentValue) {
  if (currentValue === 0) {
    secondHand.classList.remove("transition")
  } else {
    secondHand.classList.add("transition");
  }
  // needs update not to call each second, do we actually need seconds in a world clock?
}


function getUTCTime() {
  const now = new Date()
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  return {
    hours: utcHours,
    minutes: utcMinutes,
    seconds: utcSeconds
  }
}

function setSeconds(seconds) {

  let secondHandRotation = 90 + (seconds * 6);
  return secondHandRotation
}

function setTime() {
  const rotationOffset = 90;


  const seconds = getUTCTime().seconds;
  const minutes = getUTCTime().minutes;
  const hours = getUTCTime().hours;
  pauseTransition(seconds);



  secondHand.style.transform = `rotate(${setSeconds(seconds)}deg)`;

  const minutesDegrees = (minutes / 60) * 360 + 90;
  minHand.style.transform = `rotate(${minutesDegrees}deg)`;

  const hoursDegrees = (hours / 12) * 360 + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  // set Background
  //setBackground(minutes, seconds, hours);

}

function makeClock() {
  event.preventDefault()
  const userInput = searchInput.value;

}

// function setBackground(h, s, l) {
//   const hue = h * 6;
//   const saturation = s * (100 / 60);
//   const light = l * (100 / 60);
//   container.style = `background-color:hsl(${hue},${saturation}%,${light}%)`
// }

setInterval(setTime, 1000);

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

searchForm.addEventListener("mousemove", addHighlight);
searchForm.addEventListener("mouseout", removeHighlight);

suggestions.addEventListener("click", populateForm);
searchForm.addEventListener("submit", makeClock);