import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { from, mergeMap, timer } from 'rxjs';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState<
    {
      _id: string;
      product: string;
      price: number;
      quantity: number;
      totalPrice: number;
      state: string;
    }[]
  >([]);

  useEffect(() => {
    const ordersObs = timer(0, 3000)
      .pipe(mergeMap(() => from(axios.get('http://localhost:4000/api/orders'))))
      .subscribe(({ data }) => setOrders(data));

    return () => {
      ordersObs.unsubscribe();
    };
  }, []);

  return (
    <div className='mt-3'>
      <h2 className='mb-3'>All Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>
                <Link to={`/orders/${order._id}`}>{order._id}</Link>
              </td>
              <td>{order.product}</td>
              <td>{order.price}</td>
              <td>{order.quantity}</td>
              <td>{order.totalPrice}</td>
              <td>{order.state}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllOrdersPage;
