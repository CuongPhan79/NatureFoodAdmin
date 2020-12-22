const ErrorService = require('../../../../config/errors');
const moment = require('moment');
module.exports = {
    add: async (req, res) => {
        sails.log.info("================================ BrandController.add => START ================================");
        // GET ALL PARAMS
        const params = req.allParams();
        // CHECK NAME & CODE
        if (!params.code || !params.code.trim().length) {
        return res.badRequest(ErrorService.ORDER_CODE_REQUIRED);
        }
        if (!params.date || !params.date.trim().length) {
            return res.badRequest(ErrorService.ORDER_DATE_REQUIRED);
        }
        const code = await Order.findOne({ code: params.code });
        if (code) return res.ok({message: 'Mã bán hàng bị trùng'});
        // PREPARE DATA
        let price = {};
        price.totalPrice = params.totalPrice;
        price.discount = params.discountval;
        price.pay = params.totalPrice;
        const newData = {
            code: params.code, // REQUIRED
            listProduct: params.slotItems,
            note: params.description,
            price: price,
            date: params.date,
            createdBy: req.me.id,
            status: 1,
            type: 1//no customer
        };
        // ADD NEW DATA 
        const newOrder = await OrderService.add(newData);
         // MINUS NUMBER PRODUCT AFTER CREATE IMPORT
         for(product of newData.listProduct) {
            let productGet = await Product.findOne({_id: product.product})
            let number = productGet.number;
            if(number <= 0){
                return res.ok(({message: 'Sản phẩm' + productGet.title + 'đã hết'}))
            }else{
                let data = {number: number - product.number};
                let minus = await Product.update(product.product).set(data);
            } 
        }
        // RETURN DATA
        return res.ok(newOrder);
    },
    search: async (req, res) => {
        sails.log.info("================================ ProductController.search => START ================================");
        let params = req.allParams();
        let status = params.status ? parseInt(params.status) : null;
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = null;
        if(params.order)
        {
          let objOrder = {};
          objOrder[params.columns[params.order[0].column].data] = params.order[0].dir ;
          sort = [objOrder];
        }
        let where = {
        };
      //find only active status
        if(status) {
            where = {
                status: status
            }
        }      
      //END IF TITLE
        let arrObjOrder = await OrderService.find(where, limit, skip, sort);
        //RESPONSE
        let resOrder= []; 
        for (let order of arrObjOrder) {
            let listProduct = [];
            for(let product of order.products) {
                listProduct.push(product.title);
            }
            let tmpData = {};
            tmpData.code = order.id;
            tmpData.orderDate = moment(order.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
            tmpData.listProduct = listProduct.join(', ');
            tmpData.totalPrice = order.informationReceived.cart.totalPrice;
            tmpData.nameCustomer = order.informationReceived.shipping.fullName;
            tmpData.typePayment = (order.typePayment == 0) ?   `<div class="d-flex align-items-center">
            <img src="/images/payment.png" alt="profile" class="img-sm rounded-circle">
            <span>Thanh toán khi nhận hàng</span>
            </div>`:   `<div class="d-flex align-items-center">
            <img src="/images/paypal.png" alt="profile" class="img-sm rounded-circle">
            <span>Thanh toán bằng paypal</span>
            </div>`;
            tmpData.tool = await sails.helpers.renderRowAction2(order);
            if (order.status == 0) {
                tmpData.status = '<label class="badge badge-warning">Chưa xác nhận</label>';
            } else if (order.status == 1) {
                tmpData.status = '<label class="badge badge-success">Đang giao</label>';
            } else {
                tmpData.status = '<label class="badge badge-light">Hoàn thành</label>';
            }
            resOrder.push(tmpData);
        };
      //END RESPONSE
        let totalProduct = await OrderService.count(where);
        return res.ok({ draw: draw, recordsTotal: totalProduct, recordsFiltered: totalProduct, data: resOrder });
    },
    changeStatus: async (req, res) => {
        sails.log.info("================================ ProductController.trash => START ================================");
        let params = req.allParams();
        if (!params.id) return res.badRequest(ErrorService.PRODUCT_ID_REQUIRED);
        // Call constructor with custom options:
        let dataObj = await OrderService.get({ id: params.id });
        if (!dataObj) return res.notFound(ErrorService.ERR_NOT_FOUND);
        if (dataObj.status == 0) {
            await Order.update(params.id).set({status: 1});
        } else if (dataObj.status == 1) {
            await Order.update(params.id).set({status: 2});
        }
        return res.ok();
    },
}