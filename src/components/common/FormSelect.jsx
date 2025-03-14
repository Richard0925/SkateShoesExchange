import React from 'react';

const FormSelect = ({
    id,
    label,
    options = [],
    register,
    rules = {},
    error,
    defaultValue = '',
    ...rest
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <select
                id={id}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black
          ${error ? 'border-red-500' : 'border-gray-300'}`}
                defaultValue={defaultValue}
                {...register(id, rules)}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
};

export default FormSelect; 