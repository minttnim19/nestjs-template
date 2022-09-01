// import { HttpException, Injectable } from '@nestjs/common'
// import { HttpService } from '@nestjs/axios'
// import { Errors } from '@interfaces/errors.interfaces'
// import { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { catchError, lastValueFrom, map, retry } from 'rxjs'
// import { URL } from 'url'
// import { GraylogService } from '@shared/graylog/graylog.service'

// @Injectable()
// export class ProviderService {
//   constructor(private httpService: HttpService, private logger: GraylogService) {}

//   async get<T>(url: string, configs?: AxiosRequestConfig, loggingName?: string): Promise<T> {
//     loggingName = `${loggingName}[GET]`
//     const { params } = configs
//     this.logger.loggingRequest(loggingName, url, params)
//     const result: T = await lastValueFrom<T>(
//       this.httpService.get(url, configs).pipe(
//         map((res: AxiosResponse) => res.data),
//         retry(3),
//         catchError(async (e) => {
//           const errors: Errors = await this.errorResponse<AxiosRequestConfig>(e.response, url, configs, loggingName)
//           throw new HttpException(errors, errors.errors.status_code)
//         }),
//       ),
//     )
//     this.logger.loggingResponse(loggingName, url, params, result)
//     return result
//   }

//   async post<T0, T1>(url: string, data: T1, configs?: AxiosRequestConfig, loggingName?: string): Promise<T0> {
//     loggingName = `${loggingName}[POST]`
//     this.logger.loggingRequest(loggingName, url, data)
//     const result: T0 = await lastValueFrom<T0>(
//       this.httpService.post(url, data, configs).pipe(
//         map((res: AxiosResponse) => res.data),
//         retry(3),
//         catchError(async (e) => {
//           const errors: Errors = await this.errorResponse<T1>(e.response, url, data, loggingName)
//           throw new HttpException(errors, errors.errors.status_code)
//         }),
//       ),
//     )
//     this.logger.loggingResponse(loggingName, url, data, result)
//     return result
//   }

//   async delete<T>(url: string, configs?: AxiosRequestConfig, loggingName?: string): Promise<T> {
//     loggingName = `${loggingName}[DELETE]`
//     const { params } = configs
//     this.logger.loggingRequest(loggingName, url, params)
//     const result: T = await lastValueFrom<T>(
//       this.httpService.delete(url, configs).pipe(
//         map((res: AxiosResponse) => res.data),
//         retry(3),
//         catchError(async (e) => {
//           const errors: Errors = await this.errorResponse<AxiosRequestConfig>(e.response, url, configs, loggingName)
//           throw new HttpException(errors, errors.errors.status_code)
//         }),
//       ),
//     )
//     this.logger.loggingResponse(loggingName, url, params, result)
//     return result
//   }

//   async put<T0, T1>(url: string, data: T1, configs?: AxiosRequestConfig, loggingName?: string): Promise<T0> {
//     loggingName = `${loggingName}[PUT]`
//     this.logger.loggingRequest(loggingName, url, data)
//     const result: T0 = await lastValueFrom<T0>(
//       this.httpService.put(url, data, configs).pipe(
//         map((res: AxiosResponse) => res.data),
//         retry(3),
//         catchError(async (e) => {
//           const errors: Errors = await this.errorResponse<T1>(e.response, url, data, loggingName)
//           throw new HttpException(errors, errors.errors.status_code)
//         }),
//       ),
//     )
//     this.logger.loggingResponse(loggingName, url, data, result)
//     return result
//   }

//   async patch<T0, T1>(url: string, data: T1, configs?: AxiosRequestConfig, loggingName?: string): Promise<T0> {
//     loggingName = `${loggingName}[PATCH]`
//     this.logger.loggingRequest(loggingName, url, data)
//     const result: T0 = await lastValueFrom<T0>(
//       this.httpService.patch(url, data, configs).pipe(
//         map((res: AxiosResponse) => res.data),
//         retry(3),
//         catchError(async (e) => {
//           const errors: Errors = await this.errorResponse<T1>(e.response, url, data, loggingName)
//           throw new HttpException(errors, errors.errors.status_code)
//         }),
//       ),
//     )
//     this.logger.loggingResponse(loggingName, url, data, result)
//     return result
//   }

//   private async errorResponse<T>(errors: any, url: string, configs?: T, loggingName?: string): Promise<Errors> {
//     const httpStatus = errors?.status || 503
//     const hostName = new URL(url.replace('undefined', 'http://undefined/'))
//     const errorMessage = errors?.data || {
//       errors: {
//         status_code: parseInt(httpStatus, 10),
//         message: `Unable to connect to ${hostName.host}`,
//       },
//     }
//     // TODO In line, U can improve add logging `errors?.data`
//     const statusCode: number = parseInt(httpStatus.toString().substring(0, 3), 10)
//     this.logger.loggingError(loggingName, url, configs, errorMessage, statusCode)
//     return {
//       errors: {
//         status_code: statusCode,
//         message: `${errorMessage?.errors?.message ?? errorMessage?.error ?? 'Something went wrong.'} [${httpStatus}]`,
//         path: `${hostName.href}`,
//         errors: errorMessage?.errors?.errors,
//       },
//     }
//   }

//   // private loggingRequest(configs?: AxiosRequestConfig): LoggingRequest {
//   //   const { params, data } = configs
//   //   return { ...params, ...data }
//   // }
// }
