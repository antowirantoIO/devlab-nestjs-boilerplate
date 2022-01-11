export enum ENUM_USER_STATUS_CODE_ERROR {
    USER_NOT_FOUND_ERROR = 5400,
    USER_EXISTS_ERROR = 5401,
    USER_IS_INACTIVE_ERROR = 5402,
    USER_EMAIL_EXIST_ERROR = 5403,
    USER_MOBILE_NUMBER_EXIST_ERROR = 5404,
    USER_PASSWORD_EXPIRED_ERROR = 5405
}

export const USER_DEFAULT_SORT = 'name@asc';
