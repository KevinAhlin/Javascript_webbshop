"use strict";

// HTML-ELEMENT
const topPageBtnEl = document.getElementById("topBtn");
const unorderedListEl = document.getElementById("itemList");
const totalPriceEl = document.getElementById("totalPrice");
const orderFormEl = document.getElementById("orderForm");
const totalCartItemsEl = document.getElementById("totalCartItems");

const buyerNameEl = document.getElementById("buyerName");
const emailEl = document.getElementById("email");
const addressEl = document.getElementById("address");
const shipmentOptionEl = document.getElementById("shipmentType");
const submitButtonEl = document.getElementById("submitBtn");

// FUNTIONER
function showCart() {

    let cart = localStorage.getItem("CART");
    cart = JSON.parse(cart);
    console.log(cart);

    let totalPrice = 0;
    cart.forEach(element => {

        // parseFloat() tar en variabel och returnerar ett float tal/nummer
        totalPrice += parseFloat(element.price);
    });
    console.log(totalPrice.toFixed(2));     

    // Skriv ut kundens lista med produkter samt prissumman under listan
    for (let item of cart) {

        unorderedListEl.innerHTML += `
        <li>
        <img src='${item.image}' alt='picture of product' class='image' width='100'> <br>
        ${item.title} <br>
        Product ID: ${item.id} <br>
        Price: $${item.price} <br>
        <button onclick="deleteProduct('${item.title }')">Delete</button>
        </li>
        <br><br>
        `
    }

    if (cart.length != 0) {
        // toFixed(x) avrundar ett tal till x antal decimaler
        totalPriceEl.innerHTML = "<b>Total price: </b>$" + totalPrice.toFixed(2);
    }

}
showCart();

function deleteProduct(productName) {
    let cart = localStorage.getItem("CART");
    console.log(cart);
    cart = JSON.parse(cart);

    console.log(cart);
    console.log(cart.length);
    console.log(cart[0].title);

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === productName) {
            console.log(cart[i].title);
            cart.splice(i,1);
        }
    }
    console.log(cart);
    
    console.log(productName);
    localStorage.setItem("CART", JSON.stringify(cart));

    setTimeout(() => location.reload(), 200)    // reloads the site after 500 ms
}

function postOrder() {
    let cart = localStorage.getItem("CART");
    console.log(cart);
    cart = JSON.parse(cart);
    console.log(cart);

    // Skapa en lista som endast innehåller valda produkters id
    let cartIDs = [];
    cart.forEach(element => {
        console.log(element.id);
        cartIDs.push(element.id);
    });
    console.log(cartIDs);
    
    // Hämta köparens uppgifter från formuläret
    let fullName = buyerNameEl.value;
    let email = emailEl.value;
    let address = addressEl.value;
    let shipmentOption = shipmentOptionEl.value;
    let productIDs = JSON.stringify(cartIDs);

    if (fullName === '' || email === '' || address === '' || shipmentOption === '') {
        console.log(fullName);
        alert("Please fill in every field.");
    } else {
    // Sätt samman värdena till ett JSON-objekt
    let body = JSON.stringify(
        {
            "fields": {
                "name": {
                    "stringValue": fullName
                },
                "email": {
                    "stringValue": email
                },
                "address": {
                    "stringValue": address
                },
                "shipment": {
                    "stringValue": shipmentOption
                },
                "productIDs": {
                    "stringValue": productIDs
                }
            }
        }
    )
    
    fetch("https://firestore.googleapis.com/v1/projects/webbsite-project/databases/(default)/documents/FakeStore", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(res => res.json())    // Konverterar JSON-data från anropet till JS-objekt
        .then(data => console.log(data))
        .catch(error => alert(error));

    console.log("POST funkade");
    clearForm();
    }
}

function clearForm() {
    orderFormEl.reset();
    localStorage.clear();

    alert("Order sent. Thank you.");
    setTimeout(() => location.reload(), 1000);     // laddar om sidan efter 1000 ms
}

// När användaren scrollar ner 20px eller mer från toppen av sidan visas knappen
window.onscroll = function() {scrollFunction()};

function scrollFunction() {

    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topPageBtnEl.style.display = "block";
    } else {
        topPageBtnEl.style.display = "none";
    }
}

// När användaren klickar på knappen tar dom till toppen av sidan
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Skriv ut det nya antalet produkter i vagnen bredvid den.
let cartSize = JSON.parse(localStorage.getItem("CART"));
console.log(cartSize.length);
totalCartItemsEl.innerHTML = cartSize.length;


// EVENTHANTERARE
submitButtonEl.addEventListener('click', postOrder);
