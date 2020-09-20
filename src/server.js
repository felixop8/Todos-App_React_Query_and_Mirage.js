import { Server, Response } from "miragejs";
import { v4 } from 'uuid';


export function makeServer({ environment = "test" } = {}) {
    let server = new Server({
      environment,
  
      routes() {
        this.namespace = "api";
        this.timing = 2000
        const failureRate = 0.5;

        const fakeDatabase = {
            todos: [{
              id: "1234",
              text: 'hey',
              completed: true,
            }, {
              id: v4(),
              text: 'ho',
              completed: true,
            }, {
              id: v4(),
              text: 'let’s go',
              completed: false,
            }],
          };

          
        // Fetch all todos.
        this.get("/todos", (schema, request) => {
            const {queryParams: { pageOffset, pageSize }} = request
        
            const todos = fakeDatabase.todos;
        
            if (Number(pageSize)) {
                const start = Number(pageSize) * Number(pageOffset)
                const end = start + Number(pageSize)
                const page = todos.slice(start, end)
            
                return {
                    items: page,
                    nextPage: todos.length > end ? Number(pageOffset) + 1 : undefined,
                }
            }
            return todos;
        });


        // Create todo
        this.post("/todos", (schema, request) => {
            if (Math.random() > failureRate) return new Response(400, { some: 'header' }, { errors: [ 'An unknown error occurred!'] });

            const todo = {
              id: v4(),
              ...JSON.parse(request.requestBody),
              completed: false,
            };

            fakeDatabase.todos.push(todo);

            return todo;
        });


        // Get single todo
        this.get("/todos/:todoId", (schema, request) => {
          const {params: {todoId}} = request;
        
          const todo = fakeDatabase.todos.find((todo) => todo.id === todoId)
        
          if (!todo) return new Response(400, { some: 'header' }, { errors: [ 'Not found.'] });

          return todo;
        });


        // Edit/save todo
        this.patch("/todos/:todoId", (schema, request) => {
          if (Math.random() > failureRate) return new Response(400, { some: 'header' }, { errors: [ 'An unknown error occurred!'] });

          const {params: {todoId}, requestBody } = request;

          const todo = fakeDatabase.todos.find(todo => todo.id === todoId);

          if (!todo) new Response(400, { some: 'header' }, { errors: [ 'Not found.'] });


          const requestBodyJSObject = JSON.parse(requestBody)
          delete requestBodyJSObject.id

          const newTodo = {
            ...todo,
            ...requestBodyJSObject
          }

          fakeDatabase.todos = fakeDatabase.todos.map((todo) => (todo.id === todoId ? newTodo : todo))

          return newTodo;
        });


        // Delete single todo
        this.delete("/todos/:todoId", (schema, request) => {
          const {params: {todoId} } = request;

          if (Math.random() > failureRate) return new Response(400, { some: 'header' }, { errors: [ 'An unknown error occurred!'] });
        
          const todo = fakeDatabase.todos.find((todo) => todo.id === todoId)
        
          if (!todo) return new Response(400, { some: 'header' }, { errors: [ 'Not found.'] });

          fakeDatabase.todos = fakeDatabase.todos.filter((todo) => todo.id !== todoId)

          return 'Resource Deleted';
        });
      },
    })
  
    return server
  }