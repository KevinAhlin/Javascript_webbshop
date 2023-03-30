"use strict";

// HTML-ELEMENT
const customerOrderEl = document.getElementById("customerOrder");
const totalCartItemsEl = document.getElementById("totalCartItems");
const topPageBtnEl = document.getElementById("topBtn");

const buyerNameEl = document.getElementById("buyerName");
const emailEl = document.getElementById("email");
const addressEl = document.getElementById("address");
const productIDListEl = document.getElementById("products");
const shipmentOptionEl = document.getElementById("shipmentType");


// FUNKTIONER
function getOrders() {

    fetch("https://firestore.googleapis.com/v1/projects/webbsite-project/databases/(default)/documents/FakeStore/")
        .then(result => result.json())
        .then(data => renderOrders(data));
}

function renderOrders(orders) {

    let orderArray = orders.documents;
    console.log(orderArray);

    orderArray.forEach(element => {

        // Debugging
        // console.log(element);
        // console.log(element.name);
        // console.log(element.fields);
        // console.log(element.fields.productIDs);
        // console.log(element.fields.productIDs.stringValue);

        customerOrderEl.innerHTML += `
        <article>
            Ordername: <br>
            <b> ${element.name} </b>
            <h4> Personal Information: </h4>
            Name: <b> ${element.fields.name.stringValue} </b>
            <br>
            E-mail: <b> ${element.fields.email.stringValue} </b>
            <br>
            Address: <b> ${element.fields.address.stringValue} </b>
            <br><br>
            ProductIDs: <b> ${JSON.parse(element.fields.productIDs.stringValue)} </b>
            <br>
            Shipment Type: <b> ${element.fields.shipment.stringValue} </b>
            <br><br>
            <button onclick="deleteOrder('${element.name}')">Delete Order</button>
            <button onclick="changeOrder('${element.name}', '${JSON.parse(element.fields.productIDs.stringValue)}')">Change Information</button>
            <br><br><hr>
        </article>
        `
    });

}
getOrders();

function deleteOrder(orderName) {

    fetch("https://firestore.googleapis.com/v1/" + orderName, {
        method: 'DELETE'
    })
        .then(data => console.log(data));

    alert("Order removed");
    setTimeout(() => location.reload(), 500);   // Laddar om sidan efter 500 ms
}

function changeOrder(orderName, productList) {

    productList = JSON.stringify(productList);

    // Hämta in ny data från formuläret
    let fullName = buyerNameEl.value;
    let email = emailEl.value;
    let address = addressEl.value;
    let shipmentOption = shipmentOptionEl.value;
    let productIDs = productIDListEl.value;
    console.log(productIDs);

    if (fullName === '' || email === '' || address === '' || shipmentOption === '') {
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

        // Hämta datan som ska ändras
        fetch("https://firestore.googleapis.com/v1/" + orderName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => res.json())
            .then(data => console.log(data));

        alert("Order has been changed!");
        setTimeout(() => location.reload(), 300);   // Laddar om sidan efter 300 ms
    }
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
