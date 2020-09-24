import React from 'react'
import { v4 as uuidv4 } from 'uuid';

const defaultFormValues ={
    title: '',
    description: '',
    completed: false
}

export default function TodoForm({initialValues = defaultFormValues, onSubmit, submitText}) {

    const [values, setValues] = React.useState(initialValues)

    const setValue = (field, value) =>
      setValues((old) => ({ ...old, [field]: value }))
  
    const handleSubmit = (e) => {
      setValues(defaultFormValues)
      e.preventDefault()

      onSubmit({...values, id: uuidv4()})
    }
  
    React.useEffect(() => {
      setValues(initialValues)
    }, [initialValues])
  
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <div>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={(e) => setValue('title', e.target.value)}
            required
          />
        </div>
        <br />
        <label htmlFor="Description">Description</label>
        <div>
            <textarea
                type="text"
                name="description"
                value={values.description}
                onChange={(e) => setValue('description', e.target.value)}
                required
            />
        </div>
        <br />
        <button type="submit">{submitText}</button>
      </form>
    )
}
