const searchForm = document.getElementById('search_form');
const searchInput = document.getElementById('search_input');
const clearFormButton = document.getElementById('clear_form_button');
const recommendationSearch = document.getElementById('recommendation_search');

searchForm.addEventListener('submit', handleFormSubmit);

clearFormButton.addEventListener('click', handleFormReset);

async function fetchData() {
  try {
    const res = await fetch('/travel_recommendation_api.json');

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getSearchResults() {
  let searchResults = [];
  const searchValue = searchInput.value.toLowerCase().trim();
  const data = await fetchData();

  const dataKeys = Object.keys(data);

  const dataKey = dataKeys.filter((key) => {
    if (searchValue === key || key.toLowerCase().includes(searchValue)) {
      return key;
    }
  });

  if (dataKey.length > 0) {
    searchResults = data[dataKey];
    return searchResults;
  } else {
    const dataValues = Object.values(data);

    searchResults = dataValues.map((value) => {
      let results = value.filter((place) => {
        if (
          searchValue === place?.name?.toLowerCase() ||
          place?.description?.toLowerCase().includes(searchValue) ||
          place?.name?.toLowerCase().includes(searchValue)
        ) {
          return place;
        }
      });

      return results;
    });

    searchResults = searchResults.filter((result) => {
      return result.length > 0;
    });

    return searchResults[0];
  }
}

function htmlTemplate(data) {
  return `
        <div class="destination">
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
        </div>
        `;
}

function generateHtmlTemplate(data) {
  if (data?.cities && data?.cities.length > 1) {
    const cities = data.cities.map((city) => {
      return htmlTemplate(city);
    });

    return cities.join('');
  } else {
    return htmlTemplate(data);
  }
}

async function handleFormSubmit(e) {
  console.log('Form submitted');
  e.preventDefault();

  const searchResults = await getSearchResults();

  let resultsHTML = searchResults
    ?.map((result) => {
      if (result) return generateHtmlTemplate(result);

      return 'Noting found!';
    })
    .join('');

  recommendationSearch.innerHTML = resultsHTML;
}

function handleFormReset() {
  searchInput.value = '';
  recommendationSearch.innerHTML = '';
}


