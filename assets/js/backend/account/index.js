class IndexFormAccountBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.form = new FormIndexAccountBackendEKP();
	}
}

class FormIndexAccountBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formProfile';
      this.formObj = $('#' + this.formId);
      this.btnadd = $('#btnAdd');
      this.coutItemTuition = 1;
      if (this.formObj.length) {
        this.headline = this.formObj.closest('.panel').find('.panel-title');
        this.alert = this.formObj.find('.alert');
        this.btnSubmit = this.formObj.find('button[type="submit"]');
        this.btnReset = this.formObj.find('button[type="reset"]');
  
        this.messages = {
          headlineUpdate: 'Cập nhật hồ sơ',
          editSuccess: 'Cập nhật thành công.',
          error: 'Có lỗi xảy ra',
          add: 'Thêm mới',
          update: 'Cập nhật',
          cancel: 'Huỷ',
        }
        //this.removeRow();
        this.initialize();
        
      }
    }
    initialize() {
      let _this = this;
        _this.initValidation();
        _this.initUpload();
        _this.initUploadFile();
    }
    initUpload() {
        $('.dropify').dropify();
    }

    initValidation() {
      let _this = this;
      _this.formObj.formValidation({
        button: {
          selector: '#btnFormProfile',
          disabled: 'disabled'
        },
        fields: {
          //Can combine both html5 mode and js mode
          //Refer: http://formvalidation.io/examples/attribute/
          /*alias: {
            validators: {
              notEmpty: {
                message: 'The title is required and cannot be empty'
              }
            }
          },*/
        },
        err: {
          clazz: 'invalid-feedback'
        },
        control: {
          // The CSS class for valid control
          valid: 'is-valid',
  
          // The CSS class for invalid control
          invalid: 'is-invalid'
        },
        row: {
          invalid: 'has-danger'
        },
        onSuccess: function (e) {
          //e.preventDefault();
          //console.log('FORM can submit OK');
        }
      })
        .on('success.form.fv', function (e) {
          // Prevent form submission
          e.preventDefault();
          console.log('----- FORM USER ----- [SUBMIT][START]');
          let $form = $(e.target);
          let formData = $form.serializeArray();
          let tmpData = {};
          _.each(formData, (item) => {         
            tmpData[item.name] = item.value;
            if (_this.uploadedFiles) {
              tmpData['thumbnail'] = _this.uploadedFiles;
            }
          });
          tmpData.id = _this.formObj.attr('data-id');
          //CALL AJAX ADD IMPORT
          Cloud.editProfile.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
            if(err){
              _this.alert.removeClass('d-none').addClass("alert-fill-danger").html(_this.messages.error);
              setTimeout(function(){
              _this.alert.removeClass('alert-filldanger').addClass("d-none");
              }, 3000);
            }else {
              if (responseBody.message) {
                _this.alert.removeClass('d-none').addClass("alert-fill-warning").html(responseBody.message);
                setTimeout(function(){
                  _this.alert.removeClass('alert-fill-warning').addClass("d-none");
                }, 3000);
                return;
              }
              _this.alert.removeClass('d-none').addClass("alert-fill-success").html(_this.messages.editSuccess);
              window.dataTable.ajax.reload();
              setTimeout(function(){
                _this.alert.removeClass('alert-fill-success').addClass("d-none");
              }, 3000);
            }
            //cloud success
          });
  
  
        })
    }
        
    initUploadFile() {
      let _this = this;
  
      let inputFiles = _this.formObj.find('[type=file]');
      if (inputFiles.length) {
        if (_this.uploadedFiles == undefined) {
          _this.uploadedFiles = null;
        }
        inputFiles.each((i, input) => {
          $(input).on('change', (e) => {
            let _file = e.currentTarget.files[0];
            let _ext = _this.getFileExtension(_file, ['.png', '.jpg', '.jpeg', '.gif']);
            if (_file && _this.checkValidFile(_file, ['.png', '.jpg', '.jpeg', '.gif'])) {
              let _data = {
                thumbnail: _file,
                ext: _ext
              };
              Cloud.uploadUserThumbnail.with(_data).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                if (err) {
                  console.log(err);
                  //_this.error.removeClass('hidden');
                  return;
                }
                //save thumb data to object uploadedFiles
                console.log(responseBody);
                _this.uploadedFiles = responseBody;
                
              })
              let _input = $(e.currentTarget);
              _input.parents('.fileinput').parent().prev().addClass('loading');
            } else if (_file != undefined) {
              $(e.currentTarget).parents('.fileinput').find('.has-error').html('Validation.Message.Extension');
            } else {
              $(e.currentTarget).parents('.fileinput').find('.has-error').html('');
            }
          });
        });
      }
    }
    checkValidFile(file, _ext) {
      let _this = this;
      let valid = false;
      _.each(_ext, (ext, i) => {
        // file = {
        //   lastModified: 1521080262000,
        //   name: "icon-clock.png",
        //   size:1882,
        //   type: "image/png",
        //   webkitRelativePath: ""
        // }
        if (file.name.indexOf(ext) != -1) {
          valid = true;
        }
      });
      return valid;
    }
    getFileExtension(file, _ext) {
      let _this = this;
      let pos = '';
      _.each(_ext, (ext, i) => {
        if (file.name.indexOf(ext) != -1) {
          pos = ext;
        }
      });
      return pos;
    }

  
} 