const formJS = document.querySelector("form");

const formJQ = $("form");

const inputJQ = $("input");

const msgJQ = $(".msg");

const listJQ = $(".ajax-section .cities");

$(document).ready(() => {
  localStorage.setItem(
    "apiKey",
    EncryptStringAES("1d9e5adcad5de15797fca3e54136f073")
  );
});

formJQ.submit((e) => {
  e.preventDefault();
  getWeatherDataFromApi();
});

const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  const cityNameInput = inputJQ.val();
  const units = "metric";
  const lang = "tr";
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${apiKey}&units=${units}&$lang=${lang}`;

  await $.ajax({
    type: "GET",
    url: URL,
    dataType: "json",
    success: (response) => {
      const { main, sys, weather, name } = response;
      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
      const createdLi = $("<li></li>");
      createdLi.addClass("city");
      createdLi.html(`
      <h2 class="city-name" data-name="${name},${sys.country}">
       <span>${name}</span>
       <sup>${sys.country}</sup>
       </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
       <figure>
       <img class="city-icon" src="${iconUrl}">
       <figcaption>${weather[0].description}</figcaption>
       </figure>`);

      const cityCardList = listJQ.find(".city");
      const cityCardListArray = cityCardList.get();
      if (cityCardListArray.length > 0) {
        const filteredArray = cityCardListArray.filter(
          (card) => $(card).find("span").text() == name
        );
        if (filteredArray.length > 0) {
          msgJQ.text(
            `You already know the weather for ${name}, Please search for another city 😉`
          );
          msgJQ.css({ color: "red", "text-decoration": "underline" });
          formJQ.trigger("reset");
          return;
        }
      }

      listJQ.prepend(createdLi);
      formJQ.trigger("reset");
    },
    beforeSend: (request) => {},
    complete: () => {},
    error: (XMLHttpRequest) => {
      msgJQ.text(`${XMLHttpRequest.status} ${XMLHttpRequest.statusText}`);
      msgJQ.css({ color: "red", "text-decoration": "underline" });
      setTimeout(() => {
        msgJQ.text("");
      }, 3000);
      formJQ.trigger("reset");
    },
  });
};
