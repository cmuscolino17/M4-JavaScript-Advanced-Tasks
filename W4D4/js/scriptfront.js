const API = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VjMjcyYzNkZjMwMzAwMTUxNWE2ZDYiLCJpYXQiOjE3NDM1Mjk3NzIsImV4cCI6MTc0NDczOTM3Mn0.0UisVMAPleqHHW__P0udqCtFbkipa7cqXWS5MbNFcVg"
const productsContainer = document.getElementById('products')
const spinner = document.getElementById('spinner')

const showSpinner = () => spinner.classList.remove('d-none')
const hideSpinner = () => spinner.classList.add('d-none')

const generateCard = (product) => {
    const productContainer = document.createElement('div')
    productContainer.setAttribute('class', 'card col-12 col-md-4 col-lg-3 p-4 custom-container')
    const cardImg = document.createElement('img')
    cardImg.src = product.imageUrl
    cardImg.setAttribute('class', 'card-img-top')
    const cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body')
    const title = document.createElement('h5')
    title.setAttribute('class', 'title-custom fw-bold')
    title.innerText = product.name
    const description = document.createElement('p')
    description.setAttribute('class', 'card-text')
    description.innerText = `${product.description.slice(0, 50)}...`
    const price = document.createElement('h3')
    price.setAttribute('class', 'text-success');
    price.innerText = `${product.price}$`

    cardBody.append(title, description, price)
    productContainer.appendChild(cardImg)
    productContainer.appendChild(cardBody)
    productsContainer.appendChild (productContainer)

    productContainer.addEventListener('click', () => {
        window.location.href = `product.html?id=${product._id}`;
    });
}

const getAllProducts = async () => {
    try {
        showSpinner()
        const responce = await fetch(API, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await responce.json()
        return data
    } catch (error) {
        throw new Error("An error occurred while fetching products. Please try again later.")
    } finally {
        hideSpinner()
    }
}

getAllProducts()
    .then (products => {
        products.map (product => generateCard(product)) 
    })
    