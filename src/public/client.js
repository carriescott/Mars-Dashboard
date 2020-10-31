// import {set} from "immutable";

let store = {
    user: { name: "Student" },
    apod: '',
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
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

function selectRover(rover_name) {
    console.log(rover_name);
    updateStore(store, { selectedRover: rover_name});
    // getRoverPhotos(store.rover.name, store.rover.max_date);
}

function Test(name) {
    console.log(name);
    updateStore(store, { selectedRover: name});
    // const selected = document.getElementById(name);
    // selected.classList.add('selected');
}


const Tab = (name, selectedRover) => {
    return (`
        <button id="${name}" onclick="Test(id)" class=${name === selectedRover ? 'selected' : ''}>
        ${name}
        </button>
        `)
};

const RoverTabs = (rovers, selectedRover) => {
    console.log('RoverTabs was called');
    return (`
     ${rovers.map((name) => {
        return (`
       ${Tab(name, selectedRover)}
        `)
    }).join("")}
    `)
};

// create content
const App = (state) => {
    let { rovers, selectedRover, roverInfo, rover } = state;
    console.log('app', selectedRover);
        return (`
        <header>
        </header>
        <main>
            ${RoverTabs(rovers, selectedRover)}
            ${RoverData(selectedRover,rovers, roverInfo, rover)}
        </main>
        <footer></footer>
    `)};


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}



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



const RoverData = (selectedRover, rovers, roverInfo, rover) => {
    console.log('Rover Data was called', selectedRover);
    if(rover === '' || rover.name !== selectedRover) {
        getRover(selectedRover);
        console.log('rover', rover);
        return (`
        <section class="loading-container">
        <h2>One second please just Loading some exciting data...</h2>
        </section>
    `);
    } else {
        return(`
        <section class="rover-information-container">
        <h2>${rover.name}</h2>
        <p>${rover.landing_date}</p>
        <p>${rover.launch_date}</p>
        <p>${rover.status}</p>
        <p>${rover.max_sol}</p>
        <p>${rover.max_date}</p>
        </section>
    `);
    }

};


const RoverPhotos = (selectedRover, rover, photos) => {
    console.log('hello');
    if(photos === '') {
        console.log(rover.max_date);
        getRoverPhotos(selectedRover, rover.max_date);
    }
    return(` 
        <p>${photos[0].id}</p>
         <img src="${photos[0].img_src}" height="350px" width="100%" />
        <p>${photos.length}</p>
        <p>${photos[1].id}</p>
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
    console.log(max_date);
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

