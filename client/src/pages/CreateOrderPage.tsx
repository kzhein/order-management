import React, { useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { from } from 'rxjs';

const products = [
  { id: 1, name: 'Google Pixel 4a', price: 349 },
  { id: 2, name: 'Google Pixel 5', price: 699 },
  { id: 3, name: 'Google Pixel 5a', price: 478 },
  { id: 4, name: 'Google Pixel 6', price: 739 },
];

const CreateOrderPage = () => {
  const [selected, setSelected] = useState({
    name: '',
    price: 0,
    quantity: 1,
  });

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedProduct = products.find(p => p.id === Number(e.target.value));
    setSelected(selected => ({ ...selected, ...selectedProduct }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(selected => ({
      ...selected,
      quantity: Number(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    from(
      axios.post('http://localhost:4000/api/orders', {
        product: selected.name,
        price: selected.price,
        quantity: selected.quantity,
      })
    ).subscribe({
      next: _ => alert('Order created successfully'),
      error: err => {
        console.log(err);
        alert('Order failed. Please try again.');
      },
    });
  };

  return (
    <div className='mt-3'>
      <h2 className='mb-3'>Create Order</h2>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <Form.Group as={Row} className='mb-3'>
            <Form.Label as='legend' column sm={2}>
              Product
            </Form.Label>
            <Col sm={10}>
              {products.map(product => (
                <Form.Check
                  key={product.id}
                  type='radio'
                  label={product.name}
                  name='product'
                  id={product.name}
                  value={product.id}
                  required
                  onChange={handleProductChange}
                />
              ))}
            </Col>
          </Form.Group>
        </fieldset>
        <Form.Group as={Row} className='mb-3' controlId='formHorizontalEmail'>
          <Form.Label column sm={2}>
            Price ($)
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='text'
              placeholder='Price'
              value={selected.price}
              readOnly
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3' controlId='formHorizontalEmail'>
          <Form.Label column sm={2}>
            Quantity
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              aria-label='Select quantity'
              required
              value={selected.quantity}
              onChange={handleQuantityChange}
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3'>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type='submit'>Order</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default CreateOrderPage;
