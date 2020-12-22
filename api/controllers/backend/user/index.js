const moment = require('moment');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/user/index',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/backend/login' };
      }
      if (this.req.me.userType != 0) {
        throw { redirect: '/backend/dashboard' };
      }

      let totalActive = await UserService.count({ status: sails.config.custom.STATUS.ACTIVE });
      let totalDraft = await UserService.count({ status: sails.config.custom.STATUS.DRAFT});
      let totalTrash = await UserService.count({ status: sails.config.custom.STATUS.TRASH});
        let _default = await sails.helpers.getDefaultData(this.req);
        let params = this.req.allParams();
        let status = (params.status) ? (params.status) : 1;

      _default.totalTrash = totalTrash;
      _default.totalActive = totalActive;
      _default.totalDraft = totalDraft;
      _default.status = status;
      _default.currentDay = moment().format('YYYY-MM-DD');
      sails.log.info("================================ controllers/backend/list => TYPE ================================");
      return exits.success(_default);
    }
};