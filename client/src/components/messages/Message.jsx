import "./Messenger.css";

const Message = ({own}) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/40142/new-york-skyline-manhattan-hudson-40142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
        />
        <p className="messageText"> Hello this is a message</p>
      </div>
      <div className="messageBottom">1 hour ago</div>
    </div>
  );
};

export default Message;
