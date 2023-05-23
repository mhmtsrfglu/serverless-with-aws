import { bufferTodayOrdersToQueue, updateOldOrders } from "../services";

exports.handler = async (event: any, _context: any, callback: any) => {
  try {
    console.log("EVENT: ", event);

    console.log("Job Started");

    await updateOldOrders();
    await bufferTodayOrdersToQueue()
    console.log("Job Finished");

    callback(null);
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
