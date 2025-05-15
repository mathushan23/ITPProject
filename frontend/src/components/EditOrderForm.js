import React from 'react';
import { Modal, Button, Form, Table, Image } from 'react-bootstrap';

const EditOrderForm = ({
  show,
  handleClose,
  cart,
  setCart,
  handleUpdateOrder,
  loading,
  user
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('You must have at least one product in the cart.');
      return;
    }
    handleUpdateOrder();
  };

  const handleRemoveProduct = (indexToRemove) => {
    const updatedCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price ?? item.amount ?? 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Customer Name:</Form.Label>
            <div>{user?.username || 'Not available'}</div>
          </Form.Group>

          {cart.length > 0 && (
            <div className="mb-3">
              <h6>Order Summary</h6>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price (LKR)</th>
                    <th>Subtotal (LKR)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const quantity = Number(item.quantity || 1);
                    const price = Number(item.price ?? item.amount ?? 0);
                    const subtotal = quantity * price;
                    const productName = item.productName || item.product || item.title || item.name;

                    return (
                      <tr key={index}>
                        <td>{productName || <span className="text-muted">Unnamed Product</span>}</td>

                        <td>{quantity}</td> {/* Display quantity statically */}
                        <td>{price.toFixed(2)}</td> {/* Display price statically */}
                        <td>LKR {subtotal.toFixed(2)}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">Total</td>
                    <td colSpan="2" className="fw-bold">LKR {calculateTotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Phone Number:</Form.Label>
            <div>{user?.phone || 'Not available'}</div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Address:</Form.Label>
            <div>{user?.address || 'Not available'}</div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Email:</Form.Label>
            <div>{user?.email || 'Not available'}</div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Updating...' : 'Update Order'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditOrderForm;
