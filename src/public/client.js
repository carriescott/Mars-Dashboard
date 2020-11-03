let store = Immutable.Map({
    rover: '',
    rovers: Immutable.List( ['Curiosity', 'Opportunity', 'Spirit']),
    selectedRover: 'Curiosity',
    roverPhotos: ''
});

const root = document.getElementById('root');

const updateStore = (state, newState) => {
    store = state.merge(newState);
    render(root, store)
};

const render = async (root) => {
    root.innerHTML = App()
};

function selectRover(name) {
    updateStore(store, { selectedRover: name});
}

// Build html content
const App = () => {
        return (`
        <header class="dashboard-header">
        <h2>Welcome the the Nasa Mars Dashboard</h2>
        <p>Click on one of the rovers below to see it's mission details</p>
        </header>
        <main class="dashboard-main">
            ${RoverTabs(store.get('rovers'), store.get('selectedRover'))}
            ${RoverData(store.get('selectedRover'), store.get('rover'), store.get('roverPhotos'))}
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

const RoverData = (selectedRover, rover, roverPhotos) => {
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
        ${RoverPhotos(selectedRover, rover, roverPhotos)}
        </section>
    `);
}
};

const RoverPhotos = (selectedRover, rover, roverPhotos) => {
    if(roverPhotos === '' || roverPhotos[0].rover.name !== selectedRover ) {
        getRoverPhotos(selectedRover, rover.max_date);
        return (`
        <section class="photos-loading"></section>
        `);
    } else {
        const latestPhotos = roverPhotos.slice(0,4);
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
        .then(({ photo_manifest })=> {
            const rover = photo_manifest;
            updateStore(store, Immutable.Map({rover}));
            }
        )
};

const getRoverPhotos = (rover_name, max_date) => {
    fetch(`http://localhost:3000/rover_photos/${rover_name}/${max_date}`)
        .then(res => res.json())
        .then(( {photos} ) => {
            const roverPhotos = photos;
            updateStore(store, Immutable.Map({roverPhotos}));
        })
};


