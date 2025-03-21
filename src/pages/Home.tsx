import { useAuth } from "../hooks/auth";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <h1>Welcome to IceCable</h1>
      Username: {user.username}

      <br />
      <label>Invite a friend to chat</label>
      <br />
      <input type="text" placeholder="Friend's username" />
    </>
  )
}