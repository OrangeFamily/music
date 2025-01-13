import data from './songs_data.js';

// Структура для відображення
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
  </div>
`;

const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');

// Функція для виділення тексту
function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Групування пісень за виконавцями
function displayResults(query) {
  resultsList.innerHTML = '';

  // Фільтруємо дані за піснями і виконавцями
  const results = data.filter(
    ({ title, artist }) =>
      title.toLowerCase().includes(query) || artist.toLowerCase().includes(query)
  );

  if (results.length > 0) {
    const groupedResults = {};

    // Групуємо пісні за виконавцями
    results.forEach(({ title, artist }) => {
      if (!groupedResults[artist]) {
        groupedResults[artist] = [];
      }
      groupedResults[artist].push(title);
    });

    // Відображаємо виконавців та їх пісні
    Object.keys(groupedResults).forEach((artist) => {
      const li = document.createElement('li');
      li.classList.add('artist');
      li.innerHTML = `<strong>${highlightText(artist, query)}</strong>`;
      
      const ul = document.createElement('ul');
      ul.classList.add('songs-list');
      ul.style.maxHeight = '0'; // Спочатку приховуємо список

      groupedResults[artist].forEach((title) => {
        const songLi = document.createElement('li');
        songLi.innerHTML = highlightText(title, query);
        ul.appendChild(songLi);
      });

      li.appendChild(ul);
      resultsList.appendChild(li);

      // Додаємо обробник події для розкриття списку
      li.addEventListener('click', () => {
        const songsList = li.querySelector('.songs-list');
        // Перемикаємо анімацію для відкриття/закриття
        if (songsList.style.maxHeight === '0px') {
          songsList.style.maxHeight = songsList.scrollHeight + 'px'; // Встановлюємо висоту для анімації
        } else {
          songsList.style.maxHeight = '0'; // Сховуємо список
        }
      });

      // Автоматично відкриваємо список, якщо знайдена пісня
      if (query) {
        const songsList = li.querySelector('.songs-list');
        songsList.style.maxHeight = songsList.scrollHeight + 'px'; // Відкриваємо список
      }
    });
  } else {
    resultsList.innerHTML = '<li>Не знайдено результатів</li>';
  }
}

// Ініціалізація
displayResults('');

// Оновлення результатів під час введення
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  displayResults(query);
});
