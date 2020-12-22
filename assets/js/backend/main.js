// Avoid `console` errors in browsers that lack a console.
(function ($) {
    var method;
    var noop = function () { };
    var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
  
    while (length--) {
      method = methods[length];
  
      // Only stub undefined methods.
      if (!console[method]) {
        console[method] = noop;
      }
    }
  
}(jQuery));
  var ESTOREPRO = ESTOREPRO || {};
  //global variable for current backend instance 
var curBackendEKP;

$(document).ready(function () {
    ESTOREPRO.login();
    ESTOREPRO.initialize();
});
ESTOREPRO.login = function () {
    if ($('#frmLogin').length) {
        $('#frmLogin').validator().on('submit', (e) => {
            if (e.isDefaultPrevented()) {
                //nothing
            } else {
                e.preventDefault();
                //looks good
                console.log('[SUBMIT][START] ----- frmLogin -----');
                //prepare data
                let formData = $('#frmLogin').serializeArray();
                let tmpData = {};
                _.each(formData, (item) => {
                tmpData[item.name] = item.value;
                });
                //sign up start
                Cloud.login.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                if (err) {
                    //err from server responde
                    if (err.code == 'badCombo') {
                    $('.alert').removeClass('hidden');
                    } else if (err.code == 'accountNotReady') {
                    $('#accountNotActive').removeClass('hidden');
                    } else {
                    $('#loginFail').addClass('hidden');
                    $('#otherError').removeClass('hidden');
                    $('#accountNotActive').addClass('hidden');
                    }
                    return;
                }
                //cloud success
                console.log('----- frmLogin ----- [SUBMIT][END]');
                if (responseBody.user.isAdmin == true) {
                    window.location = 'admin/dashboard';
                } else {
                    window.location = 'dashboard';
                }
                });
            }
        });
    }
};

ESTOREPRO.initialize = function () {
    console.log(EKPAction);
    var pathName = EKPAction;
    switch (pathName) {
        case 'backend/producttype/index':
            curBackendEKP = new IndexListproductTypeBackendEKP();
            break;
          //------------------------------------------------
        case 'backend/brand/index':
            curBackendEKP = new IndexListbrandBackendEKP();
            break;
        //------------------------------------------------   
        case 'backend/product/index':
            curBackendEKP = new IndexListProductBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/product/form':
            curBackendEKP = new IndexFormProductBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/supplier/index':
            curBackendEKP = new IndexListSupplierBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/import/index':
            curBackendEKP = new IndexListImportBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/import/form':
            curBackendEKP = new IndexFormImportBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/account/view-edit-profile':
            curBackendEKP = new IndexFormAccountBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/user/index':
            curBackendEKP = new IndexListUserBackendEKP();
            break;
        //------------------------------------------------
        case 'backend/customer/index':
            curBackendEKP = new IndexListCustomerBackendEKP();
            break;
        //------------------------------------------------ 
         case 'backend/order/form':
            curBackendEKP = new IndexFormOrderBackendEKP();
            break;
        //------------------------------------------------ 
        case 'backend/order/index':
            curBackendEKP = new IndexListOrderBackendEKP();
            break;
        //------------------------------------------------ 
    }      
}