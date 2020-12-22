const ErrorService = require('../../../../config/errors');
const moment = require('moment');
module.exports = {
    add: async (req, res) => {
        sails.log.info("================================ ImportController.add => START ================================");
        // GET ALL PARAMS
        const params = req.allParams();
        // CHECK NAME & CODE
        if (!params.code || !params.code.trim().length) {
        return res.badRequest(ErrorService.IMPORT_CODE_REQUIRED);
        }
        if (!params.date || !params.date.trim().length) {
            return res.badRequest(ErrorService.IMPORT_DATE_REQUIRED);
        }
        const code = await Import.findOne({ code: params.code });
        if (code) return res.ok({message: 'Mã nhập hàng bị trùng'});
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
            supplier: params.supplierBox
        };
        // ADD NEW DATA
        const newImport = await ImportService.add(newData);
        // ADD NUMBER PRODUCT AFTER CREATE IMPORT
        for(product of newData.listProduct) {
            let productGet = await Product.findOne({_id: product.product})
            let number = productGet.number;
            let data = {number: number + product.number};
            let add = await Product.update(product.product).set(data);
        }
        // RETURN DATA
        return res.ok(newImport);
    },
    search: async (req, res) => {
        sails.log.info("================================ ProductTypeController.search => START ================================");
        let params = req.allParams();
        let status = params.status ? parseInt(params.status) : 1;
        let date = params.date ? params.date : moment().format('YYYY-MM-DD');
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
            //date: date
        };
        //IF TITLE !='' => SEARCH STRING
        if (typeof title === "string" && title.length > 0) {
          where = {
            or: [
              {
                code: {
                  contains: title
                },
              }
            ]
          };
        }
    //END IF TITLE
        let arrObjImport = await ImportService.find(where, limit, skip, sort);
        let url = "/backend/import/formView/"
        //RESPONSE
        let resImport = [];
        for (let Import of arrObjImport) {
          let tmpData = {};
          tmpData.code = Import.code;
          tmpData.date = moment(Import.date,'YYYY-MM-DD').format('DD/MM/YYYY');
          tmpData.tool = `<div class="btn-group-action">				
          <div class="btn-group pull-right">
            <a href="${url ? url + Import.id : 'javascript:void(0);'}">
              <i>Xem chi tiết</i>
            </a>
            </ul>
          </div>
        </div>`;

          tmpData.note = Import.note ? Import.note : "-";
          let supplier = await Supplier.findOne({id: Import.supplier});
          tmpData.supplier = supplier.name;
          let userCreated = await User.findOne({id: Import.createdBy});
          tmpData.userCreated = userCreated.firstName + " " + userCreated.lastName;
          resImport.push(tmpData);
        };
        //END RESPONSE
        let totalImport = await ImportService.count(where);
        return res.ok({ draw: draw, recordsTotal: totalImport, recordsFiltered: totalImport, data: resImport });
    }
}