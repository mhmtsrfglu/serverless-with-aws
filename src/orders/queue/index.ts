import { DeleteMessageCommand, Message, ReceiveMessageCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const sqsClient = new SQSClient({});
const SQS_QUEUE_URL = process.env.QUEUE_URL;
import { v4 as uuidv4 } from "uuid";
import { VISIBILITY_TIMEOUT } from "../../../lib/dlp-queues";

const readMessageFromQueue = async (messageCount:number) => {
    return await sqsClient.send(new ReceiveMessageCommand({
        MaxNumberOfMessages: messageCount,
        MessageAttributeNames: ["All"],
        QueueUrl: SQS_QUEUE_URL,
        VisibilityTimeout: VISIBILITY_TIMEOUT,
        WaitTimeSeconds: 0,
    }));
}

const sendMessageToQueue = async (message: string) => {
    return await sqsClient.send(new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        MessageGroupId: uuidv4(),
        MessageBody: message
    }));
}

const deleteMessageFromQueue = async (message: Message) => {
    return await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
    }))
}

export {
    readMessageFromQueue,
    deleteMessageFromQueue,
    sendMessageToQueue
}