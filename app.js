"use strict";

// HTML-ELEMENT
const productSectionEl = document.getElementById("products");
const productButtonEl = document.getElementById("productsBtn");
const totalCartItemsEl = document.getElementById("totalCartItems");

// Skriv ut det nya antalet produkter i vagnen bredvid den.
let cartSize = JSON.parse(localStorage.getItem("CART"));
console.log(cartSize.length);
totalCartItemsEl.innerHTML = cartSize.length;