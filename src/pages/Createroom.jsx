import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase"; // ตรวจสอบให้แน่ใจว่านำเข้า Supabase client อย่างถูกต้อง

const CreateRoom = () => {
  const [roomName, setRoomName] = useState(""); // เก็บชื่อห้อง
  const navigate = useNavigate(); // ใช้สำหรับนำทาง

  const handleCreateRoom = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    // ตรวจสอบค่าที่ป้อน
    if (!roomName.trim()) {
      console.log("Room name is required");
      return;
    }

    try {
      // เรียกใช้ Supabase เพื่อเพิ่มข้อมูลในตาราง "rooms"
      const { data, error } = await supabase
        .from("rooms")
        .insert([{ name: roomName }]) // ส่งเฉพาะชื่อห้อง
        .select(); // ใช้ select() เพื่อรับข้อมูลที่เพิ่งเพิ่มกลับมา

      if (error) {
        throw error; // โยนข้อผิดพลาดเพื่อไปยัง catch
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from insert"); // กรณีไม่มีข้อมูลกลับมา
      }

      console.log("Room created:", data);
      navigate(`/chat/${data[0].id}`); // ใช้ id ของห้องที่สร้าง
    } catch (error) {
      console.error("Error creating room:", error.message || error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleCreateRoom} className="space-y-4">
        {/* ปุ่มกลับ */}
        <Link
          to="/"
          className="absolute top-10 left-4 flex items-center text-blue-600 hover:text-blue-800"
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
          <span className="hidden sm:inline">Back</span>
        </Link>

        {/* Input สำหรับชื่อห้อง */}
        <div>
          <label className="block text-sm font-medium">ชื่อห้องแชท</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="ใส่ชื่อห้องแชท"
          />
        </div>

        {/* ปุ่มสำหรับสร้างห้อง */}
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 rounded-lg"
        >
          สร้างห้องแชท
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
