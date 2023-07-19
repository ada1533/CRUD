let imgInp = document.querySelector('#product-url-inp');
let titleInp = document.querySelector('#product-title-inp');
let secondInp = document.querySelector('#product-second-inp');
let priceInp = document.querySelector('#product-price-inp');
let addProductBtn = document.querySelector('.add-product-btn');
let saveProductBtn = document.querySelector('.save-product-btn');
let btnClose = document.querySelector('.btn-close');
let container = document.querySelector('.container');
let searchInp = document.querySelector('#search-inp')

function initStorage() {
    if(!localStorage.getItem('products-data')) {
        localStorage.setItem('products-data', '[]');
    };
};
initStorage();

function setProductsToStorage(products) {
    localStorage.setItem('products-data', JSON.stringify(products));
};

function getProductsFromStorage() {
    let products = JSON.parse(localStorage.getItem('products-data'));
    return products;
};

// create
function createProduct() {
    if(saveProductBtn.id) return;

    if(
        !imgInp.value.trim() ||
        !titleInp.value.trim() ||
        !secondInp.value.trim() ||
        !priceInp.value.trim()
    ) return alert('some inp are empty')

    let productObj = {
        id: Date.now(),
        url: imgInp.value,
        title: titleInp.value,
        second: secondInp.value,
        price: priceInp.value
    };

    let products = getProductsFromStorage();
    products.push(productObj);
    setProductsToStorage(products);

    imgInp.value = '';
    titleInp.value = '';
    secondInp.value = '';
    priceInp.value = '';

    btnClose.click();

    render();
};

// read
function render(data = getProductsFromStorage()) {
    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += `
            <div class="card w-25 m-2" style="width: 18rem;" id="${item.id}">
                <img src="${item.url}" class="card-img-top" alt="error:(" height="250">
                <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <h5 class="card-second">${item.second}</h5>
                <p class="card-text">${item.price}</p>
                <a href="#" class="btn btn-danger delete-product-btn">Delete</a>
                <a href="#" class="btn btn-secondary update-product-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Update</a>
                </div>
            </div>
        `;
    });

    if(data.length === 0) return;
    addDeleteEvent();
    addUpdateEvent()
};
render();

addProductBtn.addEventListener('click', createProduct);

// delete
function deleteProduct(e) {
    let productId = e.target.parentNode.parentNode.id;
    let products = getProductsFromStorage();
    products = products.filter(item => item.id != productId);
    setProductsToStorage(products);
    render();
};

function addDeleteEvent() {
    let delBtns = document.querySelectorAll('.delete-product-btn');
    delBtns.forEach(item => item.addEventListener('click', deleteProduct));
};

// update
function updateProduct(e) {
    let productId = e.target.parentNode.parentNode.id;
    let products = getProductsFromStorage();
    let productObj = products.find(item => item.id == productId);
    imgInp.value = productObj.url;
    titleInp.value = productObj.title;
    secondInp.value = productObj.second;
    priceInp.value = productObj.price;
    saveProductBtn.setAttribute('id', productId);

};

function addUpdateEvent() {
    let updateBtns = document.querySelectorAll('.update-product-btn');
    updateBtns.forEach(item => item.addEventListener('click', updateProduct));
};

function saveChanges(e){
    if(!e.target.id) return;
    let products = getProductsFromStorage();
    let productObj = products.find(item => item.id == e.target.id);
    productObj.url = imgInp.value;
    productObj.title = titleInp.value;
    productObj.second = secondInp.value;
    productObj.price = priceInp.value;
    setProductsToStorage(products);
    saveProductBtn.removeAttribute('id');
    imgInp.value = '';
    titleInp.value = '';
    secondInp.value = '';
    priceInp.value = '';
    btnClose.click();
    render();
};

saveProductBtn.addEventListener('click', saveChanges);


// search

searchInp.addEventListener('input', e => {
    let products = getProductsFromStorage();
    products = products.filter(item => {
        return item.title.toLowerCase().indexOf(e.target.value.toLowerCase())!== -1;
    })
    render(products)
})


btnClose.addEventListener('click', () => {
  cleanFormInputs();
  if (saveProductBtn.id){
    saveProductBtn.removeAttribute('id');
  };
});
