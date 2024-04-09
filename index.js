document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("card-container");

  fetch("http://localhost:3000/house")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((house) => {
        const card = createCard(house);
        cardContainer.appendChild(card);
      });
    });
});

function createCard(house) {
  const card = document.createElement("div");
  card.classList.add("card")
  const title = document.createElement("h3");
  title.textContent = `NAME: ${house.name}`;
  const houseNo = document.createElement("p");
  houseNo.textContent = `HOUSE NUMBER: ${house.hseNo}`;
  const amount = document.createElement("span")
  amount.textContent = `YOUR AMOUNT IS: ${house.amount}`
  const meterValue = document.createElement("span");
  meterValue.textContent = `METER VALUE: ${house.meterValue}`;
  card.appendChild(title);
  card.appendChild(houseNo);
  card.appendChild(amount);
  card.appendChild(meterValue);
  return card;
}
