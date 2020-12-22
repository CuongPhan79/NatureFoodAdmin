const ImportService = {
    get: async (options) => {
        sails.log.info("================================ ImportService.get -> options: ================================");
        sails.log.info(options);
    
        let records = await Import.findOne(options);
        return records;
    },
    add: async (options) => {
    sails.log.info("================================ ImportService.add -> options: ================================");
    sails.log.info(options);

    let newObj = await Import.create(options)
        // Some other kind of usage / validation error
        .intercept('UsageError', (err) => {
        return 'invalid';
        })
        .fetch();
    sails.log.info("================================ ImportService.add -> new object: ================================");
    sails.log.info(newObj);
    return newObj;
    },
    edit: async (query, params) => {
        sails.log.info("================================ ImportService.edit -> query, params: ================================");
        sails.log.info(query);
        sails.log.info(params);
    
        let options = {};
    
        for (let key in Import.attributes) {
          if (key === "id" || key === "createdAt" || key === "toJSON") continue;
    
          if (params && typeof (params[key]) !== "undefined") {
            options[key] = params[key];
          }
        }
    
        options.updatedAt = new Date().getTime();
    
        let editObj = await Import.update(query, options).fetch();
        sails.log.info("================================ ImportService.edit -> edit object: ================================");
        sails.log.info(editObj);
        return editObj;
    },
    del: (options, cb) => {
        sails.log.info("================================ ImportService.del -> options: ================================");
        sails.log.info(options);
    
        Import.destroy(options).exec((error, deletedRecords) => {
          if (error) {
            sails.log.error(error);
            return cb(error, null);
          }
    
          return cb(null, deletedRecords);
        });
    },
    find: async (where, limit, skip, sort) => {
        sails.log.info("================================ ImportService.find -> where: ================================");
        sails.log.info(JSON.stringify(where));
        sails.log.info(limit);
        sails.log.info(skip);
        sails.log.info(sort);
        where = (typeof where === 'object') ? where : {};
        limit = (limit !== 'null') ? limit : 10;
        skip = (skip !== null && typeof skip === 'number') ? skip : 0;
        sort = (sort !== null && typeof sort === 'object') ? sort : [{ createdAt: 'DESC' }];
    
        let sujects = await Import.find({ where: where, limit: limit, skip: skip, sort: sort })
          return sujects;
    },
    count: async (where) => {
        where = (typeof where === 'object') ? where : {};
        let totalTax = await Import.count(where);
        return totalTax;
    }
}
module.exports = ImportService;