const searchBar = document.getElementById('search-bar');
const addButton = document.getElementById('add-button');
const categorySelect = document.getElementById('category-select');
const animeList = document.getElementById('anime-list');
const comicsList = document.getElementById('comics-list');
const animeCount = document.getElementById('anime-count');
const comicsCount = document.getElementById('comics-count');

let data = JSON.parse(localStorage.getItem('catalog')) || {
  anime: [],
  comics: [],
};

function saveData() {
  localStorage.setItem('catalog', JSON.stringify(data));
}

function updateCounters() {
  animeCount.textContent = data.anime.length;
  comicsCount.textContent = data.comics.length;
}

function renderLists() {
  if (!Array.isArray(data.anime)) data.anime = [];
  if (!Array.isArray(data.comics)) data.comics = [];

  animeList.innerHTML = data.anime.map(title => `
    <li>
      <span class="title" onclick="searchGoogle('${title}')">${title}</span>
      <button class="delete-btn" onclick="deleteTitle('anime', '${title}')">×</button>
    </li>
  `).join('');
  comicsList.innerHTML = data.comics.map(title => `
    <li>
      <span class="title" onclick="searchGoogle('${title}')">${title}</span>
      <button class="delete-btn" onclick="deleteTitle('comics', '${title}')">×</button>
    </li>
  `).join('');

  updateCounters();
}

function filterLists(query) {
  if (!Array.isArray(data.anime)) data.anime = [];
  if (!Array.isArray(data.comics)) data.comics = [];

  animeList.innerHTML = data.anime.filter(title => title.toLowerCase().includes(query)).map(title => `
    <li>
      <span class="title" onclick="searchGoogle('${title}')">${title}</span>
      <button class="delete-btn" onclick="deleteTitle('anime', '${title}')">×</button>
    </li>
  `).join('');
  comicsList.innerHTML = data.comics.filter(title => title.toLowerCase().includes(query)).map(title => `
    <li>
      <span class="title" onclick="searchGoogle('${title}')">${title}</span>
      <button class="delete-btn" onclick="deleteTitle('comics', '${title}')">×</button>
    </li>
  `).join('');

  updateCounters();
}

function deleteTitle(category, title) {
  if (Array.isArray(data[category])) {
    data[category] = data[category].filter(item => item !== title);
    saveData();
    renderLists();
  }
}

function searchGoogle(title) {
  const query = encodeURIComponent(title);
  window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

function addTitle() {
  const title = searchBar.value.trim();
  if (title) {
    const category = categorySelect.value;
    if (!data[category].includes(title)) {
      data[category].push(title);
      saveData();
      renderLists();
      searchBar.value = '';
    } else {
      alert('Title already exists!');
    }
  }
}

searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  filterLists(query);
});

addButton.addEventListener('click', addTitle);

searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTitle();
  }
});

renderLists();
