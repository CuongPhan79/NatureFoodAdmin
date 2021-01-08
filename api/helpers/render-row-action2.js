module.exports = {

    friendlyName: 'Generate default data object',
    description: 'Generate default data object',
  
    inputs: {
      object: {
        type: 'json',
        description: 'Object active',
        required: true
      }
    },
    exits: {
      success: {}
    },
    fn: async function (inputs, exits) {
    let jsonObject = inputs.object;
    let result = "";
    if(jsonObject.status == 0) {
        result=  `<div class="btn-group-action">				
        <div class="btn-group pull-right">
          <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            <i class="icon-caret-down"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <a href="/backend/order/detail/${jsonObject.id}" data-id="${jsonObject.id}" class="change-detail-row">
                <i class="mdi mdi mdi-calendar"></i> Chi tiết
              </a>  
            </li>
            <li>
              <a href="javascript:void(0);" data-id="${jsonObject.id}" class="change-status-row">
                <i class="mdi mdi-check"></i> Duyệt
              </a>
            </li>
            <li>
              <a href="javascript:void(0);" data-id="${jsonObject.id}" class="change-status-row1">
                  <i class="mdi mdi-check"></i> Hủy đơn
              </a>
            <li>
          </ul>
        </div>
      </div>`
    } else if(jsonObject.status == 1) {
        result=  `<div class="btn-group-action">				
        <div class="btn-group pull-right">
          <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            <i class="icon-caret-down"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <a href="/backend/order/detail/${jsonObject.id}" data-id="${jsonObject.id}" class="change-detail-row">
                <i class="mdi mdi mdi-calendar"></i> Chi tiết
              </a>  
            </li>
            <li>
              <a href="javascript:void(0);" data-id="${jsonObject.id}" class="change-status-row">
                <i class="mdi mdi-briefcase-check"></i> Hoàn thành
              </a>
            </li>
          </ul>
        </div>
      </div>`
    } else  {
        result=  `<div class="btn-group-action">				
        <div class="btn-group pull-right">
          <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
            <i class="icon-caret-down"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <a href="/backend/order/detail/${jsonObject.id}" data-id="${jsonObject.id}" class="change-detail-row">
                <i class="mdi mdi mdi-calendar"></i> Chi tiết
              </a>  
            </li>
          </ul>
        </div>
      </div>`
    }
      return exits.success(result);
    }
  };
  