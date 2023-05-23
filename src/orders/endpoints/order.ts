import { APIGatewayProxyEvent } from "aws-lambda";
import {
  createOrder,
  getOrdersByCompany,
  getTodayAllOrders,
  peek,
} from "../services";
import { HttpMethod } from "aws-cdk-lib/aws-lambda";

exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.resource) {
      case "/orders/new":
        if (event.httpMethod === HttpMethod.POST) {
          const order = await createOrder(event);
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: order,
            }),
          };
        }
      case "/orders/peek":
        if (event.httpMethod === HttpMethod.GET) {
          const donut = await peek();
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: donut.order ? donut : "No donuts in lockers!",
            }),
          };
        }
      case "/orders/todaysOrders":
        if (event.httpMethod === HttpMethod.GET) {
          const todayOrders = await getTodayAllOrders();
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: todayOrders,
            }),
          };
        }
      case "/orders/listByCompany/{id}":
        if (event.httpMethod === HttpMethod.GET) {
          const orders = await getOrdersByCompany(event);
          return {
            statusCode: 200,
            body: JSON.stringify({
              message: orders,
            }),
          };
        }

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
