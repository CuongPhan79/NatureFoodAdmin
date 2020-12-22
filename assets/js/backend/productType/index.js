class IndexListproductTypeBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.list = new ListIndexProductTypeBackendEKP();
		this.form = new FormIndexProductTypeBackendEKP();
	}
}


class ListIndexProductTypeBackendEKP {
	constructor(opts) {
		_.extend(this, opts);

		this.tblId = 'tblproductType';
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
		_this.initMoreAction();
		_this.initCheckAll();
	}


	getEventTarget(e) {
		e = e || window.event;
		return e.target || e.srcElement;
	}

	initCheckedList() {
		let _this = this;
		$('.js-checkbox-item').on("click", (e) => {
			let target = _this.getEventTarget(e);
			if (target.checked) {
				_this.listChecked = _this.listChecked + target.defaultValue + ';';
				console.log('_this.listChecked', _this.listChecked);
			} else {
				let str = target.defaultValue + ';';
				let result = _this.listChecked.replace(str, '');
				_this.listChecked = result;
				console.log('_this.listChecked', _this.listChecked);
			}
		});
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
				Cloud.trashProductType.with({ ids: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
		params.status = searchParams.get('status') || '1';
		//cloud success  
		window.dataTable = this.tableObj.DataTable({
			"language": {
				"url": "/js/backend/datatable.json"
			},
			"processing": true,
			"serverSide": true,
			"ajax": `/api/v1/backend/productType/search?status=${params.status}`,
			//Add column data (JSON) mapping from AJAX to TABLE
			"columns": [
        { "data": "id" },
        { "data": "code" },
				{ "data": "title" },
				{ "data": "description" },
				{ "data": "status" },
				{ "data": "tool" },
			],
			//Define first column without order
			columnDefs: [
				{
					"orderable": false,
					"targets": [0, -3, -2, -1]
				}
			],
			"order": [],
			"iDisplayLength": 10,
			"aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "Tất cả"]],
			//"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
			"pagingType": "numbers",
			"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
			"bDestroy": true,
			"initComplete": function (settings, json) {
				_this.initCheckedList();
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
        Cloud.getProductType.with({ id: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
        })
      });
      //END END ONCLICK EDIT LINK

		// ONCLICK REMOVE (TRASH) LINK
		_this.tableObj.on('click', '.remove-row', function (e) {
			let id = $(this).attr('data-id');
			_this.initSweetAlert(id);
		});
	}

	initMoreAction() {
		let _this = this;
		let btnTrash = $('.dropdown-menu .act-trash-group');

		btnTrash.on('click', (e) => {
			e.preventDefault();
			let ids = '';
			if (_this.checkAll.value != '') {
				ids = _this.checkAll.value;
				_this.initSweetAlert(ids);
			} else if(_this.listChecked != '') { 
				ids = _this.listChecked.slice(0, -1);
				_this.initSweetAlert(ids);
			} else {
			swal("Vui lòng chọn mục cần thao tác !")
			};
		});
	}

	initCheckAll() {
		this.checkAll = new CheckBoxBackendEKP({
			isChkAll: true,
			selector: '#js-check-all',
			childSelector: '.js-checkbox-item',
			onChange: function (e, value) {
				console.log("===========================ONCHANGE SELECT ELEMENT============================");
				console.log(value);
			}
		});
	}
}
class FormIndexProductTypeBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formProductType';
      this.formObj = $('#' + this.formId);
      this.title = $('.modal-title');
      this.input1 = $('#code');
      this.input2 = $('#title');
      this.input3 = $('#description');
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
          headlineAdd: 'Thêm loại sản phẩm',
          headlineUpdate: 'Cập nhật loại sản phẩm',
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
          selector: '#btnFormProductType',
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
            Cloud.editProductType.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
            Cloud.addProductType.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
            if (key !== 'status') {
              //Status is radiobuton -> no update
                _this.formObj.find('[name="' + key + '"]').val(value);
            } else {
                // Update status radiobutton
                if (value == 1) {
                  _this.formObj.find('#statusActive')[0].checked = true;
                } else {
                  _this.formObj.find('#statusActive')[0].checked = false;
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