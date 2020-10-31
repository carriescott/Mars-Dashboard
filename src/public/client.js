// import {set} from "immutable";

let store = {
    rover: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selectedRover: 'Curiosity',
    photos: ''
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
};

const render = async (root, state) => {
    root.innerHTML = App(state)
};

function selectRover(name) {
    updateStore(store, { selectedRover: name});
}

// create content
const App = (state) => {
    let { rovers, selectedRover, rover, photos } = state;
        return (`
        <header>
        <h2>Welcome the the Nasa Mars Dashboard</h2>
        <h4>Click on one of the rovers below to see it's mission details</h4>
        </header>
        <main>
            ${RoverTabs(rovers, selectedRover)}
            ${RoverData(selectedRover, rover, photos)}
        </main>
        <footer></footer>
    `)};


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const Tab = (name, selectedRover) => {
    return (`
        <button id="${name}" onclick="selectRover(id)" class=${name === selectedRover ? 'selected' : ''}>
        ${name}
        </button>
        `)
};

const RoverTabs = (rovers, selectedRover) => {
    return (`
     ${rovers.map((name) => {
        return (`
       ${Tab(name, selectedRover)}
        `)
    }).join("")}
    `)
};

// Example of a pure function that renders information requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
};

const RoverData = (selectedRover, rover, photos) => {
    if(rover === '' || rover.name !== selectedRover) {
        getRover(selectedRover);
        return (`
        <section class="loading-container">
        <h2>One second please just Loading some exciting data...</h2>
        </section>
    `);
    } else {
        return(`
        <section class="rover-information-container">
        <h2>${rover.name}</h2>
        <p>Launched: ${rover.launch_date}</p>
        <p>Landed: ${rover.landing_date}</p>
        <p>Mission Status: ${rover.status}</p>
        </section>
        <section>
        <h2>Recent Photos</h2>
        ${RoverPhotos(selectedRover, rover, photos)}
        </section>
    `);
    }
};


const RoverPhotos = (selectedRover, rover, photos) => {
    if(photos === '' || photos[0].rover.name !== selectedRover ) {
        getRoverPhotos(selectedRover, rover.max_date);
        return (`
        <section class="photos-loading"></section>
        `);
    } else {
        const latestPhotos =photos.slice(0,4);
        return(`
        <section class="photo-container">
        ${PhotoList(latestPhotos)}
        </section>
        `)
    }
};

const PhotoList = (photos) => {
    return (`
    <section>
        ${photos.map(photo => (`
      <img src="${photo.img_src}" height="350px" width="100%">
      <p>Date: ${photo.earth_date}</p>
            `)).join("")}
     </section>
    `)
};


// ------------------------------------------------------  API CALLS

const getImageOfTheDay = (state) => {
    let { apod } = state;
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
};

const getRover = (rover_name) => {
    fetch(`http://localhost:3000/rovers/${rover_name}`)
        .then(res => res.json())
        .then(({ photo_manifest })=> updateStore(store, {
            rover: {
                ...photo_manifest
            }
        })
        )
};

const getRoverPhotos = (rover_name, max_date) => {
    fetch(`http://localhost:3000/rover_photos/${rover_name}/${max_date}`)
        .then(res => res.json())
        .then(( {photos} ) => {
            updateStore(store, {
                    photos: [
                        ...photos,
                    ]
                }
            )})
};

