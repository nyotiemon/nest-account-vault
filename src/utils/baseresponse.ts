import { HttpException } from "@nestjs/common";

export class BaseResponse<T> {
    statusCode: number;

    message?: string;

    payload: T;

    IsError(): boolean {
        if (this.statusCode >= 300) {
            return true
        }
        return false
    }

    AsException(): HttpException {
        return new HttpException(this.message, this.statusCode)
    }

    static CreateAsSuccess<T>(statusCode: number, payload: T): BaseResponse<T> {
        let result = new BaseResponse<T>();
        result.statusCode = statusCode;
        result.payload = payload;

        return result
    }

    static CreateAsError<T>(statusCode: number, message: string): BaseResponse<T> {
        let result = new BaseResponse<T>();
        result.statusCode = statusCode;
        result.message = message;

        return result
    }
}