import { queryPhotos } from './api.js';

/**
 * Generate node for rendering input form for searching
 * @returns {Node} Div element contains form
 */
const getHtmlInputForm = () => {
    let form = document.createElement("div");
    form.className = "searchboard";
    form.innerHTML = `
        <form id="form">
            <fieldset>
                <legend>Search Photo:</legend>
                <div id="inputdiv">
                    <label for="camera">Camera:</label>
                    <select id="camera" name="camera">
                        <option value=""></option>
                        <option value="FHAZ">FHAZ</option>
                        <option value="RHAZ">RHAZ</option>
                        <option value="MAST">MAST</option>
                        <option value="CHEMCAM">CHEMCAM</option>
                        <option value="MAHLI">MAHLI</option>
                        <option value="MARDI">MARDI</option>
                        <option value="NAVCAM">NAVCAM</option>
                        <option value="PANCAM">PANCAM</option>
                        <option value="MINITES">MINITES</option>
                    </select><br>
                </div>
                <div class="inputdiv">
                    <label for="sol">Sol:</label>
                    <input type="text" id="sol" name="sol"><br>
                </div>
                <div class="inputdiv">
                    <label for="earthDate">Earth Date:</label>
                    <input type="date" id="earthDate" name="earthDate"><br>
                </div>
                <div id="btn">Submit</div>
            </fieldset>
        </form>
    `;
    return form;
};

/**
 * Generate node for rendering search results div
 * @returns {Node} Div element for showing photos as search result
 */
const getHtmlPhotos = () => {
    let photos = document.createElement("div");
    photos.innerHTML = `
        <p class="subtitle">Search Results:</p>
        <div class="photos"></div>
    `;
    return photos;
};

/**
 * Remove searched photo elements  
 */
const resetPhotos = () => {
    let grid = document.querySelector(".photos");
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
};

/**
 * submit event handler for input form
 */
const submitForm = async () => {
    resetPhotos();
    let inputData = {};
    const formData = document.getElementById("form").elements;
    if (formData.earthDate.value) {
        Object.assign(inputData, {
            earthDate: formData.earthDate.value
        });
    }
    if (formData.sol.value) {
        Object.assign(inputData, {
            sol: formData.sol.value
        });
    }
    if (formData.camera.value) {
        Object.assign(inputData, {
            camera: formData.camera.value
        });
    }
    const photos = await queryPhotos(inputData);
    let grid = document.querySelector(".photos");
    photos.forEach(photo => {
        let gridItem = document.createElement("div");
        gridItem.className = "photo-item";
        let roverImg = new Image();
        roverImg.src = photo.get('src');
        let desc = document.createElement("div");
        let sol = document.createElement("p");
        sol.appendChild(document.createTextNode(`Sol: ${photo.get('sol')}`));
        let camera = document.createElement("p");
        camera.appendChild(document.createTextNode(`Camera: ${photo.get('camera')}`));
        let earthDate = document.createElement("p");
        earthDate.appendChild(document.createTextNode(`Earth Date: ${photo.get('earthDate')}`));
        desc.appendChild(sol);
        desc.appendChild(camera);
        desc.appendChild(earthDate);
        gridItem.appendChild(roverImg);
        gridItem.append(desc);
        grid.appendChild(gridItem);
    });
};

export { getHtmlInputForm, getHtmlPhotos, submitForm };