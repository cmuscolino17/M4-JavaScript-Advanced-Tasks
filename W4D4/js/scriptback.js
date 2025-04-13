const API = "https://striveschool-api.herokuapp.com/api/product/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VjMjcyYzNkZjMwMzAwMTUxNWE2ZDYiLCJpYXQiOjE3NDM1Mjk3NzIsImV4cCI6MTc0NDczOTM3Mn0.0UisVMAPleqHHW__P0udqCtFbkipa7cqXWS5MbNFcVg"
const nameInput = document.getElementById('name-product')
const descriptionInput = document.getElementById('description-product')
const brandInput = document.getElementById('brad-product')
const imgInput = document.getElementById('img-product')
const priceInput = document.getElementById('price-product')
const addBtn = document.getElementById('add-btn')
const tbody = document.getElementById("table-body")
const editModal = document.getElementById('edit-modal')
const editForm = document.getElementById('edit-form')
const spinner = document.getElementById("spinner")

const showSpinner = () => spinner.classList.remove("d-none")
const hideSpinner = () => spinner.classList.add("d-none")


const createProduct = async (product) => {
    try {
        showSpinner()
        const responce = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })

        return await responce.json()
    } catch (error) {
        throw new Error("An error occurred while creating the product. Please try again later.")
    } finally {
        hideSpinner()
    }
}

addBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    const payload = {
        name: nameInput.value,
        description: descriptionInput.value,
        brand: brandInput.value,
        imageUrl: imgInput.value,
        price: Number(priceInput.value)
    }

    await createProduct(payload)
        .then(res => {
            console.log(res)
            generateTableRow(res)
            nameInput.value = ''
            descriptionInput.value = ''
            brandInput.value = ''
            imgInput.value = ''
            priceInput.value = ''
        })
})

const generateTableRow = (product) => {
    const tr = document.createElement('tr')
    const tdName = document.createElement('td')
    tdName.setAttribute('class', 'td-name')
    const tdDescripton = document.createElement('td')
    tdDescripton.setAttribute('class', 'td-description')
    const tdBrand = document.createElement('td')
    tdBrand.setAttribute('class', 'td-brand')
    const tdImgUrl = document.createElement('td')
    tdImgUrl.setAttribute('class', 'td-img')
    const tdPrice = document.createElement('td')
    tdPrice.setAttribute('class', 'td-price')
    const tdEdit = document.createElement('td')
    const tdDelete = document.createElement('td')


    tdName.innerText = product.name
    tdDescripton.innerText = `${product.description.slice(0, 5)}...`
    tdBrand.innerText = product.brand
    tdImgUrl.innerText = `${product.imageUrl.slice(0, 5)}...`
    tdPrice.innerText = `${product.price}$`
    const editBtn = document.createElement('button')
    editBtn.setAttribute('class', 'btn btn-outline-primary')
    editBtn.setAttribute('data-product-id', product._id)
    editBtn.setAttribute('type', 'button')
    editBtn.setAttribute('data-bs-toggle', 'modal')
    editBtn.setAttribute('data-bs-target', '#edit-modal')
    editBtn.innerText = 'Edit'
    tdEdit.appendChild(editBtn)
    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('class', 'btn btn-outline-danger')
    deleteBtn.innerText = 'Delete'
    deleteBtn.addEventListener('click', async () => {
        const isConfirmed = confirm("Are you sure you want to delete this product?");
        if (isConfirmed) {
            const result = await deleteProdcut(product._id);
            if (result) {
                tr.remove();
            }
        }
    })
    tdDelete.appendChild(deleteBtn)
    tr.append(tdName, tdDescripton, tdBrand, tdImgUrl, tdPrice, tdEdit, tdDelete)
    tbody.appendChild(tr)
}

const getAllProduct = async () => {
    try {
        showSpinner()
        const response = await fetch(API, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error) {
        throw new Error("An error occurred while fetching products. Please try again later.")
    } finally {
        hideSpinner()
    }
}

getAllProduct()
    .then(res => res.forEach(product => {
        generateTableRow(product)
    }))

const deleteProdcut = async (productid) => {
    try {
        showSpinner()
        const response = await fetch(`${API}${productid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return await response.json()

    } catch (error) {
        throw new Error("An error occurred while deleting the product. Please try again later.")
    } finally {
        hideSpinner()
    }
}

const singleProduct = async (productid) => {
    try {
        const response = await fetch(`${API}/${productid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error) {
        throw new Error("An error occurred while fetching product details. Please try again later.")
    }
}

editModal.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget
    const productid = button.getAttribute('data-product-id')
    const prodcutData = await singleProduct(productid)
    if (prodcutData) {
        const inputs = editForm.querySelectorAll('input')
        inputs.forEach(input => {
            const inputName = input.name
            input.value = prodcutData[inputName]
        })
    }
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault()
        const inputs = editForm.querySelectorAll('input')
        const payload = {}
        inputs.forEach(input => {
            const inputName = input.name
            payload[input.name] = input.value
        })

        const updatedProduct = await editProduct(productid, payload)

        const modalInstance = bootstrap.Modal.getInstance(editModal)
        modalInstance.hide()

        updateTableRow(updatedProduct)
    })
})

const editProduct = async (productid, product) => {
    try {
        showSpinner()
        const responce = await fetch(`${API}/${productid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        })

        return await responce.json()
    } catch (error) {
        throw new Error("An error occurred while updating the product. Please try again later.")
    } finally {
        hideSpinner()
    }
}

const updateTableRow = (updatedProduct) => {
    const rows = tbody.querySelectorAll('tr')
    rows.forEach(row => {
        const editBtn = row.querySelector('button.btn-outline-primary')
        if (editBtn && editBtn.getAttribute('data-product-id') === updatedProduct._id) {
            row.querySelector('.td-name').innerText = updatedProduct.name
            row.querySelector('.td-description').innerText = updatedProduct.description
            row.querySelector('.td-brand').innerText = updatedProduct.brand
            row.querySelector('.td-img').innerText = updatedProduct.imageUrl.slice(0, 5)
            row.querySelector('.td-price').innerText = updatedProduct.price
        }
    })
}




