
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
      let _default = await sails.helpers.getDefaultData(this.req);
      return exits.success(_default);
      
    }
}