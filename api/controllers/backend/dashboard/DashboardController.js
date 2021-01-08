const moment = require('moment');

module.exports = {
    searchOrder: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchOrder => START ================================");
        let params = req.allParams();
        let currentYear = moment().format('YYYY');
        month = params.month ?  '0'+params.month : moment().format('MM');
        let arrCout = [];
        let total = await OrderService.count({
            and: 
            [{
                orderDate: {
                    contains: currentYear + "-" + month
                }}
            ]}
        );
        let totalUnapproved = await OrderService.count({and: [{
            orderDate: {
                contains: currentYear + "-" + month
            },
            status: 0
        }
        ]});
        let totalApproved = await OrderService.count({and: [{
            orderDate: {
                contains: currentYear + "-" + month
            },
            status: 1
        }
        ]});
        let totalDone = await OrderService.count({and: [{
            orderDate: {
                contains: currentYear + "-" + month
            },
            status: 2
        }
        ]});
        let totalTrash = await OrderService.count({and: [{
            orderDate: {
                contains: currentYear + "-" + month
            },
            status: 3
        }
        ]});
        let tmpData = {
            total: total,
            totalDone: totalDone,
            totalUnapproved: totalUnapproved,
            totalApproved: totalApproved,
            totalTrash: totalTrash
        }
        arrCout.push(tmpData);
        return res.ok({data: arrCout });
    },
}