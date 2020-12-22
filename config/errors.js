const ErrorService = {
    //PRODUCT TYPE
    PRODUCTTYPE_CODE_REQUIRED: { code: 'PRODUCTTYPE_CODE_REQUIRED', message: 'code product type is required' },
    PRODUCTTYPE_TITLE_REQUIRED: { code: 'PRODUCTTYPE_TITLE_REQUIRED', message: 'title product type is required' },
    PRODUCTTYPE_ID_REQUIRED: { code: 'PRODUCTTYPE_ID_REQUIRED', message: 'id product type is required'},
    ERR_NOT_FOUND: { code: 'ERR_NOT_FOUND', message: 'not found'},

    //BRAND
    BRAND_CODE_REQUIRED: { code: 'BRAND_CODE_REQUIRED', message: 'code brand is required' },
    BRAND_TITLE_REQUIRED: { code: 'BRAND_TITLE_REQUIRED', message: 'title brand is required' },
    BRANDID_REQUIRED: { code: 'BRAND_ID_REQUIRED', message: 'id brand is required'},

    //PRODUCT
    PRODUCT_CODE_REQUIRED: { code: 'PRODUCT_CODE_REQUIRED', message: 'code product is required' },
    PRODUCT_TITLE_REQUIRED: { code: 'PRODUCT_TITLE_REQUIRED', message: 'title product is required' },
    PRODUCT_ID_REQUIRED: { code: 'PRODUCT_ID_REQUIRED', message: 'id product is required'},

    //SUPPLIER
    SUPPLIER_NAME_REQUIRED: { code: 'SUPPLIER_NAME_REQUIRED', message: 'name supplier is required' },
    SUPPLIER_EMAIL_REQUIRED: { code: 'SUPPLIER_EMAIL_REQUIRED', message: 'email supplier is required' },
    SUPPLIER_PHONE_REQUIRED: { code: 'SUPPLIER_PHONE_REQUIRED', message: 'phone supplier is required' },
    SUPPLIER_ADDRESS_REQUIRED: { code: 'SUPPLIER_ADDRESS_REQUIRED', message: 'address supplier is required' },
    SUPPLIER_ID_REQUIRED: { code: 'SUPPLIER_ID_REQUIRED', message: 'id supplier is required'},
    
    //IMPORT
    IMPORT_CODE_REQUIRED: { code: 'IMPORT_CODE_REQUIRED', message: 'code import is required' },
    IMPORT_DATE_REQUIRED: { code: 'IMPORT_TITLE_REQUIRED', message: 'date import is required' },
    IMPORT_ID_REQUIRED: { code: 'IMPORT_ID_REQUIRED', message: 'id import is required'},

    //ORDER
    ORDER_CODE_REQUIRED: { code: 'ORDER_CODE_REQUIRED', message: 'code order is required' },
    ORDER_DATE_REQUIRED: { code: 'ORDERTITLE_REQUIRED', message: 'date order is required' },
    ORDER_ID_REQUIRED: { code: 'ORDER_ID_REQUIRED', message: 'id order is required'},

    //USER
    PASSWORD_IS_NOT_MATCH: { code: 'PASSWORD_IS_NOT_MATCH', message: 'Nhập lại mật khẩu không đúng'},
    USER_FIRSTNAME_REQUIRED: { code: 'USER_FIRSTNAME_REQUIRED', message: 'first name user is required' },
    USER_LASTNAME_REQUIRED: { code: 'USER_LASTNAME_REQUIRED', message: 'last name user is required' },
    USER_EMAIL_REQUIRED: { code: 'USER_EMAIL_REQUIRED', message: 'email user is required' },
    USER_DATEOFBIRTH_REQUIRED: { code: 'USER_DATEOFBIRTH_REQUIRED', message: 'day of birth user is required' },
    USER_PHONE_REQUIRED: { code: 'USER_PHONE_REQUIRED', message: 'phone supplier is required' },
    USER_ADDRESS_REQUIRED: { code: 'USER_ADDRESS_REQUIRED', message: 'address supplier is required' },
    USER_ID_REQUIRED: { code: 'USER_ID_REQUIRED', message: 'id user required'},

    //CUSTOMER
    CUSTOMER_NAME_REQUIRED: { code: 'CUSTOMER_NAME_REQUIRED', message: 'name customer is required' },
    CUSTOMER_EMAIL_REQUIRED: { code: 'CUSTOMER_EMAIL_REQUIRED', message: 'email customer is required' },
    CUSTOMER_PHONE_REQUIRED: { code: 'CUSTOMER_PHONE_REQUIRED', message: 'phone customer is required' },
    CUSTOMER_ADDRESS_REQUIRED: { code: 'CUSTOMER_ADDRESS_REQUIRED', message: 'address customer is required' },
    CUSTOMER_ID_REQUIRED: { code: 'CUSTOMER_ID_REQUIRED', message: 'id customer is required'},
}
module.exports = ErrorService;