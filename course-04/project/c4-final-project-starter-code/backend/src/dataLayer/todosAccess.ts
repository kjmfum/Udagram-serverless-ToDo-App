
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
    
          return items as TodoItem[];
    }

    async createTodo(todo: TodoItem) : Promise<TodoItem> {

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise();

      return todo
    }

}
