import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
// import { format } from "timeago.js";

const Messenger = () => {
  // const [conversations, setConversations] = useState([]);
  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder="Search for friends" className="chatMenuInput" />
          <Conversation />
        </div>
      </div>

      <div className="chatBox">
        <div className="chatBoxWrapper">
          <div className="chatBoxTop">
            <Message />
            <Message own={true}/>
            <Message />
            <Message />
            <Message own={true}/>
            <Message />
          </div>
          <div className="chatBoxBottom">
            <textarea className="chatMessageInput" placeholder="write something ..."></textarea>
            <button className="chatSubmitButton">Send</button>
          </div>
        </div>
      </div>

      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          
        </div>
      </div>
    </div>
  );
};

export default Messenger;
