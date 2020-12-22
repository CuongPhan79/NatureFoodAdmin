const moment = require('moment');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/order/index',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/backend/login' };
      }
      let total = await OrderService.count();
      let totalUnapproved = await OrderService.count({ status: 0 });
      let totalApproved = await OrderService.count({ status: 1});
      let totalDone = await OrderService.count({ status: 2});
      let customers = await CustomerService.find();
        let _default = await sails.helpers.getDefaultData(this.req);
        let params = this.req.allParams();
        let status = (params.status) ? parseInt(params.status) : -1;
      _default.customers = customers;
      _default.total = total;
      _default.totalUnapproved = totalUnapproved;
      _default.totalApproved = totalApproved;
      _default.totalDone = totalDone;
      _default.status = status;
      _default.currentDay = moment().format('YYYY-MM-DD');
      sails.log.info("================================ controllers/backend/list => TYPE ================================");
      return exits.success(_default);
    }
};