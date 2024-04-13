let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch Andy's Toys
  fetchToys();

  // Add Toy Event Listener
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    createToy(toyName, toyImage);
    event.target.reset();
  });

  // Function to Fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToy(toy));
      });
  }

  // Function to Render Toy
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(toyCard);

    // Add Event Listener for Like Button
    const likeButton = toyCard.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      increaseLikes(toy);
    });
  }

  // Function to Create a New Toy
  function createToy(name, image) {
    const formData = {
      name: name,
      image: image,
      likes: 0,
    };

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    };

    fetch("http://localhost:3000/toys", configObj)
      .then((response) => response.json())
      .then((toy) => renderToy(toy));
  }

  // Function to Increase Likes
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;

    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    };

    fetch(`http://localhost:3000/toys/${toy.id}`, configObj)
      .then((response) => response.json())
      .then((updatedToy) => {
        const toyCard = document.getElementById(updatedToy.id);
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }
});
