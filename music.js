import data from './songs_data.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="search-page">
    <header>
      <h1>Пошук пісень та виконавців</h1>
    </header>
    <div class="search-bar">
      <input id="searchInput" type="text" placeholder="Шукати пісню або виконавця..." />
    </div>
    <div class="results">
      <ul id="resultsList"></ul>
    </div>
    <div class="pagination" id="pagination"></div>
  </div>
  <style>
    .pagination button {
      background-color: #ff4aed00;
      color: white;
      border: none;
      padding: 5px 10px;
      margin: 2px;
      cursor: pointer;
    }
    .pagination button.active {
      background-color: #ff4aed;
    }
  </style>
`;

const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
const pagination = document.getElementById('pagination');

const itemsPerPage = 10;
let currentPage = 1;
let filteredData = [];

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function updatePagination(totalPages) {
  pagination.innerHTML = '';
  if (totalPages <= 1) return;

  const createPageButton = (page) => {
    const button = document.createElement('button');
    button.textContent = page;
    button.classList.toggle('active', page === currentPage);
    button.addEventListener('click', () => {
      if (currentPage !== page) {
        currentPage = page;
        displayResults(searchInput.value.trim().toLowerCase());
      }
    });
    return button;
  };

  if (currentPage > 3) pagination.appendChild(createPageButton(1));
  if (currentPage > 3) pagination.appendChild(document.createTextNode(' ... '));

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pagination.appendChild(createPageButton(i));
  }

  if (currentPage < totalPages - 2) pagination.appendChild(document.createTextNode(' ... '));
  if (currentPage < totalPages) pagination.appendChild(createPageButton(totalPages));
}

function displayResults(query) {
  resultsList.innerHTML = '';
  filteredData = data.filter(({ title, artist }) =>
    title.toLowerCase().includes(query) || artist.toLowerCase().includes(query)
  );

  const groupedResults = {};
  filteredData.forEach(({ title, artist }) => {
    if (!groupedResults[artist]) {
      groupedResults[artist] = [];
    }
    groupedResults[artist].push(title);
  });

  const artistsList = Object.keys(groupedResults);
  const totalPages = Math.ceil(artistsList.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages) || 1;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentArtists = artistsList.slice(start, end);

  currentArtists.forEach((artist) => {
    const li = document.createElement('li');
    li.classList.add('artist');
    li.innerHTML = `<strong>${highlightText(artist, query)}</strong>`;
    const ul = document.createElement('ul');
    ul.classList.add('songs-list');
    ul.style.maxHeight = '0';
    let hasMatch = false;
    groupedResults[artist].forEach((title) => {
      if (title.toLowerCase().includes(query)) {
        hasMatch = true;
        const songLi = document.createElement('li');
        songLi.innerHTML = highlightText(title, query);
        ul.appendChild(songLi);
      }
    });
    if (ul.children.length > 0) {
      li.appendChild(ul);
      resultsList.appendChild(li);
      li.addEventListener('click', () => {
        ul.style.maxHeight = ul.style.maxHeight === '0px' ? ul.scrollHeight + 'px' : '0';
      });
      if (hasMatch) ul.style.maxHeight = ul.scrollHeight + 'px';
    }
  });

  // Оновлення пагінації після відображення результатів
  updatePagination(totalPages);
}

searchInput.addEventListener('input', (e) => {
  currentPage = 1; // Скидаємо сторінку на 1 при новому пошуку
  displayResults(e.target.value.trim().toLowerCase());
});

// Початкове відображення
displayResults('');
