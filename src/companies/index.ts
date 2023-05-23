import { createCompany, deleteCompanyById,getAllCompanies,getCompanyById } from "./services";
import { APIGatewayProxyEvent } from 'aws-lambda';

exports.handler = async (event:APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        const createdCompany = await createCompany(event);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Company created.",
            body: createdCompany,
          }),
        };
        case "GET":
          if (event.pathParameters != null) {
            const company = await getCompanyById(event);
            return {
              statusCode: 200,
              body: JSON.stringify(company),
            };
          }else{
            const companies = await getAllCompanies();
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Companies listed.",
                body: companies,
              }),
            };
          }
      case "DELETE":
        await deleteCompanyById(event);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Company deleted.",
          }),
        };
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (e:any) {
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
