/* Format Response */
const sendResponse = (res, statusCode = 200, message = 'success', data = null) => {
    return res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data,
    });
};

/* Response Success */
const responseSuccess = (res, data = null, message = 'success', status = 200) => {
    return sendResponse(res, status, message, data);
};

/* Response Created */
const responseCreated = (res, data = null, message = 'created', status = 201) => {
    return sendResponse(res, status, message, data);
};

/* Response Bad Request */
const responseBadRequest = (res, message = 'bad request', status = 400) => {
    return sendResponse(res, status, message, null);
};

/* Response Unauthorized */
const responseUnauthorized = (res, message = 'unauthorized', status = 401) => {
    return sendResponse(res, status, message, null);
};

/* Response Server Error */
const responseServerError = (res, message = 'internal server error', status = 500) => {
    return sendResponse(res, status, message, null);
};

module.exports = {
    responseSuccess,
    responseCreated,
    responseBadRequest,
    responseUnauthorized,
    responseServerError
};
