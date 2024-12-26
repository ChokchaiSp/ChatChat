import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [showMenu, setShowMenu] = useState(null);  // เพื่อจัดการการแสดงเมนูตัวเลือก
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) console.log("Error fetching rooms:", error);
      else setRooms(data || []);
    };

    fetchRooms();
  }, []);

  
  

  return (
    <div className="max-w-4xl mx-auto relative border p-6 rounded-lg shadow-lg">
      {/* ปุ่มกลับอยู่ด้านบน */}
      <Link
        to="/createroom"
        className="absolute top-7 right-5 flex items-center text-blue-600 hover:text-blue-800"
      >
        สร้างห้องแชท
      </Link>

      <h1 className="text-xl font-bold mb-4 text-center">ห้องแชท</h1>
      <div className="flex flex-col space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-4 border border-black rounded-lg bg-sky-500/50 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-between cursor-pointer" // เปลี่ยน border-gray-300 เป็น border-black
            onClick={() => navigate(`/chat/${room.id}`)} // คลิกที่กรอบทั้งหมดจะนำไปที่หน้าห้อง
          >
            <div className="flex items-center">
          
              {/* ชื่อห้อง */}
              <span className=" text-lg">ห้องแชท <strong>{room.name}</strong></span>
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
