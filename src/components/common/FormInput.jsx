import React from 'react';

const FormInput = ({
    id,
    label,
    type = 'text',
    placeholder,
    register,
    rules = {},
    error,
    ...rest
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black
          ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...register(id, rules)}
                {...rest}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
};

export default FormInput; 