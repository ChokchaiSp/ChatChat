
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabase"; 


import React from 'react'

const handleSignUp = async (email,password)=>{
  try{
    const {data , error} = await supabase.auth .signUp({
      email,
      password,
      options:{
        emailRedirectTo:`${window.location.origin}/chatroom`,
        data:{
          registration_data: new Date().toISOString(),
        }
      }
    });
    if(data?.user){
      alert('กรุญาเช็ค email ของคุณเพื่อยืนยันการลงทะเบียน');
    }
    if(error){
      throw error
    }
  }catch(error){
    alert(error.message);
    
  }
 
}

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-sky-400 p-8 rounded-lg shadow">
        <h2 className=" mt-2 mb-6 text-center text-3xl font-bold text-white">
            เข้าสู่ระบบ
        </h2>

        <Auth 
          supabaseClient={supabase}
          providers={['github' , 'facebook']}
          onSingUp = {({email,password})=>( handleSignUp(email,password))}
          redirectTo={`${window.location.origin}/chatroom`}
          appearance={ {
            theme: ThemeSupa,
            variables:{
              default:{
                colors:{
                  brand:'#0381F8FF',
                  brandAccent:'#4338ca'
                }
              }
            }
          } }
          localization={{
            variables:{
              sign_up:{
                email_label: 'อีเมล',
                password_label:'รหัสผ่าน',
                email_input_placeholder:'กรอกอีเมลของคุณ',
                password_input_placeholder:'กรอกรหัสผ่านของคุณ',
                button_label:'ลงทะเบียน',
                loading_button_label:'กำลังลงทะเบียน....',
                social_provider_text:'ลงทะเบียนด้วย{{provider}}',
                link_text:'ยังไม่มีบัญชี? ลงทะเบียน',
              },
              sign_in:{
                email_label: 'อีเมล',
                password_label:'รหัสผ่าน',
                email_input_placeholder:'กรอกอีเมลของคุณ',
                password_input_placeholder:'กรอกรหัสผ่านของคุณ',
                button_label:'เข้าสู่ระบบ',
                loading_button_label:'กำลังเข้าสู่ระบบ....',
                social_provider_text:'เข้าสู่ระบบด้วย{{provider}}',
                link_text:'เข้าสู่ระบบ',
              }
            }
            }}
        />


      </div>
      


    </div>
  )
}

export default Login
