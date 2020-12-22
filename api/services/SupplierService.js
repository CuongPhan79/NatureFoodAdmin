const SupplierService = {
    get: async (options) => {
        sails.log.info("================================ SupplierService.get -> options: ================================");
        sails.log.info(options);
    
        let records = await Supplier.findOne(options);
        return records;
    },
    add: async (options) => {
    sails.log.info("================================ SupplierService.add -> options: ================================");
    sails.log.info(options);

    let newObj = await Supplier.create(options)
        // Some other kind of usage / validation error
        .intercept('UsageError', (err) => {
        return 'invalid';
        })
        .fetch();
    sails.log.info("================================ SupplierService.add -> new object: ================================");
    sails.log.info(newObj);
    return newObj;
    },
    edit: async (query, params) => {
        sails.log.info("================================ SupplierService.edit -> query, params: ================================");
        sails.log.info(query);
        sails.log.info(params);
    
        let options = {};
    
        for (let key in Supplier.attributes) {
          if (key === "id" || key === "createdAt" || key === "toJSON") continue;
    
          if (params && typeof (params[key]) !== "undefined") {
            options[key] = params[key];
          }
        }
    
        options.updatedAt = new Date().getTime();
    
        let editObj = await Supplier.update(query, options).fetch();
        sails.log.info("================================ SupplierService.edit -> edit object: ================================");
        sails.log.info(editObj);
        return editObj;
    },
    del: (options, cb) => {
        sails.log.info("================================ SupplierService.del -> options: ================================");
        sails.log.info(options);
    
        Supplier.destroy(options).exec((error, deletedRecords) => {
          if (error) {
            sails.log.error(error);
            return cb(error, null);
          }
    
          return cb(null, deletedRecords);
        });
    },
    find: async (where, limit, skip, sort) => {
        sails.log.info("================================ SupplierService.find -> where: ================================");
        sails.log.info(JSON.stringify(where));
        sails.log.info(limit);
        sails.log.info(skip);
        sails.log.info(sort);
        where = (typeof where === 'object') ? where : {};
        limit = (limit !== 'null') ? limit : 10;
        skip = (skip !== null && typeof skip === 'number') ? skip : 0;
        sort = (sort !== null && typeof sort === 'object') ? sort : [{ createdAt: 'DESC' }];
    
        let sujects = await Supplier.find({ where: where, limit: limit, skip: skip, sort: sort })
          return sujects;
    },
    count: async (where) => {
        where = (typeof where === 'object') ? where : {};
        let totalTax = await Supplier.count(where);
        return totalTax;
    }
}
module.exports = SupplierService;