import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useDispatch } from "react-redux";
import { addTaskToServer } from "../slices/tasksSlice";

const AddTask = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const addTask = (e) => {
        e.preventDefault();
        console.log({ title, description });
        dispatch(addTaskToServer({ title, description }));
        setTitle('');
        setDescription('');
    };

    return (
        <section className="my-5 d-flex justify-content-center">
            <Card style={{ width: '40rem', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                    <h4 className="text-center mb-4" style={{ color: '#011F60' }}>Add New Product</h4>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Product Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Product Name"  
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold" style={{ color: '#011F60' }}>Product Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter Product Description" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </Form.Group>

                        <div className="text-end">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                onClick={(e) => addTask(e)}
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

export default AddTask;

