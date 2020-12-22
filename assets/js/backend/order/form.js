class IndexFormOrderBackendEKP extends BaseBackendEKP {
	constructor() {
		super();
		this.initialize();
	}

	initialize() {
		//DO NOT LOAD UNNESSESARY CLASS
		//Init form + list if page have BOTH  
		this.form = new FormOrderBackendEKP();
	}
}

class FormOrderBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.formId = 'formOrder';
      this.formObj = $('#' + this.formId);
      this.btnadd = $('#btnAdd');
      this.coutItemTuition = 1;
      if (this.formObj.length) {
        this.headline = this.formObj.closest('.panel').find('.panel-title');
        this.alert = this.formObj.find('.alert');
        this.spinner = this.formObj.find('.spinner');
        this.btnSubmit = this.formObj.find('button[type="submit"]');
        this.btnReset = this.formObj.find('button[type="reset"]');
  
        this.messages = {
            addSuccess: 'Thêm mới thành công',
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
    // removeRow() {
    //     let _this = this;
    //     $("#formImport").on('click', '.removeItem', function () {
    //       let index = $(this).attr('data-index');
    //       //$('#delSlotItem' + index).click(function () {
    //         $('#itemProduct' + index).remove();
    //       //});
    //       _this.coutItemTuition--;
    //     })
    // }
    initialize() {
      let _this = this;
      
      _this.addRowItemTuition();
      $("#customerBox").select2();
      _this.discountChange();
      _this.initValidation();
    }
    async discountChange() {
      let _this = this;
      await $("#discount").change( function() {
        _this.initDiscount();
        _this.initPay();
      })
     
    }
    initDiscount() {
      var discount = $("#discount").val();
      var totalPrice = $("#totalPrice").html();
      var status = 1;
      if(status == 1) {
        var totalDiscount = parseInt(totalPrice) * parseInt(discount) / 100;
      }
      $("#discountval").html(totalDiscount);
    }
    initPay() {
      var discount = $("#discountval").html();
      var totalPrice = $("#totalPrice").html();
      var status = 1;
      if(status == 1) {
        var Pay = parseInt(totalPrice) - parseInt(discount);
      }
      $("#pay").html(Pay);
    }
    addRowItemTuition() {
      let _this = this;
        let index = 1;
        $("#addItemTuition").click(async function () {
          $("#rowItemTuition").append(
            `<div id="itemProduct${index}" name="itemProduct${index}" class="row mb-2">
                <div class="col-md-6">
                    <select id="titleSlotItem${index}" name="titleSlotItem${index}" class="form-control js-process-basic-single  select2-single"
                        data-placeholder="<%= __('Choose') %>" single="single" >
                    </select>
                </div>
                <div class="col-md-4">
                  <input type="number" class="form-control" name="numberSlotItem${index}" id="numberSlotItem${index}" placeholder="Số lượng"
                    data-fv-notempty="true" data-fv-notempty-message="Vui lòng nhập chi phí !"/>
                </div>
                <div class="col-md-2">
                  <div class="btn-delItemTuition">
                    <a id="delSlotItem${index}" data-index="${index}" class="removeItem" href="javascript:void(0)">Xoá</a>
                  </div>
                </div>
              </div>`
          );
          await $.ajax({url: "/api/v1/backend/product/search2", success: async function(result){
            for(let i =0; i< result.data.length;i++) {
              $("#titleSlotItem"+index).append(
                  `<option value="${result.data[i].id}"> 
                    ${result.data[i].title}  (${result.data[i].price})
                  </option>`
              );
              $("#titleSlotItem"+index).select2();
            }
          }});
          await $("#delSlotItem"+index).click(async function() {
            let index = $(this).attr('data-index');
              $('#itemProduct' + index).remove();
              
            var totalPrice = 0;
            for(let j = 1; j<index; j++){
              let idItem = $("#titleSlotItem"+j).children("option:selected").val();
              let priceItem = $("#numberSlotItem"+j).val();
              if(priceItem){
                await $.ajax({url: `/api/v1/backend/product/get`,data: {
                  id: idItem
              }, success: function(result){
                  let entryPrice = result.entryPrice
                  let TentryPrice = parseInt(entryPrice) * parseInt(priceItem)
                  totalPrice = parseInt(totalPrice) +  parseInt(TentryPrice);
                }})
                
              }
              else{
                totalPrice = 0;
              }
            }
            
            $("#totalPrice").html(totalPrice);
            _this.initDiscount();
            _this.initPay();
            _this.coutItemTuition--;
          });
          await $("#numberSlotItem"+index).change(async function() {
            var totalPrice = 0;
            for(let j = 1; j<index; j++){
              let idItem = $("#titleSlotItem"+j).children("option:selected").val();
              let priceItem = $("#numberSlotItem"+j).val();
              if(priceItem){
                await $.ajax({url: `/api/v1/backend/product/get`,data: {
                  id: idItem
              }, success: function(result){
                  let entryPrice = result.entryPrice
                  let TentryPrice = parseInt(entryPrice) * parseInt(priceItem)
                  totalPrice = parseInt(totalPrice) +  parseInt(TentryPrice);
                }})
                
              }
              else{
                totalPrice = 0;
              }
            }
            
            $("#totalPrice").html(totalPrice);
            _this.initDiscount();
            _this.initPay();
          })
          _this.coutItemTuition++;
          index++;
        });
        
    }
    initValidation() {
      let _this = this;
      _this.formObj.formValidation({
        button: {
          selector: '#btnFormOrder',
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
          let slotItems = [];
          _.each(formData, (item) => {    
            if (_this.coutItemTuition > 0) {
              let objOrder = {};
              for (let i = 0; i < _this.coutItemTuition; i++) {
                if (item.name == 'titleSlotItem' + i) {
                    objOrder.id = i;
                    objOrder.product = item.value;
                    slotItems.push(objOrder);
                }
                if (item.name == 'numberSlotItem' + i) {
                  let pos = slotItems.findIndex(item => item.id == i)
                  slotItems[pos].number = parseInt(item.value);
                }
              }
            }       
            tmpData[item.name] = item.value;
          });
          tmpData.slotItems = slotItems;
          var totalPrice = parseInt($("#totalPrice").html());
          var discountval = parseInt($("#discountval").html());
          var pay = parseInt($("#pay").html());
          tmpData.totalPrice = totalPrice;
          tmpData.discountval = discountval;
          tmpData.pay = pay;
          //CALL AJAX ADD ORDER
          Cloud.addOrder.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
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
  
  
        })
    }
        

  
} 