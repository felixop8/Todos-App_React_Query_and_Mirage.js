import React, {Fragment, useEffect} from 'react'
import TodoForm from './TodoForm'
import useTodos from '../hooks/useTodos'
import useCreateTodos from '../hooks/useCreateTodo'
import useSavePost from '../hooks/useSaveTodo'
import { queryCache, setQueryData } from 'react-query'

export default function Posts() {
    const { isLoading, isError, data: todos, error, isFetching } = useTodos();
    const [createTodo, { isLoading: createTodoIsLoading, error: createTodoError, success: createTodoSuccess, status }] = useCreateTodos()
    const [saveTodo, { isLoading: saveTodoIsLoading, error: saveTodoError, success: saveTodoSuccess }] = useSavePost();
    
    // Todo: move this flag somewhere else.
    useEffect(() => {
        queryCache.setQueryData('creatingTodos', (old) => {
            return [];
          })
      }, []);

    // Todo: move this flag somewhere else.
    let creating = queryCache.getQueryData('creatingTodos');


    return (
        <section>
            <div>
                {isLoading ? (
                    <span>Loading...</span>
                ) : isError && error.constructor.name !== 'CancelledError' ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <>
                        <h3>
                            Posts{' '}
                            {isFetching ? (
                                <small>Updating...</small>
                            ) : null}
                        </h3>

                        <div>
                            {todos.data?.map((todo) => (
                                <Fragment key={todo.id}>
                                    <input 
                                        type="checkbox" 
                                        name={`todo${todo.id}`} 
                                        checked={todo.attributes.completed} 
                                        onChange={() => saveTodo({...todo.attributes, completed: !todo.attributes.completed, id: todo.id})}
                                        // Todo: move this flag somewhere else.
                                        disabled={creating.includes(todo.id)} 
                                    />
                                    <label htmlFor={`todo${todo.id}`}>{todo.attributes.title}</label>
                                </Fragment>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <hr />
            <div>
            <h3>Create New Todo</h3>
            <div>
            <TodoForm
                onSubmit={createTodo}
                submitText={
                    createTodoIsLoading
                    ? 'Saving...'
                    : createTodoError
                    ? 'Error!'
                    : createTodoSuccess
                    ? 'Saved!'
                    : 'Create Todo'
                }
            />
            </div>
        </div>
        </section>
    )
}
