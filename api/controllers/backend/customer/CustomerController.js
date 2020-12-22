const ErrorService = require('../../../../config/errors');
module.exports = {
  add: async (req, res) => {
    sails.log.info("================================ CustomerController.add => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK NAME & EMAIL & PHONE $ ADDRESS
    if (!params.firstName || !params.firstName.trim().length) {
      return res.badRequest(ErrorService.CUSTOMER_NAME_REQUIRED);
    }
    if (!params.lastName || !params.lastName.trim().length) {
        return res.badRequest(ErrorService.CUSTOMER_NAME_REQUIRED);
    }
    if (!params.emailAddress || !params.emailAddress.trim().length) {
    return res.badRequest(ErrorService.CUSTOMER_EMAIL_REQUIRED);
    }
    if (!params.phone || !params.phone.trim().length) {
      return res.badRequest(ErrorService.CUSTOMER_PHONE_REQUIRED);
    }
    if (!params.address || !params.address.trim().length) {
    return res.badRequest(ErrorService.CUSTOMER_ADDRESS_REQUIRED);
    }
    //CHECK DUPLICATE EMAIL & PHONE
    const email = await Customer.findOne({ emailAddress: params.emailAddress });
    if (email) return res.ok({message: 'Email khách hàng trùng'});
    const phone = await Customer.findOne({ phone: params.phone });
    if (phone) return res.ok({message: 'Số điện thoại bị trùng'});
    // PREPARE DATA
    const newData = {
      firstName: params.firstName,  // REQUIRED
      lastName: params.lastName,  // REQUIRED
      gender: params.gender,
      emailAddress: params.emailAddress, // REQUIRED
      phone: params.phone, // REQUIRED
      address: params.address,  // REQUIRED
      birthday: params.birthday
    };
    // ADD NEW DATA 
    const newCustomer = await CustomerService.add(newData);
    // RETURN DATA
    return res.ok(newCustomer);
  },
  edit: async (req, res) => {
    sails.log.info("================================ CustomerController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK NAME & EMAIL & PHONE $ ADDRESS
    if (!params.firstName || !params.firstName.trim().length) {
      return res.badRequest(ErrorService.CUSTOMER_NAME_REQUIRED);
    }
    if (!params.lastName || !params.lastName.trim().length) {
        return res.badRequest(ErrorService.CUSTOMER_NAME_REQUIRED);
    }
    if (!params.emailAddress || !params.emailAddress.trim().length) {
    return res.badRequest(ErrorService.CUSTOMER_EMAIL_REQUIRED);
    }
    if (!params.phone || !params.phone.trim().length) {
      return res.badRequest(ErrorService.CUSTOMER_PHONE_REQUIRED);
    }
    if (!params.address || !params.address.trim().length) {
    return res.badRequest(ErrorService.CUSTOMER_ADDRESS_REQUIRED);
    }
    //CHECK DUPLICATE EMAIL & PHONE
    const checkEmail = await Customer.findOne({ emailAddress: params.emailAddress });
    if (checkEmail) {
      if(checkEmail.id != params.id) {
        return res.ok({message: 'Email khách hàng bị trùng'});
      }
    }
    const checkPhone = await Customer.findOne({ phone: params.phone });
    if (checkPhone) {
      if(checkPhone.id != params.id) {
        return res.ok({message: 'Số điện thoại bị trùng'});
      }
    }
    // CHECK DATA
    const dataObj = await CustomerService.get({ id: params.id });
    if (!dataObj) return res.notFound();
    // PREPARE DATA
    const editData = {
      firstName: params.firstName,  // REQUIRED
      lastName: params.lastName,  // REQUIRED
      gender: params.gender,
      emailAddress: params.emailAddress, // REQUIRED
      phone: params.phone, // REQUIRED
      address: params.address,  // REQUIRED
      birthday: params.birthday
    };
    // UPDATE DATA TITLE
    const editObj = await CustomerService.edit({ id: params.id }, editData);
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
      return res.badRequest(ErrorService.CUSTOMER_ID_REQUIRED);
    }
    const dataObj = await CustomerService.get({
      id: params.id
    });
    if (!dataObj) {
      return res.notFound();
    }
    // RETURN DATA TITLE
    return res.json(dataObj);
  },

  search: async (req, res) => {
    sails.log.info("================================ CustomerController.search => START ================================");
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
            lastName: {
              contains: title
            },
          }
        ]
      };
    }
    //END IF TITLE
    let arrObjCustomer = await CustomerService.find(where, limit, skip, sort);
    //RESPONSE
    let resCustomer = [];
    for (let customer of arrObjCustomer) {
      let name = "";
      let gender = "";
      name = customer.firstName + " " + customer.lastName;
      if (customer.gender == 1){
        gender = "Nam";
      } else {
        gender = "Nữ";
      }
      let tmpData = {};
      tmpData.name = name;
      tmpData.gender = gender;
      tmpData.birthday = customer.birthday;
      tmpData.emailAddress = customer.emailAddress;
      tmpData.phone = customer.phone;
      tmpData.address = customer.address;
      tmpData.tool = await sails.helpers.renderRowAction(customer);
      resCustomer.push(tmpData);
    };
    //END RESPONSE
    let totalCustomer = await CustomerService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalCustomer, recordsFiltered: totalCustomer, data: resCustomer });
  }
}