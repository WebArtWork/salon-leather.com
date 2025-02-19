// ==== Setting the number input field ====
const token = 'c474fe35e7ae42';
function getIp(callback) {
    fetch('https://ipinfo.io/json?token=' + token, { headers: { 'Accept': 'application/json' }})
    .then((resp) => resp.json())
    .catch(() => {
        return {country: 'us',};
    })
    .then((resp) => callback(resp.country));
}

const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["ua"],
    initialCountry: "auto",
    geoIpLookup: getIp,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

// ==== Form validation ====
function formValidation(form) {
    var res = true;
    function requireField(name, text = '') {
        if (document.getElementById(name+'_error')) {
            if (form[name].value.trim() == '') {
                document.getElementById(name+'_error').textContent = text != '' ? text : "Заповніть поле";
                if (res) res = false;
            } else document.getElementById(name+'_error').textContent = '';
        }
    }
    function fromList(name, text) {
        text ? text += ' ' : text = '';
        if (document.getElementById(name+'_error')) {
            if (form[name+'_name'].value.trim() == '' || form[name+'_ref'].value.trim() == '') {
                document.getElementById(name+'_error').textContent = "Оберіть " + text + "зі списку";
                if (res) res = false;
            } else document.getElementById(name+'_error').textContent = '';
        }
    }
    requireField('second_name', 'Введіть прізвище');
    requireField('first_name', 'Введіть Ім\'я');
    requireField('patronymic', 'Введіть по-батькові');
    if (document.getElementById('phone_error')) {
        if (phoneInput.getNumber() == '') {
            document.getElementById('phone_error').textContent = "Введіть номер телефону";
            if (res) res = false;
        }
        else if (!phoneInput.isValidNumber()) {
            var validationError = ["Невірний номер","Недійсний код країни","Занадто короткий","Надто довгий","Невірний номер","Невірна довжина"];
            document.getElementById('phone_error').textContent = validationError[phoneInput.getValidationError()];
            if (res) res = false;
        } else document.getElementById('phone_error').textContent = '';
    }
    requireField('email', 'Введіть пошту');
    if (document.getElementById('email_error')) {
        if (form.email.value.trim() == '') {
            document.getElementById('email_error').textContent = "Введіть пошту";
            if (res) res = false;
        }
        else {
            var validator = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!validator.test(form.email.value.trim())) {
                document.getElementById('email_error').textContent = "Невірний формат";
                if (res) res = false;
            } else document.getElementById('email_error').textContent = '';
        }
    }
    if (document.getElementById('delivery_type_error')) {
        if (form.delivery_type.value.trim() == '') {
            document.getElementById('delivery_type_error').textContent = "Доставка не обрана";
            if (res) res = false;
        } else document.getElementById('delivery_type_error').textContent = '';
        if (form.delivery_type.value != 'within_city' && form.delivery_type.value != 'warehouse_nova_poshta' && form.delivery_type.value != 'courier_nova_poshta' && form.delivery_type.value.trim() != '') {
            document.getElementById('delivery_type_error').textContent = "Невизначений тип доставки";
            if (res) res = false;
        }
    }
    switch (form.delivery_type.value) {
        case 'within_city':
            fromList('street', 'вулицю');
            requireField('house', 'Введіть номер будинку');
            break;
        case 'warehouse_nova_poshta':
            fromList('settlement', 'місто');
            fromList('warehouse');
            break;
        case 'courier_nova_poshta':
            fromList('settlement', 'місто');
            fromList('street', 'вулицю');
            requireField('house', 'Введіть номер будинку');
            break;
        default:
            if (res) res = false;
    }
    if (document.getElementById('payment_method_error')) {
        if (form.payment_method.value.trim() == '') {
            document.getElementById('payment_method_error').textContent = "Спосіб оплати не обрано";
            if (res) res = false;
        } else document.getElementById('payment_method_error').textContent = '';
        if (form.payment_method.value != 'card_on_site' && form.payment_method.value != 'upon_receipt' && form.payment_method.value.trim() != '') {
            document.getElementById('payment_method_error').textContent = "Невизначений спосіб оплати";
            if (res) res = false;
        }
    }
    return res;
}

// ==== Confirm order ====
function confirmOrder(event) {
    event.preventDefault();
    if (formValidation(event.target)) {
        document.querySelector('button[type="submit"].order__btn').classList.remove('_error');
        var form = {};
        form.second_name = event.target.second_name.value.trim();
        form.first_name = event.target.first_name.value.trim();
        form.patronymic = event.target.patronymic.value.trim();
        form.phone = phoneInput.getNumber();
        form.email = event.target.email.value.trim();
        switch (event.target.delivery_type.value) {
            case 'within_city':
                form.delivery_type = "По місту";
                form.address = {};
                form.address.street = event.target.street_name.value.trim();
                form.address.nova_poshta_street_ref = event.target.street_ref.value.trim();
                form.address.house = event.target.house.value.trim();
                form.address.apartment = event.target.apartment.value.trim();
                break;
            case 'warehouse_nova_poshta':
                form.delivery_type = "Самовивіз Нова пошта";
                form.settlement = {};
                form.settlement.name = event.target.settlement_name.value.trim();
                form.settlement.nova_poshta_ref = event.target.settlement_ref.value.trim();
                form.warehouse = {};
                form.warehouse.name = event.target.warehouse_name.value.trim();
                form.warehouse.nova_poshta_ref = event.target.warehouse_ref.value.trim();
                break;
            case 'courier_nova_poshta':
                form.delivery_type = "Кур'єр Нова пошта";
                form.settlement = {};
                form.settlement.name = event.target.settlement_name.value.trim();
                form.settlement.nova_poshta_ref = event.target.settlement_ref.value.trim();
                form.address = {};
                form.address.street = event.target.street_name.value.trim();
                form.address.nova_poshta_street_ref = event.target.street_ref.value.trim();
                form.address.house = event.target.house.value.trim();
                form.address.apartment = event.target.apartment.value.trim();
                break;
        }
        switch (event.target.payment_method.value) {
            case 'card_on_site':
                form.payment_method = "Карткою на сайті";
                break;
            case 'upon_receipt':
                form.payment_method = "При отриманні";
                break;
        }
        form.note = event.target.note.value;
        form.date_of_reg = new Date().toISOString();
        if (phoneInput.isValidNumber()) {
            fetch('/api/order/confirm', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            .then(response => response.json())
            .then(response => {
                setCart({});
                document.location.href = '/';
            })
        }
    } else {
        document.querySelector('button[type="submit"].order__btn').classList.add('_error');
    }
}

// ==== Nova Poshta delivery api ====
const apiKey = 'f8094fdceb3a0382962fff620bbf97cd';
const url = 'https://api.novaposhta.ua/v2.0/json/';

function novaposhtaRequest(data, cb) {
    data.apiKey = apiKey;
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        if(typeof cb === 'function') cb(response);
    })
};

// ==== Default delivery settlement ====
searchSettlements("Кам'янець-Подільський", res => {
    settlementRef.value = res.data[0].Addresses[0].Ref;
});

// ==== Choice delivery method ====
document.querySelectorAll('input[name="delivery_type"]').forEach(el => {
    el.addEventListener('change', e => {
        switch (e.target.id) {
            case 'within_city':
                document.querySelector('#address').style.display = "block";
                document.querySelector('#settlement').style.display = "none";
                document.querySelector('#warehouse').style.display = "none";
                searchSettlements("Кам'янець-Подільський", res => {
                    settlementRef.value = res.data[0].Addresses[0].Ref;
                });
                break;
            case 'warehouse_nova_poshta':
                document.querySelector('#settlement').style.display = "block";
                document.querySelector('#warehouse').style.display = "block";
                document.querySelector('#address').style.display = "none";
                break;
            case 'courier_nova_poshta':
                document.querySelector('#settlement').style.display = "block";
                document.querySelector('#address').style.display = "block";
                document.querySelector('#warehouse').style.display = "none";
                break;
        }
    });
}, 'myThisArg');

// ==== Settlement ====
const settlementsList = document.getElementById('settlements_list');
const settlementRef = document.getElementById('settlement_ref');
const settlementInput = document.getElementById('settlement_name');
settlementInput.addEventListener('input', outputSettlements);

// ==== Street ====
const streetsList = document.getElementById('streets_list');
const streetRef = document.getElementById('street_ref');
const streetInput = document.getElementById('street_name');
streetInput.addEventListener('input', outputStreets);

// ==== Warehouse ====
const warehousesList = document.getElementById('warehouses_list');
const warehouseRef = document.getElementById('warehouse_ref');
const warehouseInput = document.getElementById('warehouse_name');
warehouseInput.addEventListener('input', outputWarehouses);
warehouseInput.addEventListener('focus', outputWarehouses);

// ==== Search settlements ====
function searchSettlements(settlement_name, cb) {
    let data = {
        "modelName": "Address",
        "calledMethod": "searchSettlements",
        "methodProperties": {
            "CityName" : settlement_name,
            "Limit" : "20",
            "Page" : "1"
        }
    };
    novaposhtaRequest(data, cb);
}

// ==== Search settlement streets ====
function searchStreets(street_name, settlement_ref, cb) {
    let data = {
        "modelName": "Address",
        "calledMethod": "searchSettlementStreets",
        "methodProperties": {
            "StreetName" : street_name,
            "SettlementRef" : settlement_ref,
            "Limit" : "20"
        }
    };
    novaposhtaRequest(data, cb);
}

// ==== Get warehouses ====
function getWarehouses(warehouse_name, settlement_ref, cb) {
    let data = {
        "modelName": "Address",
        "calledMethod": "getWarehouses",
        "methodProperties": {
            "FindByString": warehouse_name,
            "SettlementRef" : settlement_ref,
            "Language" : "UA",
        }
    };
    novaposhtaRequest(data, cb);
}

// ==== Output settlements ====
function outputSettlements(event) {
    var settlement_name = event.target.value.trim();
    if (settlement_name == '') settlementsList.textContent = '';
    if (settlement_name != '') {
        searchSettlements(settlement_name, (res) => {
            settlementsList.textContent = '';
            if (res.data[0]) {
                settlementsList.style.display = 'block';
                res.data[0].Addresses.forEach(settlement => {
                    let div_settlement = document.createElement('div');
                    div_settlement.classList.add('item');
                    let div_settlement_text = document.createTextNode(settlement.Present);
                    div_settlement.append(div_settlement_text);
                    div_settlement.addEventListener('click', e => {
                        settlementsList.style.display = 'none';
                        settlementInput.value = settlement.Present;
                        settlementRef.value = settlement.Ref;
                    });
                    settlementsList.append(div_settlement);
                });
            }
        });
    } else settlementsList.textContent = '';
}

// ==== Output settlement streets ====
function outputStreets(event) {
    var name = event.target.value.trim();
    if (name == '') streetsList.textContent = '';
    if (name != '' && settlementRef.value.trim() != '') {
        searchStreets(event.target.value, settlementRef.value.trim(), res => {
            streetsList.textContent = '';
            if (res.data[0]) {
                streetsList.style.display = 'block';
                res.data[0].Addresses.forEach(street => {
                    let div_street = document.createElement('div');
                    div_street.classList.add('item');
                    let div_street_text = document.createTextNode(street.Present);
                    div_street.append(div_street_text);
                    div_street.addEventListener('click', e => {
                        streetsList.style.display = 'none';
                        streetInput.value = street.Present;
                        streetRef.value = street.SettlementStreetRef;
                    });
                    streetsList.append(div_street);
                });
            }
        });
    } else streetsList.textContent = '';
}

// ==== Output warehouses ====
function outputWarehouses(event) {
    if (settlementRef.value.trim() != '') {
        getWarehouses(event.target.value.trim(), settlementRef.value.trim(), res => {
            warehousesList.textContent = '';
            if (res.data.length != 0) {
                warehousesList.style.display = 'block';
                res.data.forEach(warehouse => {
                    let div_warehouse = document.createElement('div');
                    div_warehouse.classList.add('item');
                    let div_warehouse_text = document.createTextNode(warehouse.Description);
                    div_warehouse.append(div_warehouse_text);
                    div_warehouse.addEventListener('click', e => {
                        warehousesList.style.display = 'none';
                        warehouseInput.value = warehouse.Description;
                        warehouseRef.value = warehouse.Ref;
                    });
                    warehousesList.append(div_warehouse);
                });
            }
        });
    }
}

document.addEventListener('click', (event) => {
    const targetElement = event.target;
    for(let list of document.querySelectorAll('.list')) {
        if (targetElement !== list.parentNode && !list.parentNode.contains(targetElement)) {
            list.style.display = 'none';
        }
    }
});
for(let list of document.querySelectorAll('.list')) {
    list.parentNode.addEventListener('click', (event) => {
        if(!event.target.classList.contains('item')) list.style.display = 'block';
    });
}