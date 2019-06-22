import codes from "./codes-loader"


const CV_STATUSES = codes.cv_status
export const CV_STATUS_NOT_STARTED = CV_STATUSES.NOT_STARTED
export const CV_STATUS_STARTED = CV_STATUSES.STARTED
export const CV_STATUS_CANCELED = CV_STATUSES.CANCELED
export const CV_STATUS_FAILED = CV_STATUSES.FAILED
export const CV_STATUS_COMPLETED = CV_STATUSES.COMPLETED


const WEB_STATUSES = codes.web_status
export const WEB_STATUS_OK = WEB_STATUSES.OK
export const WEB_STATUS_INTERNAL_SERVER_ERROR = WEB_STATUSES.INTERNAL_SERVER_ERROR
export const WEB_STATUS_BAD_REQUEST = WEB_STATUSES.BAD_REQUEST
export const WEB_STATUS_NOT_FOUND = WEB_STATUSES.NOT_FOUND
export const WEB_STATUS_FORBIDDEN = WEB_STATUSES.FORBIDDEN