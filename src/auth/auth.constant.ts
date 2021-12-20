export enum ENUM_AUTH_STATUS_CODE_ERROR {
    AUTH_GUARD_BASIC_TOKEN_NEEDED_ERROR = 5100,
    AUTH_GUARD_BASIC_TOKEN_INVALID_ERROR = 5101,
    AUTH_GUARD_JWT_ACCESS_TOKEN_ERROR = 5102,
    AUTH_GUARD_JWT_REFRESH_TOKEN_ERROR = 5103,
    AUTH_USER_NOT_FOUND_ERROR = 5104,
    AUTH_PASSWORD_NOT_MATCH_ERROR = 5105,
    AUTH_EXPIRED_ERROR = 5106
}

export enum ENUM_AUTH_STATUS_CODE_SUCCESS {
    AUTH_LOGIN_SUCCESS = 1001
}
