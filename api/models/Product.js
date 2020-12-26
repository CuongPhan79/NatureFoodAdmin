module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    code: {
      type: 'string',
      required: true,
      unique: true
    },
    status: {
      type: 'number',
      isIn: [sails.config.custom.STATUS.TRASH, sails.config.custom.STATUS.DRAFT, sails.config.custom.STATUS.ACTIVE],
      defaultsTo: sails.config.custom.STATUS.DRAFT
    },
    price: {
      type: 'number'
    },
    description: {
      type: 'string',
    },
    image: {
      type: 'string',
      defaultsTo: ''
    },
    brand: {
      model: 'brand'
    },
    productType: {
      model: 'producttype'
    },
    orders: {
      collection: 'order',
      via: 'product',
      through: 'order_product'
    }
  }
};
  