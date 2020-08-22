import { fromJS, List } from 'immutable';
import curiosityImg from './assets/img/Curiosity.jpg';
import opportunityImg from './assets/img/Opportunity.jpg';
import spiritImg from './assets/img/Spirit.jpg';
import { getImageOfTheDay, getRoverInfo } from './api.js';
import { getHtmlInputForm, getHtmlPhotos, submitForm } from './form.js';

// rover meta data
const roverStore = fromJS({
    user: { name: "Guest" },
    rovers: [
        {
            name: 'Curiosity',
            image: curiosityImg,
            description: 'Curiosity is a car-sized rover designed to explore Gale Crater on Mars as part of NASA\'s Mars Science Laboratory mission.'
        },
        {
            name: 'Opportunity',
            image: opportunityImg,
            description: 'Opportunity, also known as MER-B or MER-1, and nicknamed "Oppy", is a robotic rover that was active on Mars from 2004 until the middle of 2018'
        },
        {
            name: 'Spirit',
            image: spiritImg,
            description: 'Spirit, also known as MER-A or MER-2, is a robotic rover on Mars, active from 2004 to 2010. It was one of two rovers of NASA\'s Mars Exploration Rover Mission'
        }
    ]
});

// Root node of html
const root = document.getElementById('root');

/**
 * Construct API response object
 * @param {Boolean} returnCode status of API response 
 * @param {Object} returnValue return data
 */
const returnState = function (returnCode, returnValue) {
    this.code = returnCode;
    this.value = returnValue; 
};

/**
 * Update html based on API response status
 * @param {Node} root root node of html 
 * @param {Object} state API response object 
 */
const render = async (root, state) => {
    if (state.code) {
        const appHTML = await App(state.value);
        Object.assign(root, {
            innerHTML: appHTML
        });
    } else {
        Object.assign(root, {
            innerHTML: errCallback(state.value)
        });
    }
};

/**
 * Generate error page
 * @param {Object} state contains error message
 * @returns {String} raw HTML
 */
const errCallback = state => {
    return `
        <header class="error">
            ${state.message}
        </header>
        <footer></footer>
    `;
};

/**
 * Generate raw HTML for the main page
 * @param {Map} state API response data
 * @returns {String} raw HTML
 */
const App = async state => {
    // raw HTML for rendering three rover tabs
    const roversTabContent = await roversTab(roverStore);

    return `
        <div class="header">
            <header>${Greeting(roverStore.get('user').get('name'))}</header>
        </div>
        <div class="layout">
            <div class="layouts">
                <div>
                    <button id="layoutButton-default" class="layoutButton">Apod</button>
                    <button class="layoutButton">Rovers</button>
                </div>
                <div class="layoutButton-content" id="Apod">
                    ${ImageOfTheDay(state)}
                </div>
                <div class="layoutButton-content" id="Rovers">
                    <h2 class="title">Rovers Dashboard</h2>
                    <p class="subtitle">Instruction</p>
                    <p class="text">Click the tab in below to show corresponding rover information with interactive search</p>
                    ${roversTabContent}
                </div>
            </div>
        <footer>OpenSource contributor</footer>
    `
}

/**
 * Generate Welcome header page
 * @param {String} name 
 * @returns {String} raw HTML
 */
const Greeting = name => {
    if (name) {
        return `
            Welcome, ${name}!
            Today is ${new Date().toString()}
        `;
    }

    return `
        Hello!
        Today is ${new Date().toString()}
    `;
}

/**
 * Generate Astronomy Picture tab content
 * @param {Map} state API response data
 * @returns {String} raw HTML
 */
const ImageOfTheDay = state => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(state.get('image').get('date'));

    // check if the photo of the day is actually type video!
    if (state.get('media_type') === "video") {
        return (`
            <p class="subtitle">See today's featured video</p>
            <iframe src="${state.get('image').get('url')}"></iframe>
            <div class="desc">
                <p class="subtitle">${state.get('image').get('title')}</p>
                <p class="text">${state.get('image').get('explanation')}</p>
            </div>
        `);
    } else {
        return (`
            <div class="apodContent">
                <a target="_blank" href="${state.get('image').get('url')}">
                    <img src="${state.get('image').get('url')}" height="50%" width="auto"/>
                </a>
            </div>
            <div class="apodContent">
                <p class="subtitle">${state.get('image').get('title')}</p>
                <p class="text">${state.get('image').get('explanation')}</p>
            </div>
        `)
    }
}

/**
 * Generate raw HTML for rendering rover page including tab button and corresponding content
 * @param {Map} roverStates all rovers metadata
 * @returns {String} raw HTML 
 */
const roversTab = async roverStates => {
    let tabDiv = document.createElement("div");
    tabDiv.className = "tabs";
    roverStates.get('rovers').forEach(item => {
        let tabButton = document.createElement("button");
        let tabName = document.createTextNode(item.get('name'));
        if (!item.get('name').localeCompare('Curiosity')) {
            tabButton.id = 'tabButton-default';
        }
        tabButton.appendChild(tabName);
        tabButton.className = "tabButton";
        tabDiv.appendChild(tabButton);
    });

    const contents = await Promise.all(roverStates.get('rovers').map(async item => {
        let element = document.createElement("div");
        element.className = "tabButton-content";
        element.id = item.get('name');
        const domElements = await getRoverPageContent(item);
        domElements.forEach(domElement => {
            element.appendChild(domElement);
        });
        return element;
    }));

    return tabDiv.outerHTML.concat(...contents.map(item => {
        return item.outerHTML;
    }));
};

/**
 * Generate a list of Node for rendering given rover tab content
 * @param {Map} rover rover meta data
 * @returns {List} generated list of nodes
 */
const getRoverPageContent = async rover => {
    let result = List();
    const parentDiv = document.createElement("div");
    const roverDesc = document.createElement("p");
    roverDesc.appendChild(document.createTextNode(rover.get('description')));
    const roverImg = new Image();
    roverImg.src = rover.get('image');
    parentDiv.appendChild(roverDesc);
    parentDiv.appendChild(roverImg);
    parentDiv.className = "intro";
    const roverManifest = await getHtmlRoverManifest(rover.get('name'));
    result = result.concat(
        parentDiv, 
        roverManifest,
        getHtmlInputForm(),
        getHtmlPhotos()
    );
    return result;
};

/**
 * Generate node for rendering given rover manifest data
 * @param {String} roverName
 * @returns {Node} div node for rendering manifest 
 */
const getHtmlRoverManifest = async roverName => {
    const roverData = await getRoverInfo(roverName);
    let descDiv = document.createElement("div");
    descDiv.className = "manifest";
    roverData.forEach((value, key, map) => {
        let textnode = document.createElement("p");
        textnode.appendChild(document.createTextNode(`${key} : ${value}`));
        descDiv.appendChild(textnode);
    })
    return descDiv;
}

/**
 * Add event listener for tab button click
 * @param {String} className tab buttons class name
 */
const updateButtonClick = (className) => {
    Array.prototype.forEach.call(document.getElementsByClassName(className), element => {
        element.addEventListener('click', () => {
            switchTab(element);
        });
    });
    document.getElementById(`${className}-default`).click();
};

/**
 * Switch tab content when click tab button
 * @param {Object} currentTarget event trigger
 */
const switchTab = currentTarget => {
    const buttonClassName = currentTarget.className.split(' ')[0];
    const contentClassName = `${buttonClassName}-content`;
    let tabcontents = document.getElementsByClassName(contentClassName);
    let tabs = document.getElementsByClassName(buttonClassName);
    tabcontents = Array.prototype.map.call(tabcontents, element => {
        element.style.display = "none";
        return element;
    });
    tabs = Array.prototype.map.call(tabs, element => {
        element.className = element.className.replace(" active", "");
        return element;
    });
    document.getElementById(currentTarget.textContent).style.display = "block";
    currentTarget.className = currentTarget.className.concat(" active");
};

/**
 * Add event listener for form submit button
 */
const updateSubmit = () => {
    document.getElementById("btn").addEventListener('click', submitForm);
};

/** 
 * listening for load event because page should load before any JS is called
 */
window.addEventListener('load', async () => {
    try {
        const dailyState = await getImageOfTheDay();
        const result = new returnState(true, dailyState);
        await render(root, result);
        updateButtonClick('layoutButton');
        updateButtonClick('tabButton');
        updateSubmit();
    } catch (err) {
        const result = new returnState(false, err);
        render(root, result);
    }
});
