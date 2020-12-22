'use strict';


const fn = {
  fetchData: async options => {
    let users = User.find(options).populate('imports');
    return users
  },
  fetchDataInOne: async options => {
    return await User.findOne(options)
  }
};

const UserService = {



  add: async options => {
    sails.log.info(
      '================================ UserService.add -> options: ================================'
    );
    sails.log.info(options);

    let newObj = await User.create(options)
      // Some other kind of usage / validation error
      .intercept('UsageError', err => {
        return 'invalid';
      })
      .fetch();
    sails.log.info(
      '================================ UserService.add -> new object: ================================'
    );
    sails.log.info(newObj);
    return newObj;
  },

  edit: async (query, params) => {
    sails.log.info(
      '================================ UserService.edit -> query, params: ================================'
    );
    sails.log.info(query);
    sails.log.info(params);

    let options = {};

    for (let key in User.attributes) {
      if (key === 'id' || key === 'createdAt' || key === 'toJSON') {
        continue;
      }

      if (params && typeof params[key] !== 'undefined') {
        options[key] = params[key];
      }
    }

    options.updatedAt = new Date().getTime();

    let editObj = await User.update(query, options).fetch();
    sails.log.info(
      '================================ UserService.edit -> edit object: ================================'
    );
    sails.log.info(editObj);

    let found = await fn.fetchDataInOne({
      id: editObj[0].id
    });

    return found;
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

    let sujects = await User.find({ where: where, limit: limit, skip: skip, sort: sort });
      return sujects;
  },

  count: async where => {
    where = typeof where === 'object' ? where : {};
    let totalUser = await User.count(where);
    return totalUser;
  },

  updateTimeUser: async (id, time) => {
    await User.update({ id: id })
      .set(time)
      .fetch();
    return await fn.fetchDataInOne({ id: id });
  },
  get: async (options) => {
    sails.log.info("================================ UserService.get -> options: ================================");
    sails.log.info(options);

    let records = await User.findOne(options);
    return records;
  },
};

module.exports = UserService;
