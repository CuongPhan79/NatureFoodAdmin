class IndexListCustomerBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.list = new ListIndexCustomerBackendEKP();
		this.form = new FormIndexCustomerBackendEKP();
	}
}


class ListIndexCustomerBackendEKP {
	constructor(opts) {
		_.extend(this, opts);

		this.tblId = 'tblCustomer';
		this.tableObj = $('#' + this.tblId);
		this.checkAll = null;
        this.listChecked = '';
        window.dataTable = null;
		this.messages = {
			addSuccess: 'Thêm mới thành công',
			editSuccess: 'Cập nhật thành công.',
			error: 'Có lỗi xảy ra',
			deletePopup: 'Bạn chắc có muốn xóa dữ liệu này?'
		}
		this.initialize();
	}

	initialize() {
		let _this = this;
		_this.initDataTable();
		_this.handleItemActions();
	}


	
	initSweetAlert(id) {
		swal({
			title: 'Bạn có chắc muốn xóa ?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3f51b5',
			cancelButtonColor: '#ff4081',
			confirmButtonText: 'Great ',
			buttons: {
				cancel: {
					text: "Hủy",
					value: null,
					visible: true,
					className: "btn btn-danger",
					closeModal: true,
				},
				confirm: {
					text: "OK",
					value: true,
					visible: true,
					className: "btn btn-primary",
					closeModal: true
				}
			}
		}).then((value) => {
			if (value) {
				Cloud.trashCustomer.with({ ids: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
					if (err) {
						console.log(err);
						return;
					} else if (responseBody) {
						swal({
							title: 'Đã xóa !',
							icon: 'success',
							button: {
								text: "Tiếp tục",
								value: true,
								visible: true,
								className: "btn btn-primary"
							}
						}).then((value) => {
							//THEN RELOAD PAGE IF NEEDED 
							location.reload();
						})
					}
				})
			}
		});
	}

	initDataTable() {
		let _this = this;
		let params = {};
		let searchParams = new URLSearchParams(window.location.search);
		params.type = searchParams.get('type') || '0';
		//cloud success  
		window.dataTable = this.tableObj.DataTable({
			"language": {
				"url": "/js/backend/datatable.json"
			},
			"processing": true,
			"serverSide": true,
			"ajax": `/api/v1/backend/customer/search`,
			//Add column data (JSON) mapping from AJAX to TABLE
			"columns": [
                { "data": "name"},
                { "data": "gender"},
				        { "data": "emailAddress" },
                { "data": "birthday" },
                { "data": "phone" },
                { "data": "address" },
			],
			//Define first column without order
			columnDefs: [
				{
					"orderable": false,
					"targets": [ 2, 3, 4, 5]
				}
			],
			"order": [],
			"iDisplayLength": 10,
			"aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
			"pagingType": "numbers",
			"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
			"bDestroy": true,
			"initComplete": function (settings, json) {
			}
		});
	}

	handleItemActions() {
		let _this = this;

		//ONCLICK EDIT LINK
      _this.tableObj.on('click', '.edit-row', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        //get AJAX data
        Cloud.getCustomer.with({ id: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
          if (err) {
            console.log(err);
            return;
          }
          //AJAX success 
          let _data = responseBody;
          let _currentForm = window.curBackendEKP.form;
          //Render data from response to form
          _currentForm.renderFormData('edit', _data);
          $('.js-process-basic-multiple').select2();
          $('#emailAddress').attr('readonly', true);
        })
      });
      //END END ONCLICK EDIT LINK

		// ONCLICK REMOVE (TRASH) LINK
		_this.tableObj.on('click', '.remove-row', function (e) {
			let id = $(this).attr('data-id');
			_this.initSweetAlert(id);
		});
	}
}
class FormIndexCustomerBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formCustomer';
      this.formObj = $('#' + this.formId);
      this.title = $('.modal-title');
      this.input1 = $('#firstName');
      this.input2 = $('#lastName');
      this.input3 = $('#emailAddress');
      this.input4 = $('#phone');
      this.input5 = $('#address');
      this.input6 = $('#birthday');
      this.modalMenu = $("#modal-edit");
      this.originalModal = $('#modal-edit').clone();
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
          headlineAdd: 'Thêm khách hàng',
          headlineUpdate: 'Cập nhật khách hàng',
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
    }
    handleItemActions(){
      let _this = this;
      //ONCLICK ADD
      _this.btnadd.click(function(){
        let _currentForm = window.curBackendEKP.form;
        //Render data from response to form
        _currentForm.renderFormData('add', {});
        $('.js-process-basic-multiple').select2();
        $('#emailAddress').attr('readonly', false);
      })
      //END ONCLICK ADD
    }
    initModel(){
      let _this = this;
      _this.btnclsModal.click(function(){
        _this.title.html(_this.messages.headlineAdd);
        _this.input1.val("");
        window.dataTable.ajax.reload();
      })
      //_this.btnSubmit.text(_this.messages.add);
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
          selector: '#btnFormCustomer',
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
          });
          let manner = _this.formObj.attr('data-manner');
  
  
          //reset form validator
          if (manner === 'edit') {
            tmpData.id = _this.formObj.attr('data-edit-id');
            Cloud.editCustomer.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
                window.dataTable.ajax.reload();
                setTimeout(function(){
                  _this.alert.removeClass('alert-fill-success').addClass("d-none");
                }, 3000);
              }
              //cloud success
            });
          } else {
            Cloud.addCustomer.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
              if(err){
                _this.alert.removeClass('d-none').addClass("alert-fill-danger").html(_this.messages.error);
                setTimeout(function(){
                _this.alert.removeClass('alert-filldanger').addClass("d-none");
                }, 3000);
              } else {
                if (responseBody.message) {
                  _this.alert.removeClass('d-none').addClass("alert-fill-warning").html(responseBody.message);
                  setTimeout(function(){
                    _this.alert.removeClass('alert-fill-warning').addClass("d-none");
                  }, 3000);
                  return;
                }
                _this.alert.removeClass('d-none').addClass("alert-fill-success").html(_this.messages.addSuccess);
                window.dataTable.ajax.reload();
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
            if (key !== 'gender') {
              //Status is radiobuton -> no update
                _this.formObj.find('[name="' + key + '"]').val(value);
            } else {
              // Update status radiobutton
              if (value == 1) {
                _this.formObj.find('#genderMale')[0].checked = true;
                _this.formObj.find('#genderFemale')[0].checked = false;
              } else {
                _this.formObj.find('#genderMale')[0].checked = false;
                _this.formObj.find('#genderFemale')[0].checked = true;
              }
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
        _this.input6.val("");
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