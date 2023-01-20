
import * as uuid from 'uuid'
import { TodoAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";


const todoAccess = new TodoAccess()


export async function getTodosForUser(userId: string) : Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
    
}

export async function createTodoForUser( userId: string, createTodoRequest : CreateTodoRequest) : Promise<TodoItem> 
   {

        const todItemId = uuid.v4()

        const item : TodoItem  = await todoAccess.createTodo({
            userId: userId,
            todoId: todItemId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false,
            attachmentUrl: null
          }
        )

        return item;

        
        }
