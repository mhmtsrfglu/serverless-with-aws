import { v4 as uuidv4 } from "uuid";
import { MissingParameterException } from "../../common/exceptions/MissingParameterException";
import {
  deleteMessageFromQueue,
  readMessageFromQueue,
  sendMessageToQueue,
} from "../queue";
import { CompanyNotFoundException } from "../../common/exceptions/CompanyNotFoundException";
import { IOrder, ORDER_STATUS } from "../../common/interfaces";
import {
  convertDateToISOString,
  getDate,
  getDateTime,
} from "../../common/helpers";
import { RECORD_TYPE } from "../../common/constants";
import {
  createOrderCommand,
  getOldOrdersCommand,
  getOrdersByCompanyCommand,
  getOrdersByDateCommand,
  getOrdersByStatusAndByDateCommand,
  updateOrderStatusByOrderIdCommand,
  updateOrderStatusDeliveredByOrderIdCommand,
} from "../commands/orderCommands";
import { getCompanyByIdCommand } from "../commands/companyCommands";
import { APIGatewayProxyEvent } from "aws-lambda";

const updateOldOrders = async () => {
  try {
    const date = getDate();
    console.log("Started to update old orders: ", date);
    const orders = await getOldOrdersCommand();

    if (orders.Items) {
      for (const order of orders.Items) {
        await updateOrderStatusByOrderIdCommand(
          order.id,
          ORDER_STATUS.OLD_TO_STAY
        );
      }
    }

    console.log("Finished to update old orders: ", date);

    return true;
  } catch (error) {
    console.error("An Error Occured while updateOldOrders: ", error);
    throw error;
  }
};

const bufferTodayOrdersToQueue = async () => {
  try {
    const today = getDate();
    const result = await getOrdersByStatusAndByDateCommand(
      today,
      ORDER_STATUS.RECEVIED
    );
    const orders = result.Items ? result.Items : [];

    for (const order of orders) {
      const message = await sendMessageToQueue(JSON.stringify(order));
      if(message && message.MessageId){
        await updateOrderStatusByOrderIdCommand(order.id, ORDER_STATUS.PICKED_UP);
      }else{
        await updateOrderStatusByOrderIdCommand(order.id, ORDER_STATUS.TECH_FAILURE);
      }
      console.log("Message sended to Queue", message);
    }
  } catch (error) {
    console.error("An Error Occured while bufferTodayOrdersToQueue: ", error);
    throw error;
  }
};

const getTodayAllOrders = async () => {
  try {
    const today = getDate();
    const orders = await getOrdersByDateCommand(today);
    return {
      orders: orders.Items || [],
      orderCount: orders.Count || 0,
    };
  } catch (error) {
    console.error("An Error Occured while getTodayAllOrders: ", error);
    throw error;
  }
};

const getCompanyById = async (companyId: string) => {
  try {
    if (!companyId)
      throw new MissingParameterException("id parameter not found!");

    const company = await getCompanyByIdCommand(companyId);

    if (!company.Item)
      throw new CompanyNotFoundException(
        `Company not found with id: ${companyId}`
      );

    console.log("getCompanyById result: ", company);
    return company.Item;
  } catch (e) {
    console.error("An Error Occured while getCompanyById: ", e);
    throw e;
  }
};

const getOrdersByCompany = async (event: APIGatewayProxyEvent) => {
  console.log(`getOrdersByCompany function. event :"`, event);

  try {
    const companyId = event.pathParameters?.id;

    if (!companyId)
      throw new MissingParameterException("companyId parameter not found!");

    const company = await getCompanyById(companyId);

    const response = await getOrdersByCompanyCommand(company.id);
    console.log(`getOrdersByCompany function. result :"`, response);

    return {
      companyName: company.companyName,
      items: response.Items || [],
      itemCount: response.Count || 0,
    };
  } catch (e: any) {
    console.error("An Error Occured while getOrdersByCompany: ", e);
    throw e;
  }
};

const createOrder = async (event: APIGatewayProxyEvent) => {
  console.log(`createOrder function. event :"`, event);
  try {
    const requestBody: IOrder = event.body ? JSON.parse(event.body) : {};

    const order: IOrder = {
      companyId: "",
      name: "",
      id: "",
      orderStatus: ORDER_STATUS.RECEVIED,
      createdAt: "",
      deliveredAt: "",
      deliveryDate: "",
      updatedAt: "",
      recordType: RECORD_TYPE,
    };

    if (!requestBody.companyId && !requestBody.name)
      throw new MissingParameterException("One or more parameter not found!");

    const company = await getCompanyById(requestBody.companyId);

    order.companyId = company.id;
    order.name = requestBody.name;
    order.id = uuidv4();
    order.createdAt = getDateTime();
    order.deliveryDate = convertDateToISOString(requestBody.deliveryDate);
    order.updatedAt = getDateTime();

    const result = await createOrderCommand(order);
    console.log("Created company: ", result);
    return order;
  } catch (e) {
    console.error("An Error Occured while createOrder: ", e);
    throw e;
  }
};

const peek = async () => {
  try {
    const qeueue = await readMessageFromQueue(1);
    const { Messages } = qeueue;
    const order: { company?: string; order?: IOrder | null } = {
      company: "",
      order: null,
    };

    for (const message of Messages || []) {
      const body: IOrder = message.Body ? JSON.parse(message.Body) : null;
      if (body) {
        const company = await getCompanyById(body.companyId);
        order.order = body;
        order.company = company.companyName;
        const updateEvent = await updateOrderStatusDeliveredByOrderIdCommand(
          body.id
        );
        await deleteMessageFromQueue(message);
        order.order.orderStatus = updateEvent?.Attributes?.orderStatus
        order.order.deliveredAt = updateEvent?.Attributes?.deliveredAt;
      }
    }

    return order;
  } catch (error) {
    console.error("An Error Occured while pickOrder: ", error);
    throw error;
  }
};

export {
  createOrder,
  getCompanyById,
  getOrdersByCompany,
  updateOldOrders,
  getTodayAllOrders,
  bufferTodayOrdersToQueue,
  peek,
};
