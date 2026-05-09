import { useState } from 'react';
import './index.css';

const INITIAL_VALUES = {
  subject: '',
  desc: '',
  customerId: '',
  priority: '',
  categoryId: '',
  attachments: [],
};

function validate(values) {
  const errors = {};

  if (!values.subject.trim()) errors.subject = 'Subject is required.';
  if (!values.desc.trim()) errors.desc = 'Description is required.';
  if (!values.customerId) errors.customerId = 'Customer is required.';
  if (!values.priority) errors.priority = 'Priority is required.';
  if (!values.categoryId) errors.categoryId = 'Category is required.';

  return errors;
}

export function CreateTicketForm({
  onClose,
  customers = [],
  categories = [],
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', lable: 'Urgent' },
  ],
  // onCreateCategory,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  // const [newCategoryName, setNewCategoryName] = useState('')
  // const [isAddingCategory, setIsAddingCategory] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleAttachemntsChange(event) {
    const files = Array.from(event.target.files || []);
    setValues((prev) => ({ ...prev, attachments: files }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = new FormData();
    formData.append('subject', values.subject.trim());
    formData.append('desc', values.desc.trim());
    formData.append('customerId', values.customerId);
    formData.append('priority', values.priority);
    formData.append('categoryId', values.categoryId);
    values.attachments.forEach((file) => formData.append('attachments', file));

    // await createTicket(formData)   API call() here.
    console.log(formData);
    // onSuccess?.();
  }

  return (
    <form className="create-ticket-form" onSubmit={handleSubmit}>
      <div className="create-ticket-form__header">
        <h2 className="create-ticket-form__title">Create Ticket</h2>
      </div>

      <div className="create-ticket-form__body">
        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Subject *
            <input
              className="create-ticket-field__control"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              placeholder="Enter subject"
            />
          </label>
          <p className="create-ticket-field__error">{errors.subject || ' '}</p>
        </div>

        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Description *
            <textarea
              className="create-ticket-field__control create-ticket-field__control-textarea"
              name="desc"
              value={values.desc}
              onChange={handleChange}
              placeholder="Description"
              rows={5}
            />
          </label>
          <p className="create-ticket-field__error">{errors.desc || ' '}</p>
        </div>

        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Customer *
            <select
              className="create-ticket-field__control"
              name="customerId"
              value={values.customerId}
              onChange={handleChange}
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={String(customer.id)}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <p className="create-ticket-field__error">{errors.customerId || ' '}</p>
        </div>

        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Priority *
            <select
              className="create-ticket-field__control"
              name="priority"
              value={values.priority}
              onChange={handleChange}
            >
              <option value="">Select priority</option>
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
          <p className="create-ticket-field__error">{errors.priority || ' '}</p>
        </div>

        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Category *
            <select
              className="create-ticket-field__control"
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <p className="create-ticket-field__error">{errors.category || ' '}</p>
        </div>

        <div className="create-ticket-field">
          <label className="create-ticket-field__label">
            Attachments
            <input
              className="create-ticket-field__control"
              type="file"
              multiple
              onChange={handleAttachemntsChange}
            />
          </label>
          <p className="create-ticket-field__helper">
            {values.attachments.length > 0
              ? `${values.attachments.length} file(s) selected`
              : 'You can upload multiple files.'}
          </p>
          <p className="create-ticket-field__error"> </p>
        </div>
      </div>

      <div className="create-ticket-form__footer">
        <button
          className="create-ticket-btn create-ticket-btn-secondary"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
        <button className="create-ticket-btn create-ticket-btn-primary" type="submit">
          Create Ticket
        </button>
      </div>
    </form>
  );
}
