let store = {
    rover: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selectedRover: 'Curiosity',
    photos: ''
};

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

// Build html content
const App = (state) => {
    let { rovers, selectedRover, rover, photos } = state;
        return (`
        <header class="dashboard-header">
        <h2>Welcome the the Nasa Mars Dashboard</h2>
        <p>Click on one of the rovers below to see it's mission details</p>
        </header>
        <main class="dashboard-main">
            ${RoverTabs(rovers, selectedRover)}
            ${RoverData(selectedRover, rover, photos)}
        </main>
        <footer></footer>
    `)};

window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const Tab = (name, selectedRover) => {
    return (`
        <button id="${name}" onclick="selectRover(id)" class="${name === selectedRover ? 'selected' : 'rover-button'}">
        ${name}
        </button>
        `)
};

const RoverTabs = (rovers, selectedRover) => {
    return (`
    <section class="tabs-container">
    ${rovers.map((name) => {
        return (`
       ${Tab(name, selectedRover)}
        `)
    }).join("")}
    </section>
     
    `)
};

const RoverData = (selectedRover, rover, photos) => {
    if(rover === '' || rover.name !== selectedRover) {
        getRover(selectedRover);
        return (`
        <section class="loading-container">
        <h3>One second please, exciting data loading...</h3>
        </section>
    `);
    } else {
        return(`
        <section class="rover-information-container">
        <h2>Rover: ${rover.name}</h2>
        <p>Launched: ${rover.launch_date}</p>
        <p>Landed: ${rover.landing_date}</p>
        <p>Mission Status: ${rover.status}</p>
        </section>
        <section class="rover-photo-container">
        <h3>Recent Photos</h3>
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
        <section class="photo-list-container">
        ${PhotoList(latestPhotos)}
        </section>
        `)
    }
};

const PhotoList = (photos) => {
    return (`
    <section class="photo-container">
        ${photos.map(photo => (`
      <div>
      <img src="${photo.img_src}" class="rover-image">
      <p>Date: ${photo.earth_date}</p>
      </div>  
      
            `)).join("")}
     </section>
    `)
};


// ------------------------------------------------------  API CALLS

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
