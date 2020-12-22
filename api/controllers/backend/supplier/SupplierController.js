const ErrorService = require('../../../../config/errors');
module.exports = {
  add: async (req, res) => {
    sails.log.info("================================ ProductTypeController.add => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK NAME & EMAIL & PHONE $ ADDRESS
    if (!params.name || !params.name.trim().length) {
      return res.badRequest(ErrorService.SUPPLIER_NAME_REQUIRED);
    }
    if (!params.email || !params.email.trim().length) {
    return res.badRequest(ErrorService.SUPPLIER_EMAIL_REQUIRED);
    }
    if (!params.phone || !params.phone.trim().length) {
      return res.badRequest(ErrorService.SUPPLIER_PHONE_REQUIRED);
    }
    if (!params.address || !params.address.trim().length) {
    return res.badRequest(ErrorService.SUPPLIER_ADDRESS_REQUIRED);
    }
    //CHECK DUPLICATE EMAIL & PHONE
    const email = await Supplier.findOne({ email: params.email });
    if (email) return res.ok({message: 'Email nhà cung cấp bị trùng'});
    const phone = await Supplier.findOne({ phone: params.phone });
    if (phone) return res.ok({message: 'Số điện thoại bị trùng'});
    // PREPARE DATA
    const newData = {
      name: params.name,  // REQUIRED
      email: params.email, // REQUIRED
      phone: params.phone, // REQUIRED
      address: params.address,  // REQUIRED
    };
    // ADD NEW DATA 
    const newSupplier = await SupplierService.add(newData);
    // RETURN DATA
    return res.ok(newSupplier);
  },
  edit: async (req, res) => {
    sails.log.info("================================ ProductTypeController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK NAME & EMAIL & PHONE $ ADDRESS
    if (!params.name || !params.name.trim().length) {
      return res.badRequest(ErrorService.SUPPLIER_NAME_REQUIRED);
    }
    if (!params.email || !params.email.trim().length) {
    return res.badRequest(ErrorService.SUPPLIER_EMAIL_REQUIRED);
    }
    if (!params.phone || !params.phone.trim().length) {
      return res.badRequest(ErrorService.SUPPLIER_PHONE_REQUIRED);
    }
    if (!params.address || !params.address.trim().length) {
    return res.badRequest(ErrorService.SUPPLIER_ADDRESS_REQUIRED);
    }
    //CHECK DUPLICATE EMAIL & PHONE
    const checkEmail = await Supplier.findOne({ email: params.email });
    if (checkEmail) {
      if(checkEmail.id != params.id) {
        return res.ok({message: 'Email nhà cung cấp bị trùng'});
      }
    }
    const checkPhone = await Supplier.findOne({ phone: params.phone });
    if (checkPhone) {
      if(checkPhone.id != params.id) {
        return res.ok({message: 'Số điện thoại bị trùng'});
      }
    }
    // CHECK DATA
    const dataObj = await SupplierService.get({ id: params.id });
    if (!dataObj) return res.notFound();
    // PREPARE DATA
    const editData = {
      name: params.name,  // REQUIRED
      email: params.email, // REQUIRED
      phone: params.phone, // REQUIRED
      address: params.address,  // REQUIRED
    };
    // UPDATE DATA TITLE
    const editObj = await SupplierService.edit({ id: params.id }, editData);
    // RETURN DATA TITLE
    return res.json(editObj);
  },
  trash: async (req, res) => {
    sails.log.info("================================ ProductTypeController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorService.SUPPLIER_ID_REQUIRED);
    // Call constructor with custom options:
    let data = { status: sails.config.custom.STATUS.TRASH };
    let ids = params.ids;
    //ALWAYS CHECK  OBJECT EXIST
    let dataObj = await SupplierService.get({ id: ids });
    if (!dataObj) return res.notFound(ErrorTitle.ERR_NOT_FOUND);
    SupplierService.del({ id: ids });
    return res.ok();
  },
  get: async (req, res) => {
    sails.log.info("================================ ProductTypeController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) {
      return res.badRequest(ErrorService.SUPPLIER_ID_REQUIRED);
    }
    const dataObj = await SupplierService.get({
      id: params.id
    });
    if (!dataObj) {
      return res.notFound();
    }
    // RETURN DATA TITLE
    return res.json(dataObj);
  },

  search: async (req, res) => {
    sails.log.info("================================ ProductTypeController.search => START ================================");
    let params = req.allParams();
    let title = params.search ? params.search.value : null;
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
    
    //find only active status
    let where = {};
    //IF TITLE !='' => SEARCH STRING
    if (typeof title === "string" && title.length > 0) {
      where = {
        or: [
          {
            name: {
              contains: title
            },
          }
        ]
      };
    }
    //END IF TITLE
    let arrObjSupplier = await SupplierService.find(where, limit, skip, sort);
    //RESPONSE
    let resSupplier = [];
    for (let supplier of arrObjSupplier) {
      let tmpData = {};
      tmpData.name = supplier.name;
      tmpData.email = supplier.email;
      tmpData.phone = supplier.phone;
      tmpData.address = supplier.address;
      tmpData.tool = await sails.helpers.renderRowAction(supplier);
      resSupplier.push(tmpData);
    };
    //END RESPONSE
    let totalSupplier = await SupplierService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalSupplier, recordsFiltered: totalSupplier, data: resSupplier });
  }
}