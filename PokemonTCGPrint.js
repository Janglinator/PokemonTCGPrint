document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const pokemonList = document.getElementById('pokemonList');
    const printButton = document.getElementById('print-button');

    printButton.addEventListener('click', () => {
        // Hide the header and search bar
        const header = document.querySelector('header');
        header.style.display = 'none';

        // Get all the card images
        const cards = document.querySelectorAll('#pokemonList img');

        // Create a new window for the print preview
        const printWindow = window.open('', 'printWindow', 'width=600,height=600');

        // Write the card images to the print preview
        let cardIndex = 0;
        while (cardIndex < cards.length) {
            const cardTable = document.createElement('table');
            cardTable.style.borderSpacing = 0;

            for (let i = 0; i < 3; i++) {
                const cardRow = document.createElement('tr');

                for (let j = 0; j < 3; j++) {
                    const cardCell = document.createElement('td');
                    const cardImg = cards[cardIndex];

                    cardImg.style.width = '6.3cm';
                    cardImg.style.height = '8.8cm';
                    cardImg.style.display = 'block';

                    cardCell.style.padding = 0;
                    cardCell.style.border = 0;

                    cardCell.appendChild(cardImg);
                    cardRow.appendChild(cardCell);

                    cardIndex++;

                    if (cardIndex >= cards.length) {
                        break;
                    }
                }

                cardTable.appendChild(cardRow);

                if (cardIndex % 9 === 0 && cardIndex < cards.length) {
                    // Add 9 identically sized and oriented cards after every 9 normal cards
                    const extraCardRow = document.createElement('tr');

                    for (let j = 0; j < 3; j++) {
                        const extraCardCell = document.createElement('td');
                        const extraCardImg = document.createElement('img');

                        extraCardImg.src = 'https://i.imgur.com/KLMyGzO.png';
                        extraCardImg.alt = 'Extra Card';
                        extraCardImg.style.width = '6.3cm';
                        extraCardImg.style.height = '8.8cm';
                        extraCardImg.style.display = 'block';

                        extraCardCell.style.padding = 0;
                        extraCardCell.style.border = 0;

                        extraCardCell.appendChild(extraCardImg);
                        extraCardRow.appendChild(extraCardCell);
                    }

                    cardTable.appendChild(extraCardRow);
                }

                if (cardIndex >= cards.length) {
                    break;
                }
            }

            printWindow.document.body.appendChild(cardTable);
        }

        // Print the window
        printWindow.print();

        // Show the header and search bar
        header.style.display = 'block';
    });

    function searchCards(query) {
        let url;
        if (query) {
            url = `https://api.pokemontcg.io/v2/cards?q=name:${query}`;
        } else {
            url = 'https://api.pokemontcg.io/v2/cards';
        }

        // Show loading indicator
        pokemonList.innerHTML = '<div class="loading">Loading...</div>';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                pokemonList.innerHTML = '';
                const cards = data.data.filter(card => card.supertype === 'Pokémon');
                cards.forEach(card => {
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    img.src = card.images.large;
                    img.alt = card.name;
                    li.appendChild(img);
                    pokemonList.appendChild(li);
                });
            })
            .catch(error => console.log(error));
    }



    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const query = searchInput.value;
        searchCards(query);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchInput.value = searchQuery;
        searchCards(searchQuery);
    } else {
        searchCards('');
    }
});
