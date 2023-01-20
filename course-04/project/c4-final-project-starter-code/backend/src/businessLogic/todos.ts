
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

        const todoItemId = uuid.v4()

        return await todoAccess.createTodo({
            userId: userId,
            todoId: todoItemId,
            createdAt: new Date().toISOString(),
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate,
            done: false,
            attachmentUrl: "https://assetsnffrgf-a.akamaihd.net/assets/m/2021006/univ/art/2021006_univ_cnt_1_md.jpg"
          }
        )

        
        }
