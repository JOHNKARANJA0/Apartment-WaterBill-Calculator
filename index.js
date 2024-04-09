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
    amount.className = "currentAmount"
    amount.textContent = `YOUR AMOUNT IS: ${house.amount}`;
    const meterValue = document.createElement("span");
    meterValue.className = "meterValue"
    meterValue.textContent = `METER VALUE: ${house.meterValue}`;
    //create a button to update the value of the card
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update Meter Value";
    // Store house ID for update
    updateBtn.dataset.houseId = house.id; 
    updateBtn.addEventListener("click", () => {handleUpdateClick(event, card)});
    //create a button to delete the card
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";
    deleteBtn.dataset.houseId = house.id;
    deleteBtn.addEventListener("click", handleDeleteClick);
    // Create and add the input field
    const newMeterInput = document.createElement("input");
    newMeterInput.type = "number";
    newMeterInput.placeholder = "Enter New Meter Value";
    newMeterInput.classList.add("card-input");
    //append the data to the card
    card.appendChild(title);
    card.appendChild(houseNo);
    card.appendChild(amount);
    card.appendChild(meterValue);
    card.appendChild(newMeterInput);
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
    // Get house ID from button data
    const houseId = event.target.dataset.houseId; 

    // Delete house from db.json using Fetch API with error handling
    fetch(`http://localhost:3000/house/${houseId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete house: ${response.statusText}`);
      }
      event.target.parentNode.remove();
    });
  }
  function handleUpdateClick(event, card) {
    const houseId = event.target.dataset.houseId;

    // Fetch house data from db.json 
    fetch(`http://localhost:3000/house/${houseId}`)
      .then((response) => response.json())
      .then((fetchedHouse) => {
        const house = fetchedHouse;
        const newMeterValue = parseInt(event.target.previousSibling.value);
        if (newMeterValue> house.meterValue){
            if (isNaN(newMeterValue)){
                alert("Please input a number")
            }else{
                const waterUsage = newMeterValue - house.meterValue;
                let amount = waterUsage * 2;
                // Update db.json with new meter value and amount (using Fetch API with error handling)
                fetch(`http://localhost:3000/house/${houseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({  amount: amount, meterValue: newMeterValue}),
                }).then((response) => {
                if (!response.ok) {
                    throw new Error(
                    `Failed to update house data: ${response.statusText}`
                    );
                }
                const amountElement = card.querySelector('.currentAmount'); 
                amountElement.textContent = `YOUR AMOUNT IS: ${amount}`;
                const meterValueElement = card.querySelector('.meterValue');
                meterValueElement.textContent = `METER VALUE: ${newMeterValue}`;
                alert("Your Water bill has been updated successfully!"); 
                })
                event.target.previousSibling.value = ""
            }
        }
        else if (newMeterValue === house.meterValue){
            alert("Your bill is up to date")
        }
        else{
            alert("INVALID INPUT")
        }
      })
      .catch((error) => console.error(error));
    }
});
