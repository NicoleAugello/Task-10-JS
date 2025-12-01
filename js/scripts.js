//  TASK  8: Modal with Pokemon Details
// Task 10: Bootstrap & UI Libraries
// Declaration of pokemon array - wrapped in an IIFE
// IIFE: Encapsulate the pokemon repository and related functions
let pokemonRepository = (function () {
  // -----------------------
  // Private variables
  // -----------------------
  let pokemonList = [];
  let apiURL = "https://pokeapi.co/api/v2/pokemon/";
  // -----------------------
  // Private helper: Validation & mutators
  // -----------------------
  // Update the add() Function with Validation
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsURL" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon is not correct");
    }
  }
  function getAll() {
    return pokemonList;
  }
  // -----------------------
  // DOM: List item creation
  // -----------------------
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listPokemon = document.createElement("li");
    listPokemon.classList.add("list-group-item"); // Task 10 - Bootstrap class added here

    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("btn", "btn-primary", "text-capitalize"); // Task 10 - Add button

    // Bootstrap 4 modal trigger
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");

    // Fill modal content when clicked
    button.addEventListener("click", function () {
      pokemonRepository.loadDetails(pokemon).then(function () {
        document.querySelector("#pokemonModalLabel").innerText = pokemon.name;
        document.querySelector(".modal-body").innerHTML = `
      <img src="${pokemon.imageURL}" class="img-fluid mb-2" alt="${pokemon.name}">
      <p>Height: ${pokemon.height}</p>
    `;
      });
    });

    listPokemon.appendChild(button);
    pokemonList.appendChild(listPokemon);
  }

  //-----------------------
  // Modal:  Modal (Task 8) add prior to ShowDetails()
  //-----------------------
  function showModal(title, text, img) {
    let modalContainer = document.querySelector("#modal-container");
    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = "modal-container";
      document.body.appendChild(modalContainer);
    }
    // Clear previous modal content
    modalContainer.innerHTML = "";
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "Close";
    // ensure clicking the close button stops propagation and hides the modal
    closeButtonElement.addEventListener("click", function (e) {
      e.stopPropagation();
      hideModal();
    });
    let pokemonName = document.createElement("h1");
    pokemonName.innerText = title;
    let pokemonHeight = document.createElement("p");
    pokemonHeight.innerText = text;
    let pokemonImage = document.createElement("img");
    pokemonImage.setAttribute("src", img);
    pokemonImage.setAttribute("width", "100%");
    pokemonImage.setAttribute("height", "100%");
    modal.appendChild(closeButtonElement);
    modal.appendChild(pokemonName);
    modal.appendChild(pokemonHeight);
    modal.appendChild(pokemonImage);
    modalContainer.appendChild(modal);
    modalContainer.classList.add("is-visible");
    modalContainer.addEventListener("click", function (e) {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
    // Add ESC key support to close the modal
    function onDocumentKeyDown(e) {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        hideModal();
      }
    }
    // Store reference so it can be removed later
    modalContainer._onKeyDown = onDocumentKeyDown;
    document.addEventListener("keydown", onDocumentKeyDown);
  }
  function hideModal() {
    let modalContainer = document.querySelector("#modal-container");
    if (modalContainer) {
      // remove keydown listener if present
      if (modalContainer._onKeyDown) {
        document.removeEventListener("keydown", modalContainer._onKeyDown);
        delete modalContainer._onKeyDown;
      }
      modalContainer.classList.remove("is-visible");
      // remove modal container from DOM so it doesn't block future interactions
      if (modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    }
  }

  // Show details uses loadDetails then displays modal
  function showDetails(pokemon) {
    return loadDetails(pokemon).then(function () {
      showModal(pokemon.name, "Height: " + pokemon.height, pokemon.imageURL);
    });
  }
  // -----------------------
  // API: Fetch list and details
  // -----------------------
  //Add loadList() to Fetch Pokémon from API
  function loadList() {
    return fetch(apiURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsURL: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  //Add loadDetails() to Fetch Individual Pokémon Info
  function loadDetails(item) {
    let url = item.detailsURL;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageURL = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
      })
      .catch(function (e) {
        console.error(e);
      });
  }
  //-----------------------
  // Public API (exposed methods)
  // -----------------------
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})(); // End IIFE: pokemonRepository
// -----------------------
// Initialization: load list and render
// -----------------------
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
//retrieve the pokemonList array + MESSAGE (CORRECTION)  display the same display as before, with the phrase WOW! That's BIG! for the larger Pokémon.
// PokemonRepository to find Pokémon whose names start with A-M.
document.write("<br><hr><h1>Pokémon Name Filter:</h1>");
// Filter function with parameter for flexible behavior
pokemonRepository.filterByName = function (name) {
  return pokemonRepository.getAll().filter(function (pokemon) {
    // Filter Pokémon whose name matches the given parameter (case-insensitive)
    return pokemon.name.toLowerCase() === name.toLowerCase();
  });
};
// Usage: Find Pokémon named 'Charmeleon'
let foundPokemon = pokemonRepository.filterByName("Charmeleon");
// Display
foundPokemon.forEach(function (pokemon) {
  let message = "";
  if (pokemon.height > 10) {
    message = " - Wow, that's Big!";
  }
  document.write(
    `<h2 style="display:inline;">${pokemon.name} (Height: ${pokemon.height}) </h2> <span style="font-size:1em; font-weight:normal;">${message}</span> <br>`
  );
});
