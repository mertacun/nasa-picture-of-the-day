document.getElementById('apodForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedDate = new Date(document.getElementById('date').value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
        alert('Please select a date on or before today.');
        return;
    }

    const date = document.getElementById('date').value;

    fetch(`https://api.nasa.gov/planetary/apod?api_key=tlKxv32XoSPR4pYEUuF5hXVquS7Mco3kq307Fr40&date=${date}`)
        .then(response => response.json())
        .then(data => {
            displayApodData(data);
        })
        .catch(error => console.error('Error fetching APOD data:', error));
});

document.addEventListener('DOMContentLoaded', function () {
    displayFavorites();
});

function displayApodData(apodData) {
    const apodContainer = document.getElementById('apodContainer');

    const apodCard = document.createElement('div');
    apodCard.classList.add('apod-card');

    apodCard.innerHTML = `
        <h2>${apodData.title}</h2>
        <p>Date: ${apodData.date}</p>
        <p>${apodData.explanation}</p>
        <img src="${apodData.url}" alt="${apodData.title}" class="apod-image" data-hdurl="${apodData.hdurl}">
        <button class="button favorite-button">Save to Favorites</button>
    `;

    apodContainer.innerHTML = '';
    apodContainer.appendChild(apodCard);

    const favoriteButton = apodCard.querySelector('.favorite-button');
    favoriteButton.addEventListener('click', function () {
        saveToFavorites(apodData);
    });
}

function saveToFavorites(apodData) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.some(favorite => favorite.date === apodData.date)) {
        favorites.push(apodData);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function removeFromFavorites(apodData) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => favorite.date !== apodData.date);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length > 0) {
        const favoritesHeading = document.createElement('h2');
        favoritesHeading.classList.add('favoritesHeading');
        favoritesHeading.textContent = 'Favorites';
        favoritesContainer.appendChild(favoritesHeading);

        favorites.forEach(apodData => {
            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('favorite-card');

            favoriteCard.innerHTML = `
                <div class="favorite-content">
                    <div class="favorite-info">
                        <h3>${apodData.title}</h3>
                        <p>Date: ${apodData.date}</p>
                    </div>
                    <img src="${apodData.url}" alt="${apodData.title}" class="smallApodImage" data-hdurl="${apodData.hdurl}"><br>
                    <button class="button deleteButton">Delete</button>
                </div>
            `;

            favoritesContainer.appendChild(favoriteCard);

            const deleteButton = favoriteCard.querySelector('.deleteButton');
            deleteButton.addEventListener('click', function () {
                removeFromFavorites(apodData);
            });
        });
    }
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('apod-image')) {
        const hdUrl = event.target.dataset.hdurl;
        window.open(hdUrl, '_blank');
    }
});
