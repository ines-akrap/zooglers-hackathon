const textfield = document.querySelector('.paragraph-input');
const button = document.querySelector('.button');
const wrapper = document.querySelector('.wrapper');

const submitParagraph = (e) => {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/submit', true);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                renderResponse(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.send(`input=${textfield.value}`);
    } catch (e) {
        console.log(e);
    }
}

const renderResponse = (data) => {
    const desc = document.createElement("p");
    desc.innerHTML = data.about;
    wrapper.appendChild(desc);
    const image = document.createElement("IMG");
    image.src = `/static/images/${data.imageEndpoint}`;
    image.classList.add('image');
    wrapper.appendChild(image);
}

const init = () => {
    console.log("Init JS");
    button.addEventListener('click', submitParagraph);

}

init();