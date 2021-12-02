# Order Management

This repo is intended as a technical test for joining Tractive.

The backend consists of two services, order service and payment service. They are implemented using NestJS. These two services communicate each other asynchronously using a message broker (RabbitMQ).

Order service exposes four api endpoints to be used by the frontend.

### Create an order

```http
  POST /api/orders
```

Payload

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `product`  | `string` | **Required**. Product name     |
| `price`    | `number` | **Required**. Product price    |
| `quantity` | `number` | **Required**. Product quantity |

### Get All Orders

```http
  GET /api/orders
```

### Get An Order

```http
  GET /api/orders/:id
```

### Cancel An Order

```http
  PATCH /api/orders/:id/cancel
```

The frontend is implemented using React.
