import React from 'react'
import { Field } from 'formik'

const Email = ({ id, title, subtitle, desc, setFieldValue }) => {
    return (
        <div className='form-group'>
            <div className='form-info'>
                <label htmlFor={id}>{title}</label>
                <span className='sub-title'>{subtitle}</span>
            </div>
            <div className='form-body'>
                <Field
                    type='email'
                    id={id}
                    name={id}
                    onChange={(e) => setFieldValue(id, e.target.value)}
                />
                <span className='desc'>{desc}</span>
            </div>
        </div>
    )
}

export default Email
