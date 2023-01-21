
import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}
    async getAllTodos(userId: string): Promise<TodoItem[]> {
        
        const result = await this.docClient.query(
            {
              TableName: this.todosTable,
              IndexName: process.env.TODOS_CREATED_AT_INDEX,
              KeyConditionExpression: 'userId = :userId',
              ExpressionAttributeValues: {
                ':userId' : userId
              },
              ScanIndexForward:false
            }
          ).promise()
          const items = result.Items
          console.log(`My results ${userId}`);
          
          return items as TodoItem[];
    }

    async createTodo(todo: TodoItem) : Promise<TodoItem> {

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise();

      return todo
    }

    async updateTodo(userId: string, todoId: string, todosUpdate: TodoUpdate) : Promise<TodoUpdate> {
     await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate =:dueDate, done = :done',
        ExpressionAttributeNames: {
           '#name' : 'name'
        },
        ExpressionAttributeValues : {
          ':name' : todosUpdate.name,
          ':dueDate' : todosUpdate.dueDate,
          ':done' : todosUpdate.done,
        }
      }).promise()

      console.log(`Updated info: ${todosUpdate}`);
      
      return todosUpdate
    }

    async deleteTodo(userId: string, todoId: string) : Promise<void> {

        await this.docClient.delete({
          TableName:this.todosTable,
          Key: {userId,
            todoId}
        }).promise()
      
    }

    async getUploadUrl(userId: string, todoId: string) : Promise<string> {
      const s3 = new AWS.S3({
        signatureVersion: 'v4'
     })

    const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: {todoId,userId},
        Expires: process.env.ATTACHMENT_S3_BUCKET
    })

    return uploadUrl;
    }

}
