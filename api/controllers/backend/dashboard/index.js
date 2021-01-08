
const moment = require('moment');
module.exports = {
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/dashboard/index',
        description: 'Display the dashboard for authenticated users.'
      },
      redirect: {
        responseType: 'redirect'
      }
    },
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/backend/login' };
      }
      let currentMonth = moment().format('MM');
      let currentYear = moment().format('YYYY');
      let arrMonth = [{title: "Tháng 1", value: 01},{title: "Tháng 2", value: 02},{title: "Tháng 3", value: 03},{title: "Tháng 4", value: 04},{title: "Tháng 5", value: 05},{title: "Tháng 6", value: 06},{title: "Tháng 7", value: 07},{title: "Tháng 8", value: 08},{title: "Tháng 9", value: 09},{title: "Tháng 10", value: 10},{title: "Tháng 11", value: 11},{title: "Tháng 12", value: 12}];
      let orders = await OrderService.find({or: [{
        orderDate: {
          contains: currentYear+"-"+currentMonth
        }}
      ]})
      let arrProduct = [];
      let arrQty = [];
      for(order of orders) {
        _.each(order.informationReceived.cart.items, function (item, index) {
          let dem = arrProduct.indexOf(item.product.id);
          if(dem == -1) {
            arrProduct.push(item.product.id);
            arrQty.push(item.qty);
            
          }else {
            arrQty[dem]+=item.qty;
          }
        })
      }
      let arrProductResult = []
      for(let i = 0; i<arrProduct.length; i++) {
        let product = await ProductService.get({id: arrProduct[i]})
        let data = {
          product: product,
          qty: arrQty[i]
        }
        arrProductResult.push(data);
      }
      function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const bandA = a.qty;
        const bandB = b.qty;
      
        let comparison = 0;
        if (bandA < bandB) {
          comparison = 1;
        } else if (bandA > bandB) {
          comparison = -1;
        }
        return comparison;
      }
      arrProductResult.sort(compare);
      let arrProductResult1 = [];
      if(arrProductResult.length>7){
        for(let i = 0; i<7; i++) {
          arrProductResult1.push(arrProductResult[i]);
        }
      } else {
        arrProductResult1 = arrProductResult;
      }
      let _default = await sails.helpers.getDefaultData(this.req);
      _default.arrProductResult = arrProductResult1;
      _default.arrMonth = arrMonth;
      _default.currentMonth = currentMonth;
      return exits.success(_default);
      
    }
}