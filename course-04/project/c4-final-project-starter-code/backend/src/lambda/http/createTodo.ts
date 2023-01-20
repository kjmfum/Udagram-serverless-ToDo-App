import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
// import * as AWS from 'aws-sdk'
import { createTodoForUser } from '../../businessLogic/todos';




// const todosTable = process.env.GROUPS_TABLE;
// const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);
 

    const newTodoItem = createTodoForUser(userId, newTodo)
    console.log(`Getting stuff 1: ${newTodoItem}`);
    console.log(`Getting stuff 2: ${newTodoItem[0].name}`);
    console.log(`Getting stuff 3: ${newTodoItem[0].userId}`);
    console.log(`Getting stuff 4: ${newTodoItem[0]["name"]}`);


  // await docClient.put({
  //   TableName: todosTable,
  //   Item: newTodoItem
  // }).promise();


    return {
      statusCode: 201,
      body: JSON.stringify(newTodoItem)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
