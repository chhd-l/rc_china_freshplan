/* tslint:disable */
/* eslint-disable */
/**
 * RC中国-爱宠有卡
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    Store,
} from './';

/**
 * 
 * @export
 * @interface Account
 */
export interface Account {
    userName: string;
    phone: string;
    isPhoneVerified: boolean;
    password: string;
    passwordSalt: string;
    isBlocked: boolean;
    store: Store;
}

