module.exports = {
  attributes: {
    orderDate: {
      type: 'string',
      required: true
    },
    status: {
      type: 'number',
      defaultsTo: 0
    },
    typePayment: {
      type: 'number',
    },
    customer: {
      model: 'customer'
    },
    informationReceived: {
      type: 'json'
    },
    products: {
      collection: 'product',
      via: 'order',
      through: 'order_product'
    }
  }
};
