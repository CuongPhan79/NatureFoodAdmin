class IndexListImportBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.list = new ListIndexImportBackendEKP();
	}
}


class ListIndexImportBackendEKP {
	constructor(opts) {
		_.extend(this, opts);

		this.tblId = 'tblImport';
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
				Cloud.trashBrand.with({ ids: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
			"ajax": `/api/v1/backend/import/seacrh`,
			//Add column data (JSON) mapping from AJAX to TABLE
			"columns": [
        		{ "data": "code" },
				{ "data": "date" },
				{ "data": "userCreated" },
				{ "data": "supplier" },
				{ "data": "note" },
				{ "data": "tool" },
			],
			//Define first column without order
			columnDefs: [
				{
					"orderable": false,
					"targets": [0, 2, -3, -2, -1]
				}
			],
			"order": [],
			"iDisplayLength": 10,
			"aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
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
        Cloud.getBrand.with({ id: id }).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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