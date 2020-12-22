const moment = require('moment');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/import/formView',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/backend/login' };
      }
      let params = this.req.allParams();
      let status = (params.status) ? (params.status) : 1;
      let totalActive = await ImportService.count({ status: sails.config.custom.STATUS.ACTIVE });
      let totalDraft = await ImportService.count({ status: sails.config.custom.STATUS.DRAFT});
      let totalTrash = await ImportService.count({ status: sails.config.custom.STATUS.TRASH});
      let Import1 = await Import.findOne({id: params.id}).populate("createdBy").populate("supplier");
        let _default = await sails.helpers.getDefaultData(this.req);
      _default.Import = Import1;
      _default.totalTrash = totalTrash;
      _default.totalActive = totalActive;
      _default.totalDraft = totalDraft;
      _default.status = status;
      _default.currentDay = moment().format('YYYY-MM-DD');
      sails.log.info("================================ controllers/backend/list => TYPE ================================");
      return exits.success(_default);
    }
  
  };