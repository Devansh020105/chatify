import {useState} from 'react'
import { useAuthStore } from '../store/useAuthStore';

function ChatPage() {
  const { logout : storeLogout } = useAuthStore();
  const handleLogout = async()=>{
    console.log("Logout initiated.")
    await storeLogout();
  };

  return (
    <div className='z-10'>
      ChatPage
      <button onClick={handleLogout}>
        logout
      </button>
    </div>
  );
}

export default ChatPage
