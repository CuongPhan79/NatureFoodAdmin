const ErrorService = require('../../../../config/errors');
module.exports = {
   add: async (req, res) => {
    sails.log.info("================================ BrandController.add => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK NAME & CODE
    if (!params.title || !params.title.trim().length) {
    return res.badRequest(ErrorService.BRAND_CODE_REQUIRED);
    }
    // PREPARE DATA
    const newData = {
      title: params.title, // REQUIRED
      status: 1, // REQUIRED
      description: params.description,
    };
    // ADD NEW DATA 
    const newBrand = await BrandService.add(newData);
    // RETURN DATA
    return res.ok(newBrand);
  },
  get: async (req, res) => {
    sails.log.info("================================ BrandController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) {
      return res.badRequest(ErrorService.BRAND_ID_REQUIRED);
    }
    // QUERY & CHECK DATA TITLE
    const dataObj = await BrandService.get({
      id: params.id
    });
    if (!dataObj) {
      return res.notFound();
    }
    // RETURN DATA TITLE
    return res.json(dataObj);
  },
  edit: async (req, res) => {
    sails.log.info("================================ BrandController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK TITLE
    if (!params.title || !params.title.trim().length) {
      return res.badRequest(ErrorService.BRAND_ID_REQUIRED);
    }
    // CHECK DATA 
    const dataObj = await BrandService.get({ id: params.id });
    if (!dataObj) return res.notFound();
    // PREPARE DATA 
    const editData = {
      title: params.title, // REQUIRED
      status: params.status, // REQUIRED
      description: params.description,
    }
    // UPDATE DATA TITLE
    const editObj = await BrandService.edit({ id: params.id }, editData);
    // RETURN DATA TITLE
    return res.json(editObj);
  },
  trash: async (req, res) => {
    sails.log.info("================================ BrandController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorService.BRAND_ID_REQUIRED);
    // Call constructor with custom options:
    let data = { status: sails.config.custom.STATUS.TRASH };
    let data1 = { status: sails.config.custom.STATUS.DRAFT };
    let ids = params.ids;
    if(params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let dataObj = await BrandService.get({ id: ids[i] });
        if (!dataObj) return res.notFound(ErrorService.ERR_NOT_FOUND);
        //If status  == 3 => Delete 
        if (dataObj.status == 3) {
          await Brand.update(ids[i]).set(data1);
        } else {
          await Brand.update(ids[i]).set(data);
        }
      }
    }
    else {
      //ALWAYS CHECK  OBJECT EXIST
      let dataObj = await BrandService.get({ id: ids });
      if (!dataObj) return res.notFound(ErrorService.ERR_NOT_FOUND);
      //If status Title == 3 => Delete Title
      if (dataObj.status == 3) {
        await Brand.update(ids).set(data1);
      } else {
        await Brand.update(ids).set(data);
      }
    }
    return res.ok();
  },
  search: async (req, res) => {
    sails.log.info("================================ ProductTypeController.search => START ================================");
    let params = req.allParams();
    let status = params.status ? parseInt(params.status) : 1;
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
    let where = {
      status: status
    };
    //IF TITLE !='' => SEARCH STRING
    if (typeof title === "string" && title.length > 0) {
      where = {
        or: [
          {
            title: {
              contains: title
            },
            status: status
          }
        ]
      };
    }
    //END IF TITLE
    let arrObjBrand = await BrandService.find(where, limit, skip, sort);
    //RESPONSE
    let resBrand = [];
    for (let brand of arrObjBrand) {
      let tmpData = {};
      tmpData.id = '<input class="js-checkbox-item" type="checkbox" value="' + brand.id + '">';
      tmpData.title = brand.title;
      tmpData.tool = await sails.helpers.renderRowAction(brand);
      tmpData.description = brand.description;
      if (brand.status == 0) {
        tmpData.status = '<label class="badge badge-warning">Lưu tạm</label>';
      } else if (brand.status == 3) {
        tmpData.status = '<label class="badge badge-danger">Thùng rác</label>';
      } else {
        tmpData.status = '<label class="badge badge-success">Sử dụng</label>';
      }
      resBrand.push(tmpData);
    };
    //END RESPONSE
    let totalBrand = await BrandService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalBrand, recordsFiltered: totalBrand, data: resBrand });
  }
}