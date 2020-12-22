class IndexFormProductBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.form = new FormIndexProductBackendEKP();
	}
}
class FormIndexProductBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formProduct';
      this.formObj = $('#' + this.formId);
      this.title = $('.modal-title');
      this.btnclsModal = $('#btnCloseModal');
      this.tblId = 'tblTitle';
      this.btnadd = $('#btnAdd');
      this.tableObj = $('#' + this.tblId);
      if (this.formObj.length) {
        this.headline = this.formObj.closest('.panel').find('.panel-title');
        this.alert = this.formObj.find('.alert');
        this.spinner = this.formObj.find('.spinner');
        this.btnSubmit = this.formObj.find('button[type="submit"]');
        this.btnReset = this.formObj.find('button[type="reset"]');
  
        this.messages = {
          headlineAdd: 'Thêm sản phẩm',
          headlineUpdate: 'Cập nhật sản phẩm',
          addSuccess: 'Thêm mới thành công',
          editSuccess: 'Cập nhật thành công.',
          error: 'Có lỗi xảy ra',
  
          add: 'Thêm mới',
          update: 'Cập nhật',
          cancel: 'Huỷ',
        }

        this.initialize();
      }
    }
    initialize() {
      let _this = this;
      _this.initValidation();
      _this.clickHandle();
      //_this.initModel();
      _this.handleItemActions();
      _this.initUpload();
      _this.initUploadFile();
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
              Cloud.uploadProductThumbnail.with(_data).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
    initUpload() {
      $('.dropify').dropify();
    }
    handleItemActions(){
      let _this = this;
      //ONCLICK ADD
        //Render data from response to form
        $('#brandbox').select2();
        $('#productTypebox').select2();
      //END ONCLICK ADD
    }
    clickHandle() {
      $("#userPermissionAdd").click(function (event) {  
        if($('#userPermissionAdd').is(':checked')){
          $('#userPermissionAdd').prop('checked',false);
        }else{
          $(this).prop('checked',true); 
        }
      });
    }
    initForm() {
      let _this = this;
  
    }
    initValidation() {
      let _this = this;
      _this.formObj.formValidation({
        button: {
          selector: '#btnFormProduct',
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
            if (item.name == 'Devicegroup') {
              if (tmpData[item.name] == undefined) {
                tmpData[item.name] = [item.value];
              } else {
                tmpData[item.name].push(item.value);
              }
            } else {
              tmpData[item.name] = item.value;
            }
            if (_this.uploadedFiles) {
              tmpData['thumbnail'] = _this.uploadedFiles;
            }
          });
          let manner = _this.formObj.attr('data-manner');
  
  
          //reset form validator
          if (manner === 'edit') {
            Cloud.editProduct.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
              if(err){
                _this.alert.removeClass('d-none').addClass("alert-fill-danger").html(_this.messages.error);
                setTimeout(function(){
                  _this.alert.removeClass('alert-fill-danger').addClass("d-none");
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
                
                setTimeout(function(){
                  _this.alert.removeClass('alert-fill-success').addClass("d-none");
                }, 3000);
              }
              //cloud success
            });
          } else {
            Cloud.addProduct.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
                _this.alert.removeClass('d-none').addClass("alert-fill-success").html(_this.messages.addSuccess);
                
                setTimeout(function(){
                  _this.alert.removeClass('alert-fill-success').addClass("d-none");
                }, 3000);
              }
              //cloud success
            });
  
  
          }
          //THEN RELOAD TABLE IF NEEDED 
          // window.curBackendEKP.list.initDataTable();
          console.log('----- FORM User ----- [SUBMIT][END]');
        });
        
    }
  
    //Function render FORM DATA from AJAX
    //@param {String} status Form status: add or edit
    //@param {String} datas JSON data from AJAX
    renderFormData(status, datas) {
      let _this = this;
      if (status && status === 'edit') {
        _this.formObj.attr('data-manner', 'edit');
        if (datas) {
          //map id -> form to edit
          _this.formObj.attr('data-edit-id', datas.id);
          //Update form fields (input + textarea) base on name of field
          _.each(datas, (value, key) => {
            if (key !== 'status') {
              //Status is radiobuton -> no update
                _this.formObj.find('[name="' + key + '"]').val(value);
            } else {
                // Update status radiobutton
                if (value == 1) {
                  _this.formObj.find('#statusActive')[0].checked = true;
                  _this.formObj.find('#statusDraft')[0].checked = false;
                } else {
                  _this.formObj.find('#statusActive')[0].checked = false;
                  _this.formObj.find('#statusDraft')[0].checked = true;
                }
            }
            if(key == 'productType'){
              _this.formObj.find('#productTypebox').val(value.id);
            }
            if(key == 'brand'){
              _this.formObj.find('#brandbox').val(value.id);
            }
          });
    
          //Handle static data like title, headline, button when change from add to edit and otherwise
          
        }
      } else {
        _this.formObj.attr('data-manner', 'add');
        //let _currentForm = window.curBackendEKP.form
        _this.input1.val("");
        _this.input2.val("");
        _this.input3.val("");
        _this.input4.val("");
        _this.input5.val("");
      }
      
      //reset form validator
      if (status === 'edit') {
        _this.headline.text(_this.messages.headlineUpdate);
        _this.title.html(_this.messages.headlineUpdate);
        _this.btnSubmit.text(_this.messages.update);
      } else {
        _this.headline.text(_this.messages.headlineAdd);
        _this.title.html(_this.messages.headlineAdd);
        _this.btnSubmit.text(_this.messages.add);
      }
      //End handle static data
      
    }
  
} 