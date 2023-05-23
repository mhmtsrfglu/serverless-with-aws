import { GetCommand } from "@aws-sdk/lib-dynamodb"
import client from "../db";

const getCompanyByIdCommand = async (companyId: string) => {
    try {
        return await client.send(new GetCommand({
            TableName: process.env.COMPANY_TABLE,
            Key: {
                id: companyId,
            },
        }))
    } catch (error) {
        throw error
    }
}

export{
    getCompanyByIdCommand
}