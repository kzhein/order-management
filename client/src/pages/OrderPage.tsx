import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { from, mergeMap, timer } from 'rxjs';

const OrderPage = () => {
  let { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<{
    _id: string;
    product: string;
    price: number;
    quantity: number;
    totalPrice: number;
    state: string;
  } | null>(null);

  useEffect(() => {
    const orderObs = timer(0, 3000)
      .pipe(
        mergeMap(() =>
          from(axios.get(`http://localhost:4000/api/orders/${id}`))
        )
      )
      .subscribe(({ data }) => setOrder(data));

    return () => {
      orderObs.unsubscribe();
    };
  }, [id]);

  const handleClick = () => {
    from(
      axios.patch(`http://localhost:4000/api/orders/${id}/cancel`)
    ).subscribe({
      next: ({ data }) => setOrder(data),
    });
  };

  return (
    <div className='mt-3'>
      <h2 className='mb-3'>Order</h2>
      <div>
        <p>
          <span className='fs-4 fw-bold'>Id:</span> {order?._id}
        </p>
        <p>
          <span className='fs-4 fw-bold'>Product:</span> {order?.product}
        </p>
        <p>
          <span className='fs-4 fw-bold'>Price:</span> {order?.price}
        </p>
        <p>
          <span className='fs-4 fw-bold'>Quantity:</span> {order?.quantity}
        </p>
        <p>
          <span className='fs-4 fw-bold'>Total:</span> {order?.totalPrice}
        </p>
        <p>
          <span className='fs-4 fw-bold'>State:</span> {order?.state}
        </p>
      </div>
      {order?.state === 'confirmed' && (
        <Button onClick={handleClick} variant='danger'>
          Cancel Order
        </Button>
      )}
    </div>
  );
};

export default OrderPage;
