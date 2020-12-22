'use strict';

const CustomerService = {
    get: async (options) => {
        sails.log.info("================================ CustomerService.get -> options: ================================");
        sails.log.info(options);

        let records = await Customer.findOne(options);
        return records;
        
    },

    add : async (options) => {
        sails.log.info("================================ CustomerService.add -> options: ================================");
        sails.log.info(options);
        
        let newObj = await Customer.create(options)
        // Some other kind of usage / validation error
        .intercept('UsageError', (err)=> {
            return 'invalid';
        })
        .fetch();
        sails.log.info("================================ CustomerService.add -> new object: ================================");
        sails.log.info(newObj);
        return newObj;
    },

    edit: async (query, params) => {
        sails.log.info("================================ CustomerService.edit -> query, params: ================================");
        sails.log.info(query);
        sails.log.info(params);

        let options = {};

        for(let key in Customer.attributes) {
            if( key === "id" || key === "createdAt" || key === "toJSON" ) continue;

            if(params && typeof(params[key]) !== "undefined") {
                options[key] = params[key];
            }
        }

        options.updatedAt = new Date().getTime();
        
        let editObj = await Customer.update(query, options).fetch();
        sails.log.info("================================ CustomerService.edit -> edit object: ================================");
        sails.log.info(editObj);
        return editObj;
    },

    del: (options, cb) => {
        sails.log.info("================================ CustomerService.del -> options: ================================");
        sails.log.info(options);

        Customer.destroy(options).exec( (error, deletedRecords) => {
            if(error) {
                sails.log.error(error);
                return cb(error, null);
            }

            return cb(null, deletedRecords);
        });
    },

    find:  async( where, limit, skip, sort) => {
        sails.log.info("================================ CustomerService.find -> where: ================================");
        sails.log.info(JSON.stringify(where));
        sails.log.info(limit);
        sails.log.info(skip);
        sails.log.info(sort);
        where = (typeof where === 'object') ? where : {};
        limit = (limit !== 'null') ? limit : 10;
        skip = (skip !== null && typeof skip === 'number') ? skip: 0;
        sort = (sort !== null && typeof sort === 'object') ? sort : [{ createdAt: 'ASC' }];

        let Customers = await Customer.find({ where: where, limit: limit, skip: skip, sort: sort })
        return Customers;    
    },

    count: async (where) => {
        where = (typeof where === 'object') ? where : {};
        let totalCustomer  = await Customer.count(where);
        return totalCustomer;
    }
};

module.exports = CustomerService;