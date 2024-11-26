import { useState } from "react";
import useStore from "../store/user";

const UsersComponent = () => {
  const { records, addUser } = useStore(); // Accede al estado y las funciones del store
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAddUser = async () => {
    if (!name || !email) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newUser = { name, email };

    try {
      await addUser(newUser); // Llama a la función del store
      alert("Usuario agregado con éxito");
      setName(""); // Limpia los inputs
      setEmail("");
    } catch (error) {
      console.error("Error al agregar usuario:", error);
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="border p-2 mb-2 w-full"
        />
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
        {records.length > 0 ? (
          records.map((user, index) => (
            <li key={index}>
              {user.name} - {user.email}
            </li>
          ))
        ) : (
          <p>No hay usuarios registrados.</p>
        )}
      </ul>
    </div>
  );
};

export default UsersComponent;
