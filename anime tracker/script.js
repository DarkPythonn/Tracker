const searchBar = document.getElementById('search-bar');
const categorySelect = document.getElementById('category-select');
const animeList = document.getElementById('anime-list');
const comicsList = document.getElementById('comics-list');
const animeCount = document.getElementById('anime-count');
const comicsCount = document.getElementById('comics-count');

// Initialize data with default structure if it doesn't exist
let data = JSON.parse(localStorage.getItem('catalog')) || {
    anime: [], // Array for anime titles
    comics: [] // Array for comics titles
};

// Save data to localStorage
function saveData() {
    localStorage.setItem('catalog', JSON.stringify(data));
}

// Update counters
function updateCounters() {
    animeCount.textContent = data.anime.length;
    comicsCount.textContent = data.comics.length;
}

// Render the lists
function renderLists() {
    // Ensure data.anime and data.comics are arrays
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

    // Update counters
    updateCounters();
}

// Filter the lists based on search query
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

    // Update counters
    updateCounters();
}

// Delete a title from a category
function deleteTitle(category, title) {
    if (Array.isArray(data[category])) {
        data[category] = data[category].filter(item => item !== title);
        saveData();
        renderLists();
    }
}

// Search for a title on Google
function searchGoogle(title) {
    const query = encodeURIComponent(title);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

// Handle search bar input
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterLists(query);
});

// Handle adding new titles
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchBar.value.trim()) {
        const category = categorySelect.value;
        const title = searchBar.value.trim();

        // Ensure the category exists in the data object
        if (!data[category]) {
            data[category] = [];
        }

        if (!data[category].includes(title)) {
            data[category].push(title);
            saveData();
            renderLists();
            searchBar.value = '';
        } else {
            alert('Title already exists!');
        }
    }
});

// Initial render
renderLists();