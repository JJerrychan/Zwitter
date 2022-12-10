// import axios from "axios";
// import { useEffect, useState } from "react";
import "./Messenger.css";

export default function Conversation({ conversation, currentUser }) {
//   const [user, setUser] = useState(null);
//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;

//   useEffect(() => {
//     const friendId = conversation.members.find((m) => m !== currentUser._id);

//     const getUser = async () => {
//       try {
//         const res = await axios("/users?userId=" + friendId);
//         setUser(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     getUser();
//   }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src="https://images.pexels.com/photos/40142/new-york-skyline-manhattan-hudson-40142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt=""
      />
      {/* <span className="conversationName">{user?.username}</span> */}
      <span className="conversationName">zxy</span>
    </div>
    // <div>ss</div>
  );
}
