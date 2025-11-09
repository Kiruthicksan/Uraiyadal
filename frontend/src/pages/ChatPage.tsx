import { useAuthStore } from "../store/useAuthStore"

const ChatPage = () => {

  const {logOut}= useAuthStore()

  const handleLogout = () => {
    logOut()
  }
  return (
    <div className="z-10">
      <button onClick={handleLogout} className="btn btn-primary m-10">Logout</button>
    </div>
  )
}
export default ChatPage