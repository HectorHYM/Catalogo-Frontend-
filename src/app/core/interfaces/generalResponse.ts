export enum ResponseCode { Ok, NoContent, BadRequest, NotFound, ServerError };

export interface GeneralResponse<T = any>{
    data: T | null
    msg: string
    success: boolean
    code: ResponseCode
}