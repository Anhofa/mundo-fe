import React from "react";
import Header from "@/components/ui/Header/Header.tsx";

const InfoChange: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen w-90vw mx-auto justify-center relative">
        <Header />
        <div className="flex mt-[100px] felx-1 overflow-hidden justify-center border-radius-8 bg-white shadow-lg max-w-900">
          <div className="font-bold text-[1.25rem] text-black"> 个人资料编辑</div>
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <label htmlFor="username"> 用户名 </label>
            <input className="font-bold text-[1.25rem] text-black" id="username" />
          </div>
          <div>
            <label htmlFor="email"> 邮箱 </label>{" "}
            <input className="font-bold text-[1.25rem] text-black" id="email" />
          </div>

          <div>
            <label htmlFor=""></label>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoChange;
