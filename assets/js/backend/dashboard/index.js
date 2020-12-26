class IndexDashboardBackendEKP extends BaseBackendEKP {
    constructor() {
      super();
      this.initialize();
    }
  
    initialize() {
      //DO NOT LOAD UNNESSESARY CLASS
      this.view = new ViewIndexDashboardBackendEKP(this);
    }
    
}
class ViewIndexDashboardBackendEKP {
    constructor(opts) {
      _.extend(this, opts);
      this.handleSelectionMenu();
      this.initHeightScrollbar();
    }
    initHeightScrollbar() {
      $('.js-height-scrollbar').perfectScrollbar();
    }
    handleSelectionMenu(){
        let month = $('#menuMonth').val();
        if (month != '') {
            var tableNoData = $('#tblOrder').DataTable({
                "language": {
                "url": this.langUrl
                },
                "processing": true,
                "serverSide": true,
                "ajax": "/api/v1/backend/dashboard/searchOrder?month=" + month,
                //Add column data (JSON) mapping from AJAX to TABLE
                "columns": [
                    { "data": "totalUnapproved" },
                    { "data": "totalApproved" },
                    { "data": "totalDone" },
                    { "data": "total" },
                ],
                //Define first column without order
                columnDefs: [{
                "orderable": false,
                "targets": [0, -1]
                }],
                "order": [
                [1, "asc"]
                ],
                "iDisplayLength": false,
                "aLengthMenu": [
                [20, 50, 100, -1],
                [20, 50, 100, "All"]
                ],
                //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
                //"pagingType": "numbers",
                //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                "sDom": "<'row'<'col-lg-12'tr>>",
                "bDestroy": true,
                "ordering": false
            });
        }
        $('#menuMonth').on('change', function (e) {
            let month = $(this).children('option:selected').val();;
            var table = $('#tblOrder').DataTable({
              "language": {
                "url": "/js/backend/datatable.json"
              },
              "processing": true,
              "serverSide": true,
              "ajax": "/api/v1/backend/dashboard/searchOrder?month=" + month,
              //Add column data (JSON) mapping from AJAX to TABLE
              "columns": [
                    { "data": "totalUnapproved" },
                    { "data": "totalApproved" },
                    { "data": "totalDone" },
                    { "data": "total" },
                ],
              //Define first column without order
              columnDefs: [{
                "orderable": false,
                "targets": [0, -1]
              }],
              "order": [
                [1, "asc"]
              ],
              "iDisplayLength": false,
              "aLengthMenu": [
                [20, 50, 100, -1],
                [20, 50, 100, "All"]
              ],
              //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
              //"pagingType": "numbers",
              //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
              //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
              "sDom": "<'row'<'col-lg-12'tr>>",
              "bDestroy": true,
              "ordering": false
            });
        });
    }
}