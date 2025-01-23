"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const HttpError_1 = require("../errors/HttpError");
const errorHandlerMiddleware = (error, req, res, next) => {
    if (error instanceof HttpError_1.HttpError) {
        res.status(error.status).json({ message: error.message });
    }
    else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    }
    else {
        res
            .status(500)
            .json({ message: "some unknow error occured in the server" });
    }
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
