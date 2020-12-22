let fs = require('file-system');
let moment = require('moment');

module.exports = {
  
  
  friendlyName: 'Upload file to folder',
  description: 'Upload file to folder',

  inputs: {
    req: {
      type: 'ref'
    },
    file: {
      type: 'string'
    },
    dest: {
      type: 'string'
    },
    fileName: {
      type: 'string'
    }
  },

  exits: {
    success: {},
    cannotupload: {
      description: 'Could not upload file.'
    }
  },
  
  fn: async function (inputs, exits) {
    
    let fileEl = inputs.file;
    let uploadConfig = sails.config.custom.UPLOAD;
    //make dir current YYYY/MM/DD
    fs.mkdir(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM'));
    fs.mkdir(require('path').resolve(uploadConfig.PATH_FOLDER2, 'assets/uploads/') + '/' + moment().format('YYYY/MM'));
    let dest = require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM');
    let dest2 = require('path').resolve(uploadConfig.PATH_FOLDER2, 'assets/uploads/') + '/' + moment().format('YYYY/MM');
    await inputs.req.file(fileEl).upload({
      // option
      maxBytes: 10000000,
      dirname: dest,
      dirname: dest2,
      // saveAs: inputs.fileName,
      // option
    }, async function whenDone(err, files) {
      if (err) throw 'cannotupload';
      
      return exits.success(files);
    });
  }
};