const sendResponse = (res, statusCode = 200, message = 'success', data = null) => {
    return res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data,
    });
};

const responseSuccess = (res, data = null, message = 'success', status = 200) => {
    return sendResponse(res, status, message, data);
};

const responseCreated = (res, data = null, message = 'created', status = 201) => {
    return sendResponse(res, status, message, data);
};

const responseBadRequest = (res, message = 'bad request', status = 400) => {
    return sendResponse(res, status, message, null);
};

const responseUnauthorized = (res, message = 'unauthorized', status = 401) => {
    return sendResponse(res, status, message, null);
};

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
