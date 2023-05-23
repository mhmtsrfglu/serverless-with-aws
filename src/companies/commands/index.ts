import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import client from "../db";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { ICompany } from "../../common/interfaces";

const deleteCompanyByIdCommand = async (companyId: string) => {
  return await client.send(
    new DeleteCommand({
      TableName: process.env.COMPANY_TABLE,
      Key: {
        id: companyId,
      },
    })
  );
};

const getCompanyByIdCommand = async (companyId: string) => {
  return await client.send(
    new GetCommand({
      TableName: process.env.COMPANY_TABLE,
      Key: {
        id: companyId,
      },
    })
  );
};

const getAllCompaniesCommand = async () => {
  return await client.send(
    new ScanCommand({
      TableName: process.env.COMPANY_TABLE,
    })
  );
};

const createCompanyCommand = async (company: ICompany) => {
  return await client.send(
    new PutCommand({
      TableName: process.env.COMPANY_TABLE,
      Item: company || {},
    })
  );
};

export {
  deleteCompanyByIdCommand,
  getCompanyByIdCommand,
  getAllCompaniesCommand,
  createCompanyCommand
};
