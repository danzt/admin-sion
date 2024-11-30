import { useState, useEffect } from 'react';
import useStore from '../store/user';
import { User, UserRole, UserStatus } from '../domain/user';

const UsersComponent = () => {
  const now = new Date();

  const { users, addUser, fetchUsers } = useStore(); // Accede al estado y las funciones del store
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<User['role']>('user');
  const [status, setStatus] = useState<User['status']>('active');
  const [createdAt, setCreatedAt] = useState<User['createdAt']>(now);
  const [updatedAt, setUpdatedAt] = useState<User['updatedAt']>(now);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleClear = () => {
    setName('');
    setLastName('');
    setEmail('');
    setDisplayName('');
    setPhone('');
    setAvatar('');
    setAddress('');
    setRole('user');
    setStatus('active');
    setCreatedAt(new Date());
    setUpdatedAt(new Date());
  };

  const handleSelectValue = (value: string, name: string) => {
    if (name == 'status') {
      setStatus(value as UserStatus);
    } else if (name == 'role') {
      setRole(value as UserRole);
    }
  };

  const handleAddUser = async () => {
    if (!name || !email) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const newUser: User = {
      id: '',
      name,
      lastName,
      displayName,
      email,
      phone,
      avatar,
      address,
      role,
      status,
      createdAt,
      updatedAt,
      createdBy: 'admin',
      updatedBy: 'admin',
    };

    try {
      await addUser(newUser); // Llama a la función del store
      alert('Usuario agregado con éxito');
      handleClear();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* Formulario para agregar usuarios */}
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Apellido"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre para mostrar"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Número de teléfono"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="URL de la imagen de perfil"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección"
          className="border p-2 mb-2 w-full"
        />
        <select
          value={role}
          onChange={(e) => handleSelectValue(e.target.value, 'role')}
          className="border p-2 mb-2 w-full"
        >
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          <option value="guest">Invitado</option>
        </select>
        <select
          value={status}
          onChange={(e) => handleSelectValue(e.target.value, 'status')}
          className="border p-2 mb-2 w-full"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Usuario
        </button>
      </div>

      {/* Lista de usuarios */}
      <h2 className="text-lg font-semibold mb-2">Usuarios Registrados:</h2>
      <ul className="list-disc pl-5">
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.displayName} - {user.role}
            </li>
          ))}
        </ul>{' '}
      </ul>
    </div>
  );
};

export default UsersComponent;
