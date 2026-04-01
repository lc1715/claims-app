"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;   // UUID
  name: string;
};

function UserSelector() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();

  // fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      
      console.log('users array', data)
      setUsers(data);
      setSelectedUserId(data[0]?.id); // default to first user
    }

    fetchUsers();
  }, []);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    router.push(`/claims?userId=${selectedUserId}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log('selected user id', e.target.value)
    setSelectedUserId(e.target.value);  
  }

  return (
    <form onSubmit={handleSubmit}>
      <select name="userId" id="user-selector" value={selectedUserId} onChange={handleChange}>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <button type="submit">View Claims</button>
    </form>
  );
}

export default UserSelector;