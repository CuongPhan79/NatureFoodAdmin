module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/product/form',
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
    let totalActive = await ProductService.count({ status: sails.config.custom.STATUS.ACTIVE });
    let totalDraft = await ProductService.count({ status: sails.config.custom.STATUS.DRAFT});
    let totalTrash = await ProductService.count({ status: sails.config.custom.STATUS.TRASH});
    let params = this.req.allParams();
    let productId = params.id;
    let _default = await sails.helpers.getDefaultData(this.req);
    _default.manner = (this.req.param('id') == undefined ? 'add' : 'edit');
    let productObj = {};
    if(_default.manner == 'edit') {
      productObj = await ProductService.get(productId);
    }
    let productTypes = await ProductTypeService.find({status: sails.config.custom.STATUS.ACTIVE});
    let brands = await BrandService.find({status: sails.config.custom.STATUS.ACTIVE});
    _default.productObj = productObj;
    _default.productTypes = productTypes;
    _default.brands = brands;
    let status = (params.status) ? (params.status) : 1;
    _default.totalTrash = totalTrash;
    _default.totalActive = totalActive;
    _default.totalDraft = totalDraft;
    _default.status = status;
    sails.log.info("================================ controllers/backend/list => TYPE ================================");
    return exits.success(_default);
  }
};