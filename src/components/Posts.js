import React, {Fragment} from 'react'
import useTodos from '../hooks/useTodos';

export default function Posts() {
    const { isLoading, isError, data: todos, error, isFetching } = useTodos();

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
                                    <label htmlFor={`todo${todo.id}`}>{todo.attributes.text}</label>
                                </Fragment>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
