import React, {Fragment} from 'react'
import TodoForm from './TodoForm'
import useTodos from '../hooks/useTodos'
import useCreateTodos from '../hooks/useCreateTodo'
import useSavePost from '../hooks/useSaveTodo'

export default function Posts() {
    const { isLoading, isError, data: todosData, error, isFetching } = useTodos();
    const [createTodo, { isLoading: createTodoIsLoading, error: createTodoError, success: createTodoSuccess }] = useCreateTodos()
    const [saveTodo, { isLoading: saveTodoIsLoading, error: saveTodoError, success: saveTodoSuccess }] = useSavePost()

    const arrayOfTodoIds = todosData?.result.todos;
    const todoEntities = todosData?.entities.todos;



    return (
        <section>
            <div>
                {isLoading ? (
                    <span>Loading...</span>
                ) : isError ? (
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
                            {arrayOfTodoIds?.map((todoId) => (
                                <Fragment key={todoId}>
                                    <input 
                                        type="checkbox" 
                                        name={`todo${todoId}`} 
                                        checked={todoEntities[todoId].completed} 
                                        onChange={() => saveTodo({data: {
                                            type: 'todos', 
                                            id: todoId, 
                                            attributes: {
                                                title: todoEntities[todoId].title, 
                                                description: todoEntities[todoId].description,
                                                completed: !todoEntities[todoId].completed 
                                                }
                                            }
                                        })} />
                                    <label htmlFor={`todo${todoId}`}>{todoEntities[todoId].title}</label>
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
