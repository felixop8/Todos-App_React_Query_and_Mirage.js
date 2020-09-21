import React, {Fragment} from 'react'
import TodoForm from './TodoForm';
import useTodos from '../hooks/useTodos';
import useCreateTodos from '../hooks/useCreateTodo';

export default function Posts() {
    const { isLoading, isError, data: todos, error, isFetching } = useTodos();
    const [createTodo, { isLoading: createTodoIsLoading, error: createTodoError, success: createTodoSuccess }] = useCreateTodos()

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
                            {todos?.data.map((todo) => (
                                <Fragment key={todo.id}>
                                    <input type="checkbox" name={`todo${todo.id}`} checked={todo.attributes.completed} />
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
