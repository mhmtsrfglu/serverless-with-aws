import {
    QueryCommand, UpdateCommand, PutCommand
} from "@aws-sdk/lib-dynamodb";
import { RECORD_TYPE } from "../../common/constants";
import { getDate, getDateTime } from "../helpers";
import client from "../db";
import { IOrder, ORDER_STATUS } from "../../common/interfaces";

const getOldOrdersCommand = async () => {
    try {
        return await client.send(new QueryCommand({
            TableName: process.env.ORDER_TABLE,
            IndexName: "order-table-item-type-gsi",
            KeyConditionExpression:
                "recordType = :itemType",
            FilterExpression:
                "#deliveryDate < :deliveryDate",
            ExpressionAttributeNames: {
                "#deliveryDate": "deliveryDate",
            },
            ExpressionAttributeValues: {
                ":deliveryDate": getDate(),
                ":itemType": RECORD_TYPE
            },
        }));
    } catch (error) {
        throw error
    }
}

const updateOrderStatusByOrderIdCommand = async (orderId: string, orderStatus: ORDER_STATUS) => {
    try {
        return await client.send(new UpdateCommand({
            TableName: process.env.ORDER_TABLE,
            Key: {
                id: orderId,
            },
            UpdateExpression: "set orderStatus = :orderStatus, updatedAt=:updatedAt",
            ExpressionAttributeValues: {
                ":orderStatus": orderStatus,
                ":updatedAt": getDateTime()
            },
            ReturnValues: "ALL_NEW",
        }));
    } catch (error) {
        throw error
    }
}

const updateOrderStatusDeliveredByOrderIdCommand = async (orderId: string) => {
    try {
        const deliveredTime = getDateTime();
        return await client.send(new UpdateCommand({
            TableName: process.env.ORDER_TABLE,
            Key: {
                id: orderId,
            },
            UpdateExpression: "set orderStatus = :orderStatus, updatedAt=:updatedAt, deliveredAt=:deliveredAt",
            ExpressionAttributeValues: {
                ":orderStatus": ORDER_STATUS.DELIVERED,
                ":updatedAt": deliveredTime,
                ":deliveredAt": getDateTime()
            },
            ReturnValues: "ALL_NEW",
        }));
    } catch (error) {
        throw error
    }
}

const getOrdersByStatusAndByDateCommand = async (date: string, orderStatus: ORDER_STATUS) => {
    try {
        return await client.send(new QueryCommand({
            TableName: process.env.ORDER_TABLE,
            IndexName: "order-table-delivery-date-gsi",
            KeyConditionExpression:
                `deliveryDate = :deliveryDate`,
            FilterExpression: "orderStatus=:orderStatus",
            ExpressionAttributeValues: {
                ":deliveryDate": date,
                ":orderStatus": orderStatus
            },
        }))

    } catch (error) {
        throw error
    }
}

const getOrdersByDateCommand = async (date: string) => {
    try {
        return await client.send(new QueryCommand({
            TableName: process.env.ORDER_TABLE,
            IndexName: "order-table-delivery-date-gsi",
            KeyConditionExpression:
                `deliveryDate = :deliveryDate`,
            ExpressionAttributeValues: {
                ":deliveryDate": date,
            },
        }))

    } catch (error) {
        throw error
    }
}

const getOrdersByCompanyCommand = async (companyId: string) => {
    try {
        return await client.send(new QueryCommand({
            TableName: process.env.ORDER_TABLE,
            IndexName: "order-table-company-id-gsi",
            KeyConditionExpression: "companyId = :companyId",
            ExpressionAttributeValues: {
                ":companyId": companyId,
            },
        }));
    } catch (error) {
        throw error
    }
}

const createOrderCommand =async (order:IOrder) => {
    return await client.send(new PutCommand({
        TableName: process.env.ORDER_TABLE,
        Item: order || {},
      }))
}

export {
    getOldOrdersCommand,
    updateOrderStatusByOrderIdCommand,
    getOrdersByStatusAndByDateCommand,
    getOrdersByDateCommand,
    getOrdersByCompanyCommand,
    createOrderCommand,
    updateOrderStatusDeliveredByOrderIdCommand
}