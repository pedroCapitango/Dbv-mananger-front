import React from 'react';
import { Input } from './Input';
import { Button } from './Button';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
}

// Componente FormField individual
interface FormFieldComponentProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
}

export const FormFieldComponent: React.FC<FormFieldComponentProps> = ({ field, value, onChange }) => {
  const baseInputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
    field.error ? 'border-red-500' : 'border-gray-300'
  }`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(field.name, e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {field.type === 'textarea' ? (
        <textarea
          name={field.name}
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.rows || 3}
          className={baseInputClass}
        />
      ) : field.type === 'select' && field.options ? (
        <select
          name={field.name}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          className={baseInputClass}
        >
          <option value="">Selecione...</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={field.type || 'text'}
          name={field.name}
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      
      {field.error && <p className="mt-1 text-sm text-red-500">{field.error}</p>}
    </div>
  );
};

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  initialValues?: Record<string, any>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Salvar',
  initialValues = {},
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={field.rows || 3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <Input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Salvando...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
