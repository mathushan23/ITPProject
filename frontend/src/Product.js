import React, { useState } from "react";
import "./index.css"; // Importing the CSS file
import Navbar2 from "./components/Navbar2";

import wire from "./images/wire.png";
import dish from "./images/dish.png";
import LED from "./images/ledbulb.png";
import helmet from "./images/helmet.png";
import bikeplug from "./images/bikeplug.png";
import cellingfan from "./images/cellingfan.png";
import electricdrill from "./images/electricdrill.png";
import homelight from "./images/homelight.png";
import watertap from "./images/watertap.png";
import plumpingitem from "./images/plumpingitem.png";
import standfan from "./images/standfan.png";
import stringledlight from "./images/stringledlight.png";

const products = [
    { id: 1, image: wire, name: "Wire", price: "LKR 10500", description: "Available in different lengths and thicknesses" },
    { id: 2, image: dish, name: "Dish Antenna", price: "LKR 5500", description: "Wide signal coverage and Weather-resistant build" },
    { id: 3, image: LED, name: "LED Bulb", price: "LKR 840", description: "High brightness with warm and cool light options" },
    { id: 4, image: helmet, name: "Helmet", price: "LKR 3500", description: "Comfortable padding inside and Adjustable strap for a secure fit" },
    { id: 5, image: bikeplug, name: "Bike Plug", price: "LKR 1500", description: "Enhances fuel efficiency and engine performance" },
    { id: 6, image: cellingfan, name: "Ceiling Fan", price: "LKR 10500", description: "Multiple blade designs and color options available" },
    { id: 7, image: electricdrill, name: "Electric Drill Machine", price: "LKR 9500", description: "Adjustable speed settings for different materials" },
    { id: 8, image: homelight, name: "Home Lighting Item", price: "LKR 8500 ", description: "Stylish and efficient home lighting solutions to brighten your space" },
    { id: 9, image: watertap, name: "Water Tap", price: "LKR 1500", description: "Available in brass, plastic, and stainless steel" },
    { id: 10, image: plumpingitem, name: "Plumbing Item", price: "LKR 250", description: "Suitable for both hot and cold water supply" },
    { id: 11, image: standfan, name: "Stand Fan", price: "LKR 7000", description: "Energy-efficient motor for long usage hours" },
    { id: 12, image: stringledlight, name: "Decorative String Light", price: "LKR 450", description: "Different color and shape variations available" }
];

const Product = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Navbar2 onSearch={setSearchQuery} />

            <div className="productlink">
                <ol>
                    <li><h1><b>Welcome to <br />Arul Online Electromart Products</b></h1></li>
                </ol>
            </div>

            <div className="grid-container">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="grid-item">
                            <img src={product.image} alt={product.name} />
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                            <button>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </>
    );
};

export default Product;
