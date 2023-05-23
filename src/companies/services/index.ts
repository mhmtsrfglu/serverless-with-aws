import { v4 as uuidv4 } from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { MissingParameterException } from '../../common/exceptions/MissingParameterException';
import { CompanyNotFoundException } from '../../common/exceptions/CompanyNotFoundException';
import { ICompany } from '../../common/interfaces';
import { createCompanyCommand, deleteCompanyByIdCommand,getAllCompaniesCommand,getCompanyByIdCommand } from '../commands';

const createCompany = async (event: APIGatewayProxyEvent) => {
  try {
    console.log(`createCompany function. event :"`, event);

    const requestBody = event.body ? JSON.parse(event.body) : {};

    const companyRequest: ICompany = {
      companyName: "",
      id: ""
    };

    companyRequest.companyName = requestBody.companyName

    if (!companyRequest.companyName) throw new MissingParameterException("companyName parameter not found!")

    companyRequest.id = uuidv4();

    const createResult = await createCompanyCommand(companyRequest);

    console.log("Created company: ", createResult);
    return companyRequest;

  } catch (e) {
    console.error(e);
    throw e;
  }
}

const getAllCompanies = async () => {
  console.log(`allCompanies function called.`);
  try {

    const companies = await getAllCompaniesCommand()

    console.log("Companies: ", companies);
    return companies.Items;

  } catch (e) {
    console.error(e);
    throw e;
  }
}

const getCompanyById = async (event: APIGatewayProxyEvent) => {
  console.log(`getCompanyById bnnnn function called. event : "`, event);
  try {

    const companyId = event.pathParameters?.id

    if (!companyId) throw new MissingParameterException("id parameter not found!")

    const company = await getCompanyByIdCommand(companyId);

    if (!company.Item) throw new CompanyNotFoundException(`Company not found with id: ${companyId}`)

    console.log("Company: ", company);
    return company.Item;

  } catch (e) {
    console.error(e);
    throw e;
  }
}

const deleteCompanyById = async (event: APIGatewayProxyEvent) => {
  try {
    console.log(`delete function. event: `, event);

    const company = await getCompanyById(event)
    const deleteResult = await deleteCompanyByIdCommand(company.id);
    console.log("Deleted company: ", company);
    return deleteResult;

  } catch (e) {
    console.error(e);
    throw e;
  }
}


export {
  createCompany,
  deleteCompanyById,
  getAllCompanies,
  getCompanyById
}