// ==== Adding an event listener to the amount of product input ====
for (let input of document.querySelectorAll('input[data-id]')) {
    input.addEventListener('keypress', amountInput);
    input.addEventListener('input', (event) => {saveAmountChange(event.target.value.replace(/[^0-9]/g, ''), event.target.getAttribute('data-id'))});
}

// ==== Adding an event listener for the delete product button ====
for (let button of document.querySelectorAll('button[data-type="delete"]')) {
    button.addEventListener('click', (event) => {deleteProduct(event.target.getAttribute('data-id'))});
}

// ==== Adding an event listener for the reduce amount of product button ====
for (let button of document.querySelectorAll('button[data-type="reduce"]')) {
    button.addEventListener('click', (event) => {reduceAmount(event.target.getAttribute('data-id'))});
}

// ==== Adding an event listener for the increase amount of product button ====
for (let button of document.querySelectorAll('button[data-type="increase"]')) {
    button.addEventListener('click', (event) => {increaseAmount(event.target.getAttribute('data-id'))});
}

// ==== Input only numbers ====
function amountInput(event) {
    var theEvent = event;
    var key = theEvent.keyCode;
    key = String.fromCharCode(key);
    var regex = /[0-9]/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

// ==== Save product amount change ====
function saveAmountChange(amount, product_id) {
    var price = document.querySelector('[data-type="price"][data-id="'+product_id+'"]');
    price.innerHTML = parseInt(price.getAttribute('data-price')) * amount + ' UAH';
    var total = 0;
    document.querySelectorAll('[data-type="price"]').forEach((currentValue, currentIndex) => {
        total += parseFloat(currentValue.innerHTML);
    });
    document.querySelector('[data-type="total"]').innerHTML = 'Загалом ' + total + ' UAH'
    var cart = getCart();
    if (!cart[product_id]) cart[product_id] = 1;
    else cart[product_id] = amount;
    setCart(cart);
}

// ==== Delete product ====
function deleteProduct(product_id) {
    document.querySelector('div[data-id="'+product_id+'"]').remove();
    var cart = getCart();
    delete cart[product_id];
    setCart(cart);
    var total = 0;
    document.querySelectorAll('[data-type="price"]').forEach((currentValue, currentIndex) => {
        total += parseFloat(currentValue.innerHTML);
    });
    document.querySelector('[data-type="total"]').innerHTML = 'Загалом ' + total + ' UAH'
    if (Object.keys(cart).length == 0) location.reload();
}

// ==== Reduce the amount of product ====
function reduceAmount(product_id) {
    var input = document.querySelector('input[data-id="'+product_id+'"]');
    var amount = parseInt(input.value);
    if (amount > 1) {
        input.value = --amount;
    }
    saveAmountChange(input.value, product_id);
}

// ==== Increase the amount of product ====
function increaseAmount(product_id) {
    var input = document.querySelector('input[data-id="'+product_id+'"]');
    var amount = parseInt(input.value);
    input.value = ++amount;
    saveAmountChange(input.value, product_id);
}