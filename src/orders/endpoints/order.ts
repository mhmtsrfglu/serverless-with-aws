import { APIGatewayProxyEvent } from "aws-lambda";
import {
  createOrder,
  getOrdersByCompany,
  getTodayAllOrders,
  peek,
} from "../services";

exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.resource) {
      case "/orders/new":
        const order = await createOrder(event);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: order,
          }),
        };
      case "/orders/peek":
        const donut = await peek();
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: donut.order ? donut : "No donuts in lockers!",
          }),
        };
      case "/orders/todaysOrders":
        const todayOrders = await getTodayAllOrders();
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: todayOrders,
          }),
        };
      case "/orders/listByCompany/{id}":
        const orders = await getOrdersByCompany(event);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: orders,
          }),
        };
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (e: any) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to perform operation.",
        errorMsg: e.message,
      }),
    };
  }
};
