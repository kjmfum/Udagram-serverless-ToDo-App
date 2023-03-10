import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
// import * as AWS from 'aws-sdk'
import { createTodoForUser } from '../../businessLogic/todos';
// import { TodoItem } from '../../models/TodoItem'




// const todosTable = process.env.GROUPS_TABLE;
// const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);
 

<<<<<<< HEAD
    const newTodoItem = createTodoForUser(userId, newTodo)
    console.log(`Getting stuff 1: ${newTodoItem}`);
    console.log(`Getting stuff 2: ${newTodoItem[0].name}`);
    console.log(`Getting stuff 3: ${newTodoItem[0].userId}`);
    console.log(`Getting stuff 4: ${newTodoItem[0]["name"]}`);
||||||| merged common ancestors
    const newTodoItem = createTodoForUser(userId, newTodo)
=======
    const item = await createTodoForUser(userId, newTodo)
>>>>>>> CreateTodo


  // await docClient.put({
  //   TableName: todosTable,
  //   Item: newTodoItem
  // }).promise();
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        item: item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
