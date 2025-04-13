const API = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VjMjcyYzNkZjMwMzAwMTUxNWE2ZDYiLCJpYXQiOjE3NDM1Mjk3NzIsImV4cCI6MTc0NDczOTM3Mn0.0UisVMAPleqHHW__P0udqCtFbkipa7cqXWS5MbNFcVg"
const productDetail = document.getElementById('productDetail');
const spinner = document.getElementById('spinner');

const showSpinner = () => spinner.classList.remove('d-none');
const hideSpinner = () => spinner.classList.add('d-none');

const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

const fetchProduct = async (id) => {
    const response = await fetch(`${API}${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return await response.json();
};

const renderProduct = (product) => {
    const card = document.createElement('div');
    card.setAttribute('class', 'd-flex align-items-center');
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.setAttribute('class', 'card-img-top img-fluid mb-3 w-50');
    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body text-start');
    const title = document.createElement('h2');
    title.setAttribute('class', 'card-title mb-4 px-3 fw-bold');
    title.innerText = product.name;
    const description = document.createElement('p');
    description.setAttribute('class', 'card-text mb-4 px-3');
    description.innerText = product.description;
    const brand = document.createElement('p');
    brand.setAttribute('class', 'text-muted px-3');
    brand.innerHTML = `<strong>Brand:</strong> ${product.brand}`;
    const price = document.createElement('h4');
    price.setAttribute('class', 'text-success px-3');
    price.innerText = `${product.price}$`;


    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(brand);
    cardBody.appendChild(price);
    card.appendChild(img);
    card.appendChild(cardBody);

    productDetail.appendChild(card);
};

const loadProduct = async () => {
    try {
        showSpinner();

        const id = getProductIdFromUrl();
        if (!id) {
            throw new Error("Product ID missing from URL");
        }

        const product = await fetchProduct(id);
        renderProduct(product);

    } catch (error) {
        throw new Error('An unexpected error occurred while loading the product.'); 
    } finally {
        hideSpinner();
    }
};

loadProduct();