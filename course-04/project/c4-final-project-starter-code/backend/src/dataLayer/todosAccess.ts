
import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";

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
      //      const items = [
      //   {
      //     "userId": "google-oauth2|101675378332843725088",
      //     "todoId": "123",
      //     "createdAt": "2019-07-27T20:01:45.424Z",
      //     "name": "Buy milk",
      //     "dueDate": "2019-07-29T20:01:45.424Z",
      //     "done": false,
      //     "attachmentUrl": "http://example.com/image.png"
      //     },
      //     {
      //       "userId": "google-oauth2|101675378332843725088",
      //       "todoId": "456",
      //       "createdAt": "2019-07-27T20:01:45.424Z",
      //       "name": "Send a letter",
      //       "dueDate": "2019-07-29T20:01:45.424Z",
      //       "done": true,
      //       "attachmentUrl": "http://example.com/image.png"
      //       },
      // ]

      // return items as TodoItem[]
    }

    async createTodo(todo: TodoItem) : Promise<TodoItem> {

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise();

      return todo
    }

}
