import { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';
import { FiAlertCircle, FiGlobe, FiUser } from 'react-icons/fi';
import useStore from '../store/user';
import { translations } from '../core/utils/Traslations';

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  displayName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().min(1),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'inactive']),
  avatar: z.string().min(1),
  comments: z.string().min(10).max(500),
});

const FeatureRichForm = () => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    status: 'active',
    avatar: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = translations[language];

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
        validateField('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getErrorMessage = (fieldName: string, error: string) => {
    if (!error) return '';
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
      case 'displayName':
        return t.nameError;
      case 'email':
        return t.emailError;
      case 'phone':
        return t.phoneError;
      case 'address':
        return t.addressError;
      case 'avatar':
        return t.avatarError;
      case 'comments':
        return error.includes('at least')
          ? t.commentsMinError
          : t.commentsMaxError;
      default:
        return error;
    }
  };

  const validateField = (fieldName: string | number, value: string) => {
    try {
      const fieldSchema = z.object({
        [fieldName]: formSchema.shape[fieldName] as z.ZodType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
      });
      fieldSchema.parse({ [fieldName]: value });
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: getErrorMessage(fieldName, error.errors[0].message),
      }));
    }
  };

  const { addUser } = useStore();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      formSchema.parse(formData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        phone: '',
        address: '',
        role: 'user',
        status: 'active',
        avatar: '',
        comments: '',
      });

      await addUser(formData);
      setErrors({});
    } catch (error) {
      const newErrors = {};
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = getErrorMessage(err.path[0], err.message);
      });
      setErrors(newErrors);
    }
  };

  const renderInput = (name, type = 'text', props = {}) => (
    <div className="relative">
      <input
        id={name as string}
        name={name as string}
        type={type}
        required
        value={formData[name]}
        onChange={handleChange}
        className={`appearance-none relative block w-full px-3 py-2 border ${
          errors[name] ? 'border-red-300' : 'border-gray-300'
        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
        aria-invalid={errors[name] ? 'true' : 'false'}
        aria-describedby={`${name}-error`}
        {...props}
      />
      {errors[name] && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-end">
          <div className="flex items-center space-x-2">
            <FiGlobe className="h-5 w-5 text-gray-500" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="block w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t.title}
          </h2>
        </div>

        {isSubmitted && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{t.success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.firstName}
                </label>
                <div className="mt-1">{renderInput('firstName')}</div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600" id="firstName-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.lastName}
                </label>
                <div className="mt-1">{renderInput('lastName')}</div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600" id="lastName-error">
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.displayName}
                </label>
                <div className="mt-1">{renderInput('displayName')}</div>
                {errors.displayName && (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="displayName-error"
                  >
                    {errors.displayName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.email}
                </label>
                <div className="mt-1">{renderInput('email', 'email')}</div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.phone}
                </label>
                <div className="mt-1">{renderInput('phone', 'tel')}</div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600" id="phone-error">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.address}
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600" id="address-error">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.role}
                </label>
                <div className="sm:col-span-3">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    autoComplete="country-name"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.status}
                </label>

                <div className="sm:col-span-3">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.avatar}
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-input"
                  />
                  <label
                    htmlFor="avatar-input"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiUser className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    Upload
                  </label>
                  {formData.avatar && (
                    <img
                      src={formData.avatar}
                      alt="Avatar preview"
                      className="ml-4 h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </div>
                {errors.avatar && (
                  <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.comments}
                </label>
                <div className="mt-1">
                  <textarea
                    id="comments"
                    name="comments"
                    rows="4"
                    required
                    value={formData.comments}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.comments ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.comments && (
                  <p className="mt-2 text-sm text-red-600" id="comments-error">
                    {errors.comments}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeatureRichForm;
