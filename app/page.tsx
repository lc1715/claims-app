'use client'

import UserSelector from "@/components/users/UserSelector";

export default function Home() {
  return (
    <div>
      <h1>Claims App</h1>
      <p>Select a demo user to view claims</p>

      <UserSelector/>
    </div>
  );
}
