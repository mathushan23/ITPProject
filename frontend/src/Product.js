import React from "react";
import "./index.css"; // Importing the CSS file

import wire from "./images/wire.png"
import dish from "./images/dish.png"
import LED from "./images/ledbulb.png"
import helmet from "./images/helmet.png"
import bikeplug from "./images/bikeplug.png"
import cellingfan from "./images/cellingfan.png"
import electricdrill from "./images/electricdrill.png"
import homelight from "./images/homelight.png"
import watertap from "./images/watertap.png"
import plumpingitem from "./images/plumpingitem.png"
import standfan from "./images/standfan.png"
import stringledlight from "./images/stringledlight.png"

const products = [
    { id: 1, image: wire, name: "Wire", price: "$10" },
    { id: 2, image: dish, name: "Dish antenna", price: "$10" },
    { id: 3, image: LED, name: "LED", price: "$10" },
    { id: 4, image: helmet, name: "Helmet", price: "$10" },
    { id: 5, image: bikeplug, name: "Bike plug", price: "$10" },
    { id: 6, image:cellingfan, name: "Ceiling fan", price: "$10" },
    { id: 7, image: electricdrill, name: "Electric drill", price: "$10" },
    { id: 8, image: homelight, name: "Home lighting Item ", price: "$10" },
    { id: 9, image: watertap, name: "Water Tap", price: "$10" },
    { id: 10, image: plumpingitem, name: "Plumbing Item", price: "$10" },
    { id: 11, image: standfan, name: "Stand Fan", price: "$10" },
    { id: 12, image: stringledlight, name: "Decorative string light", price: "$10" }
];

const Product = () => {
    return (
        <>
            <div className="productlink">
                <ol>
                   
                    <li><h1><a href="/bags"><b>Welcome to <br />Arul Online Electromart Products</b></a></h1></li>
                    
                    
                </ol>
            </div>

            <div className="grid-container">
                {products.map((product) => (
                    <div key={product.id} className="grid-item">
                        <img src={product.image} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>This is a {product.name}</p>
                        <p>{product.price}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Product;
