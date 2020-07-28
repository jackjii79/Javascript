let originDino = {
    "Dinos": [
        {
            "species": "Triceratops",
            "weight": 13000,
            "height": 114,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "First discovered in 1889 by Othniel Charles Marsh"
        },
        {
            "species": "Tyrannosaurus Rex",
            "weight": 11905,
            "height": 144,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "The largest known skull measures in at 5 feet long."
        },
        {
            "species": "Anklyosaurus",
            "weight": 10500,
            "height": 55,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Anklyosaurus survived for approximately 135 million years."
        },
        {
            "species": "Brachiosaurus",
            "weight": 70000,
            "height": "372",
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Jurasic",
            "fact": "An asteroid was named 9954 Brachiosaurus in 1991."
        },
        {
            "species": "Stegosaurus",
            "weight": 11600,
            "height": 79,
            "diet": "herbavor",
            "where": "North America, Europe, Asia",
            "when": "Late Jurasic to Early Cretaceous",
            "fact": "The Stegosaurus had between 17 and 22 seperate places and flat spines."
        },
        {
            "species": "Elasmosaurus",
            "weight": 16000,
            "height": 59,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Elasmosaurus was a marine reptile first discovered in Kansas."
        },
        {
            "species": "Pteranodon",
            "weight": 44,
            "height": 20,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Actually a flying reptile, the Pteranodon is not a dinosaur."
        },
        {
            "species": "Pigeon",
            "weight": 0.5,
            "height": 9,
            "diet": "herbavor",
            "where": "World Wide",
            "when": "Holocene",
            "fact": "All birds are living dinosaurs."
        }
    ]
};
// holding array of eight dinor objects except human
let dinors = new Array();

// form object
let inputForm = null;


/**
 * Image file path
 * @param {String} species file prefix
 * @returns {String} full image path 
 */
function loadImg (species) {
    return `images/${ species.toLowerCase() }.png`;
}

/**
 * Create Dino object
 * @param {Object} dinoObj Dino statistics data
 * @returns {Object} Dino object
 */
function Dino (dinoObj) {
    let properties = dinoObj;
    let imgSrc = loadImg(properties.species);

    /**
     * Compare with human in weight 
     * @param {Object} humanObj human statistics data
     * @returns {String} compare result 
     */
    function _compareWeight(humanObj) {
        if (humanObj.getWeight() === properties.weight) {
            return `${ properties.species } has the same weight as ${ humanObj.getName() }, ${ properties.weight }lbs`;
        } else if (humanObj.getWeight() < properties.weight) {
            return `${ properties.species } has more weight ${ properties.weight }lbs than ${ humanObj.getName() } ${ humanObj.getWeight() }lbs`;
        } else {
            return `${ properties.species } has less weight ${ properties.weight }lbs than ${ humanObj.getName() } ${ humanObj.getWeight() }lbs`;
        }
    };

    /**
     * Compare with human in height
     * @param {Object} humanObj human statistics data
     * @returns {String} compare result 
     */
    function _compareHeight(humanObj) {
        if (humanObj.getHeight() === properties.height) {
            return `${ properties.species } has the same height as ${ humanObj.getName() }, ${ properties.height }inches`;
        } else if (humanObj.getHeight() < properties.height) {
            return `${ properties.species } has more height ${ properties.height }inches than ${ humanObj.getName() } ${ humanObj.getHeight() }inches`;
        } else {
            return `${ properties.species } has less height ${ properties.height }inches than ${ humanObj.getName() } ${ humanObj.getHeight() }inches`;
        }
    };

    /**
     * Compare with human in diet
     * @param {Object} humanObj human statistics data
     * @returns {String} compare result 
     */
    function _compareDiet(humanObj) {
        if (!humanObj.getDiet().localeCompare(properties.diet)) {
            return `${ properties.species } has the same diet as ${ humanObj.getName() }, ${ properties.diet }`;
        } else {
            return `${ properties.species } diet is ${ properties.diet }, ${ humanObj.getName() } diet is ${ humanObj.getDiet() }`;
        }
    };

    function _getSpecies() {
        return properties.species;
    };

    function _getWhere(humanObj) {
        return `Where: ${properties.where}`;
    };

    function _getWhen(humanObj) {
        return `When: ${properties.when}`;
    };

    function _getFact(humanObj) {
        return `Fact: ${properties.fact}`;
    };

    function _getImg() {
        return imgSrc;
    };

    function _getWeight(humanObj) {
        return `Weight: ${properties.weight}lbs`;
    };

    function _getHeight(humanObj) {
        return `Height: ${properties.height}inches`;
    };

    function _getDiet(humanObj) {
        return `Diet: ${properties.diet}`;
    };

    // using array function to encapsulate private function
    let functions = [
        (humanObj) => _compareWeight(humanObj), 
        (humanObj) => _compareHeight(humanObj),
        (humanObj) => _compareDiet(humanObj), 
        (humanObj = null) => _getWeight(humanObj), 
        (humanObj = null) => _getHeight(humanObj), 
        (humanObj = null) => _getDiet(humanObj), 
        (humanObj = null) => _getWhere(humanObj), 
        (humanObj = null) => _getWhen(humanObj),
        (humanObj = null) => _getFact(humanObj)
    ];

    /**
     * Randomly choose one from compare methods and six types methods
     * @param {Number} index specify index of choice, if -1 then choose randomly
     * @returns {Object} chosen result 
     */
    function _pickOne(index = -1) {
        if (index == -1) {
            index = Math.floor(Math.random() * 9);
        }
        return {
            idx: index,
            fn: functions[index]
        };
    };

    /**
     * Get array of functions for showing statistics data
     * @returns {Array} array of statistics functions 
     */
    function _getFunctions() {
        return functions.slice(3);
    };

    return {
        getImg: _getImg,
        getSpecies: _getSpecies,
        getFact: _pickOne,
        getStatistics: _getFunctions
    };
}

/**
 * Create human object
 * @param {Object} humanObj human statistics data
 * @returns {Object} human object 
 */
function Human (humanObj) {
    let properties = humanObj;
    let imgSrc = loadImg("human");

    function _getSpecies() {
        return "human";
    };

    function _getImg() {
        return imgSrc;
    };

    function _getName() {
        return properties.name.value;
    };

    function _getWeight() {
        return parseFloat(properties.weight.value);
    };

    function _getHeight() {
        return parseFloat(properties.feet.value) * 12.0 + parseFloat(properties.inches.value);
    };

    function _getDiet() {
        return properties.diet.value;
    };

    let statistics = [
        () => `Weight: ${_getWeight()}`,
        () => `Height: ${_getHeight()}`,
        () => `Diet: ${_getDiet()}`
    ];

    function _getStatistics() {
        return statistics;
    }

    return {
        getSpecies: _getSpecies,
        getImg: _getImg,
        getName: _getName,
        getWeight: _getWeight,
        getHeight: _getHeight,
        getDiet: _getDiet,
        getStatistics: _getStatistics
    };
}

/**
 * Load data from dino data
 * @returns {Object} Object with invidual dino object from json
 */
function loadDinos() {
    let dinorObjs = new Array();
    for (const [index, value] of originDino.Dinos.entries()) {
        dinorObjs[index] = Dino(value);
    }
    return dinorObjs;
}

/**
 * Load form input
 * @param {Object} formData user inputs
 * @returns {Object} Human object
 */
function loadHuman() {
    let formData = document.getElementById("dino-compare").elements;
    return Human(formData);
}

/**
 * Remove form from body
 */
function removeForm() {
    inputForm = document.querySelector("form");
    let body = document.querySelector("body");
    body.removeChild(inputForm);
}

/**
 * Create tile for human object
 * @param {Object} humanObj input human object
 * @returns {Object} div object for human tile 
 */
function createHumanTile(humanObj) {
    let cell = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", humanObj.getImg());
    let subcell = document.createElement("div");
    let title = document.createElement("h3");
    title.append(document.createTextNode(humanObj.getName()));
    subcell.append(title);
    cell.append(img);
    cell.append(subcell);
    cell.setAttribute("class", "grid-item");
    return cell;
}

/**
 * Create tile for dino object
 * @param {Object} dinoObj input dino object
 * @param {Object} humanObj input human object for comparison
 * @returns {Object} div object for dino tile 
 */
function createDinoTile(dinoObj, humanObj) {
    let cell = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", dinoObj.getImg());
    let subcell = document.createElement("div");
    let title = document.createElement("h3");
    title.append(document.createTextNode(dinoObj.getSpecies()));
    let fact = document.createElement("p");
    if (dinoObj.getSpecies() === "Pigeon") {
        fact.append(document.createTextNode(dinoObj.getFact(8).fn(humanObj)));
    } else {
        fact.append(document.createTextNode(dinoObj.getFact().fn(humanObj)));
    }
    subcell.append(title);
    subcell.append(fact);
    cell.append(img);
    cell.append(subcell);
    cell.setAttribute("class", "grid-item");
    return cell;
}

/**
 * Create pop up statistics tile per object
 * @param {Object} inputObj given creature object
 * @returns {Object} div object for statistics tile 
 */
function createStatistics(inputObj) {
    let cell = document.createElement("div");

    let title = document.createElement("h2");
    title.append(document.createTextNode(`${inputObj.getSpecies()} Statistics:`));
    cell.append(title);

    let arrayStatics = new Array();
    for(const [index, func] of inputObj.getStatistics().entries()) {
        arrayStatics[index] = func();
    }

    for(const textValue of arrayStatics) {
        let fact = document.createElement("p");
        fact.append(document.createTextNode(textValue));
        cell.append(fact);
    }
    cell.setAttribute("class", "popbox");
    return cell;
}

/**
 * Append tiles into grid
 * @param {Object} humanObj human object from input from
 */
function insertTiles(humanObj) {
    let localDinors = dinors;
    let grid = document.getElementById("grid");
    for(let idx = 0; idx < 9; idx++) {
        let newTile = null;
        let newStatisticTile = null;
        if (idx === 4) {
            newTile = createHumanTile(humanObj);
            newStatisticTile = createStatistics(humanObj);
        } else {
            let chosenIndex = Math.floor(Math.random() * localDinors.length);
            newTile = createDinoTile(localDinors[chosenIndex], humanObj);
            newStatisticTile = createStatistics(localDinors[chosenIndex]);
            localDinors = localDinors.slice(0, chosenIndex).concat(localDinors.slice(chosenIndex+1));
        }
        newTile.onmouseover = function() {
            newStatisticTile.style.display = "block";
            newStatisticTile.style.left = newTile.offsetLeft.toString().concat("px");
            newStatisticTile.style.top = newTile.offsetTop.toString().concat("px");
        };
        newTile.onmouseout = function() {
            newStatisticTile.style.display = "none";
        };
        grid.append(newTile);
        grid.append(newStatisticTile);
    }
}

/**
 * Validate input form
 * @returns {Boolean} returns true if inputs are valid, otherwise returns false
 */
function validateForm() {
    let inputs = document.getElementById("dino-compare").elements;
    let errorText = "";
    if (!inputs.name.value) {
        errorText = "name can not be empty!";
    } else if (inputs.name.value.search(/^[a-zA-Z_]{1}.*/) === -1) {
        errorText = "name has to start with valid alphabets or underscore";
    } else if (!inputs.feet.value || parseFloat(inputs.feet.value) !== parseFloat(inputs.feet.value)
        || parseFloat(inputs.feet.value) <= 0 || !inputs.inches.value 
        || parseFloat(inputs.inches.value) !== parseFloat(inputs.inches.value) 
        || parseFloat(inputs.inches.value) <= 0 || !inputs.weight.value 
        || parseFloat(inputs.weight.value) !== parseFloat(inputs.weight.value) 
        || parseFloat(inputs.weight.value) <= 0) {
        errorText = "feet, inches, weight must be a valid number";
    }
    if (errorText) {
        alert(errorText);
        return false;
    }
    return true;
}

/**
 * callback function triggered by click button event
 */
function submitForm() {
    if (validateForm()) {
        let humanObj = loadHuman();
        removeForm();
        insertTiles(humanObj);
    }
}

/**
 * entry main function
 */
function main() {
    dinors = loadDinos();
    let button = document.getElementById("btn");
    button.addEventListener("click", submitForm, false);
}

main()
