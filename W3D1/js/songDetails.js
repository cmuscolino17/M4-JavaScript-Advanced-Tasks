const queryParams = new URLSearchParams(window.location.search)
const songId = queryParams.get('songId')
const artist = queryParams.get('artist')

const ENDPOINT = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${artist}`
const songCover = document.getElementById('song-cover')
const songDetailList = document.getElementById('song-detail-list')

const getSongDetails = async () => {
    try {
        const response = await fetch(ENDPOINT)
        const json = await response.json()
        const { data } = json

        return data.find(song => song.id === Number(songId))
    } catch (error) {
        console.log(error)
    }
}

const displaySongCover = img => {
    songCover.src = img
    songCover.setAttribute('class','img-fluid')
}

const extractSongDetails = data => {
    const { title, duration, rank, explicit_lyrics } = data
    const { name } = data.artist
    const { title: albumTitle, cover_xl: cover } = data.album

    return {
        image: cover,
        details: [
            {label: 'Song title: ', value: title},
            {label: 'Duration: ', value: duration},
            {label: 'Rank: ', value: rank},
            {label: 'Explicit: ', value: explicit_lyrics ? 'Yes' : 'No'},
            {label: 'Artist: ', value: name},
            {label: 'Album title: ', value: albumTitle},
        ]
    }
}

const displaySongDetails = song => {
    displaySongCover(song.image)
    song.details.map(detail => {
        const li = document.createElement('li')
        li.setAttribute('class', 'list-group-item')
        li.innerHTML = `<span><strong>${detail.label}</strong></span><span>${detail.value}</span>`
        songDetailList.appendChild(li)
    })
}

getSongDetails()
    .then(results => displaySongDetails(extractSongDetails(results)))