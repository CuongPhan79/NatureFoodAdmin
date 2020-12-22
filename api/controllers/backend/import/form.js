const moment = require('moment');
const randomize = require('randomatic');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/import/form',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/backend/login' };
      }

      let totalActive = await ImportService.count({ status: sails.config.custom.STATUS.ACTIVE });
      let totalDraft = await ImportService.count({ status: sails.config.custom.STATUS.DRAFT});
      let totalTrash = await ImportService.count({ status: sails.config.custom.STATUS.TRASH});
      let suppliers = await SupplierService.find();
        let _default = await sails.helpers.getDefaultData(this.req);
        let params = this.req.allParams();
        let status = (params.status) ? (params.status) : 1;
      _default.suppliers = suppliers;
      _default.totalTrash = totalTrash;
      _default.totalActive = totalActive;
      _default.totalDraft = totalDraft;
      _default.status = status;
      _default.currentDay = moment().format('YYYY-MM-DD');
      _default.code = randomize('A0', 8);
      sails.log.info("================================ controllers/backend/list => TYPE ================================");
      return exits.success(_default);
    }
  
  };