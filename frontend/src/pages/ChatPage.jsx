import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConverstaionPlaceholder from "../components/NoConverstaionPlaceholder";

function ChatPage() {
  const { activeTab, selecetedUSer } = useChatStore();
  return (
    <div className='relative w-full max-w-6xl h-[800px]'>
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className='w-80 bd-slate-800/50 backdrop-blur-sm flex flex-col'>
          <ProfileHeader/>
            <ActiveTabSwitch/>
              <div className='flex1 overflow-y-auto p4 space-y-2'>
                {activeTab === "chats"  ? <ChatsList/> : <ContactList/>} 
              </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
        {selecetedUSer ? <ChatContainer/> : <NoConverstaionPlaceholder/>}

        </div>

      </BorderAnimatedContainer>
    </div>
  )
};

export default ChatPage
