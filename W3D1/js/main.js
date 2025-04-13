const ENDPOINT = 'https://striveschool-api.herokuapp.com/api/deezer/search?q='
const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const songContainer = document.getElementById('song-list')
const loadingIndicator = document.querySelector('.loading-indicator')
const alertContainer = document.getElementById('danger-alert')


const saveLastSearchQuery = () => {
    sessionStorage.setItem('lastSearch', JSON.stringify(searchInput.value))
}

const getLastSearchQuery = () => {
    return sessionStorage.getItem('lastSearch') ?? 'jovanotti'
}

const toggleShowLoadingIndicator = () => {
    loadingIndicator.classList.toggle('d-none')
}

const toggleDangerAlertMessage = () => {
    alertContainer.innerText = 'Oops, something went wrong, try again later...'
    alertContainer.classList.toggle('d-none')
}

const validateInputQuery = (value) => {
    const isInputEmpty = value.trim() === ''
    const isMinimumLength = value.length >= 2

    return !isInputEmpty && isMinimumLength
}

const getSongData = async (searchTerm) => {
    toggleShowLoadingIndicator()
    try {
        const url = `${ENDPOINT}${searchTerm}`
        const response = await fetch(url)
        return await response.json()
    } catch (error) {
        toggleDangerAlertMessage()
    } finally {
        toggleShowLoadingIndicator()
    }
}

const generateSongCard = data => {
    const wrapper = document.createElement('a')
    wrapper.setAttribute('class', 'col-12 col-md-6 col-lg-3')
    wrapper.href = `./song-details.html?songId=${data.id}&artist=${data.artist.name.toLowerCase()}`

    const cardContainer =  document.createElement('div')
    cardContainer.setAttribute('class', 'song-card rounded overflow-hidden')

    const img = document.createElement('img')
    img.setAttribute('class', 'img-fluid rounded')
    img.src = data.album.cover_xl

    const title = document.createElement('h3')
    title.setAttribute('class', 'py-2')
    title.innerText = data.title

    cardContainer.append(img, title)
    wrapper.appendChild(cardContainer)
    songContainer.appendChild(wrapper)
}



getSongData(getLastSearchQuery())
    .then(songs => songs.data.map(song => generateSongCard(song)))

searchBtn.addEventListener('click', (event) => {
    event.preventDefault()

    const isValid = validateInputQuery(searchInput.value)
    if (isValid) {
        saveLastSearchQuery()
        songContainer.innerHTML = ''

        getSongData(searchInput.value)
            .then(songs => songs.data.map(song => generateSongCard(song)))
    } else {
        alert('Warning, incorrect input')
    }

})

