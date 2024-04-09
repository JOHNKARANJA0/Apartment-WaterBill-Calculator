document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("card-container");
  // create a card to display the values fetched from the db.json
  function createCard(house) {
    const card = document.createElement("div");
    card.classList.add("card");
    const title = document.createElement("h3");
    title.textContent = `NAME: ${house.name}`;
    const houseNo = document.createElement("p");
    houseNo.textContent = `HOUSE NUMBER: ${house.hseNo}`;
    const amount = document.createElement("span");
    amount.textContent = `YOUR AMOUNT IS: ${house.amount}`;
    const meterValue = document.createElement("span");
    meterValue.textContent = `METER VALUE: ${house.meterValue}`;
    //create a button to update the value of the card
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "UPDATE";
    //create a button to delete the card
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";
    deleteBtn.dataset.houseId = house.id;
    deleteBtn.addEventListener('click', handleDeleteClick);
    //append the data to the card
    card.appendChild(title);
    card.appendChild(houseNo);
    card.appendChild(amount);
    card.appendChild(meterValue);
    card.appendChild(updateBtn);
    card.appendChild(deleteBtn);
    return card;
  }

  //fetch method
  fetch("http://localhost:3000/house")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((house) => {
        const card = createCard(house);
        cardContainer.appendChild(card);
      });
    });
  const houseForm = document.getElementById("house-form");
  //Updated method
  houseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("tenant-name").value;
    const hseNo = document.getElementById("house-number").value;
    const meterValue = document.getElementById("meter-value").value;
    const amount = document.getElementById("amount").value;

    const newHouse = { name, hseNo, amount, meterValue };

    fetch("http://localhost:3000/house", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHouse),
    })
      .then((response) => response.json())
      .then((house) => {
        const card = createCard(house);
        cardContainer.appendChild(card);
        houseForm.reset();
      });
  });
  function handleDeleteClick(event) {
    const houseId = event.target.dataset.houseId; // Get house ID from button data
  
    // Delete house from db.json using Fetch API (with error handling)
    fetch(`http://localhost:3000/house/${houseId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to delete house: ${response.statusText}`);
      }
      event.target.parentNode.remove();
    })
  }
});

