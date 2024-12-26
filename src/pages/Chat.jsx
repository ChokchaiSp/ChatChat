import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthContext";
import { SendHorizontal } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const Chat = () => {
  const { user } = useAuth();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");
  const [image, setImage] = useState(null);
  const [roomName, setRoomName] = useState(""); // State to hold the room name
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) console.log("Error fetching messages: ", error);
      else setMessages(data || []);
    };

    // Fetch room name
    const fetchRoomName = async () => {
      const { data, error } = await supabase
        .from("rooms") // Assuming you have a "rooms" table
        .select("name")
        .eq("id", roomId)
        .single(); // Fetch single room based on roomId

      if (error) {
        console.log("Error fetching room name: ", error);
      } else {
        setRoomName(data?.name || "Room Name"); // Default if no name found
      }
    };

    fetchMessages();
    fetchRoomName();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((m) => [...m, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const uploadImage = async (file) => {
    try {
      if (!file) {
        console.error("No file selected for upload.");
        return null;
      }

      const uniqueFileName = `${Date.now()}-${file.name}`;
      const filePath = `chat_images/${uniqueFileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("chat_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return null;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase
        .storage
        .from("chat_images")
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error("Error getting public URL:", publicUrlError);
        return null;
      }

      return publicUrlData?.publicUrl;
    } catch (err) {
      console.error("Unexpected error in uploadImage:", err);
      return null;
    }
  };

  const handleSentMessage = async (e) => {
    e.preventDefault();
    if (!newMessages.trim() && !image) return;

    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage(image);
      setImage(null);
    }

    const { error } = await supabase.from("messages").insert([{
      content: newMessages,
      user_id: user.id,
      user_email: user.email,
      room_id: roomId,
      image_url: imageUrl,
    }]);

    if (error) console.error("Error sending message:", error);
    else setNewMessages("");
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm("คุณจะลบข้อความนี้?");
    if (confirmDelete) {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        console.error("Error deleting message:", error);
      } else {
        setMessages(messages.filter((msg) => msg.id !== messageId));
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <Link
          to="/"
          className="absolute top-10 left-4 flex items-center text-blue-500 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5m7-7l-7 7 7 7"
            />
          </svg>
        </Link>
        {/* Display Room Name */}
        <div className="text-center text-xl mb-4">
          ห้องแชท <strong>{roomName || "Loading..."}</strong>
        </div>
        <div className="h-[600px] p-4 overflow-y-auto">

        {messages.map((message) => (
  <div
    key={message.id}
    className={`flex mb-4 ${message.user_id === user.id ? "justify-end" : "justify-start"}`}
  >
    {message.user_id === user.id && (
      <button
        onClick={() => handleDeleteMessage(message.id)}
        className="mr-2 text-white bg-gray-600 hover:gray-800 p-1 rounded-full"
      >
        ...
      </button>
    )}
    <div
      className={`relative rounded-lg px-3 py-2 max-w-xs lg:max-w-md ${message.user_id === user.id
        ? "bg-sky-500 text-white"
        : "bg-gray-100 text-gray-800"
        }`}
    >
      <div className="text-sm mb-1">
        <strong>{message.user_id === user.id ? "" : message.user_email}</strong>
      </div>
      <div style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
        {message.content}
      </div>
      {message.image_url && (
        <Zoom>
          <img
            src={message.image_url}
            alt="Sent image"
            className="mt-2 max-w-xs max-h-48 object-cover rounded-lg"
          />
        </Zoom>
      )}
    </div>
  </div>
))}

          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSentMessage} className="p-4 border-t">
          <div className="flex space-x-4 items-center">
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-images">
                <path d="M18 22H4a2 2 0 0 1-2-2V6" /><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
                <circle cx="12" cy="8" r="2" /><rect width="16" height="16" x="6" y="2" rx="2" />
              </svg>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={newMessages}
              onChange={(e) => setNewMessages(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="inline-flex items-center px-2 py-2 bg-sky-600 text-white rounded-lg"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
