import "./Messenger.css";

const ChatOneline = () => {
  return (
    <div className="chatOneline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg"
            src="https://images.pexels.com/photos/40142/new-york-skyline-manhattan-hudson-40142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Zxy</span>
      </div>
    </div>
  );
};

export default ChatOneline;
