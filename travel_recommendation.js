const searchForm = document.getElementById('search_form');
const searchInput = document.getElementById('search_input');
const clearFormButton = document.getElementById('clear_form_button');
const searchType = document.getElementById('search_type');
const recommendationSearch = document.getElementById('recommendation_search');

async function fetchData() {
  try {
    const res = await fetch('/travel_recommendation_api.json');

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getSearchValue() {
  let searchResults = [];
  const searchValue = searchInput.value.toLowerCase().trim();
  const data = await fetchData();
  const searchTypeValue = searchType.value.toLowerCase();

  if (searchTypeValue === 'countries') {
    searchResults = data?.countries?.filter((country) => {
      if (
        searchValue === country?.name?.toLowerCase() ||
        searchValue === country?.cities?.name?.toLowerCase() ||
        country?.cities?.description?.toLowerCase().includes(searchValue)
      ) {
        return country;
      }
    });
  }

  if (searchTypeValue === 'temples') {
    searchResults = data?.temples?.filter((temple) => {
      if (
        temple.name.toLowerCase().includes(searchValue) ||
        temple.description.toLowerCase().includes(searchValue) ||
        searchValue === temple.name.toLowerCase()
      ) {
        return temple;
      }
    });
  }

  if (searchTypeValue === 'beaches') {
    searchResults = data?.beaches?.filter((beach) => {
      if (
        beach.name.toLowerCase().includes(searchValue) ||
        searchValue === beach.name.toLowerCase() ||
        beach.description.toLowerCase().includes(searchValue)
      ) {
        return beach;
      }
    });
  }

  return searchResults;
}

function generateHtmlTemplate(data) {
  const template = `
        <div class="destination_img">
            <img src=${data.imageUrl} alt=${data.name}>
        </div>
        <div class="destination_info">
            <h3 class="name">${data.name}</h3>
            <p class="description">
                ${data.description}
            </p>
            <button type="button">Visit</button>
        </div>
    `;

  return template;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const searchTypeValue = searchType.value.toLowerCase();

  const searchResults = await getSearchValue();

  console.log(searchResults);

  let resultsHTML = searchResults
    ?.map((result) => {
      if (searchTypeValue === 'countries') {
        return generateHtmlTemplate(result.cities[0]);
      }

      if (searchTypeValue === 'temples') {
        return generateHtmlTemplate(result);
      }

      if (searchTypeValue === 'beaches') {
        return generateHtmlTemplate(result);
      }
    })
    .join('');

  recommendationSearch.innerHTML = resultsHTML;
}

function handleFormReset() {
  searchInput.value = '';
  recommendationSearch.innerHTML = '';
}

searchForm.addEventListener('submit', handleFormSubmit);

clearFormButton.addEventListener('click', handleFormReset);
