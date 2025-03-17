import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useDispatch } from "react-redux";
import { addTaskToServer } from "../slices/tasksSlice";

const AddProduct = () => {
    const dispatch = useDispatch();
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');

    const addProduct = (e) => {
        e.preventDefault();
        console.log({ productId, productName, productCategory, productDescription, price });
        dispatch(addTaskToServer({ productId, productName, productCategory, productDescription, price }));
        setProductId('');
        setProductName('');
        setProductCategory('');
        setProductDescription('');
        setPrice('');
    };

    return (
        <section className="my-5 d-flex justify-content-center">
            <Card style={{ width: '40rem', backgroundColor: '#BBC4C6', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                    <h4 className="text-center mb-4" style={{ color: '#011F60' }}>Add New Product</h4>
                    <Form>
                        

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Product Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Product Name"  
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Product Category</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Product Category"  
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Enter Product Price"  
                                value={price}
                                onChange={(e) => setPrice(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Product Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter Product Description" 
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)} 
                            />
                        </Form.Group>

                        <div className="text-end">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                onClick={(e) => addProduct(e)}
                                style={{ backgroundColor: '#011F60', borderColor: '#011F60' }}
                            >
                                Add Product
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </section>
    );
};

export default AddProduct;
