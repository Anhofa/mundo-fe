import React, { useState, useEffect } from "react";
import TeamList from "@/components/TeamList.tsx";
import Header from "@/components/ui/Header/Header.tsx";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
interface Team {
  id: string;
  teamname: string;
  introduction: string;
  Now: number;
  MAX: number;
}
interface User {
  id: string;
  img: string;
  name: string;
  email: string;
}

const InfoManage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchedTeams: Team[] = [
      {
        id: "1",
        teamname: "Team A",
        introduction: "Team A Introduction",
        Now: 5,
        MAX: 10,
      },
      {
        id: "2",
        teamname: "Team B",
        introduction: "Team B Introduction",
        Now: 3,
        MAX: 5,
      },
    ];
    setTeamList(fetchedTeams);
  }, []);

  useEffect(() => {
    const fetchedUser: User = {
      id: "1",
      img: "2",
      name: "用户名",
      email: "123321@qq.com",
    };
    setUser(fetchedUser);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen w-[90vw] mx-auto relative">
        <Header />
        <div className="flex flex-col mt-[12vh] w-[90vw] felx-1 overflow-hidden rounded-sm bg-white shadow-lg">
          <div className="flex flex-row w-full relative">
            <div className="w-[6.25rem] h-[6.25rem] rounded-full ml-[1.25rem] mt-[1.25rem] overflow-hidden">
              <img
                src="https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg"
                className="w-full h-full object-cover "
                alt="UserImage"
              />
            </div>
            <div className="flex flex-col ml-[0.625rem] mt-[1.25rem] text-left gap-2 h-[6.25rem] justify-center align-center">
              <p className="font-bold text-[1.25rem] text-black">
                {user?.name}
              </p>
              <p className="text-[1rem] text-black">{user?.email}</p>
            </div>
            <button className="felx p-[0.2rem_0.5rem] absolute right-[1rem] top-[1rem] bg-blue-500 rounded-sm">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <p className="text-[1rem] text-white cursor-pointer">
                    修改个人信息
                  </p>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex flex-col gap-4">
                      <Dialog.Title className="text-[1.5rem] font-bold text-center text-black">
                        个人资料编辑
                      </Dialog.Title>
                      <div className="mt-4 flex flex-col items-center relative">
                        <div className="relative w-20 h-20 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
                          <img
                            src="https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg"
                            alt="头像"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 absolute right-0 bottom-0">
                          点击头像上传新头像
                        </p>
                      </div>

                      <div className="mt-4 flex flex-row w-full">
                        <p className="font-medium text-[1.25rem] text-black ">
                          用户名：
                        </p>
                        <input
                          type="text"
                          //   onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-2 flex justify-center gap-10 w-full">
                        <button className="px-8 py-2 text-blue-600 bg-gray-100 border border-blue-600 rounded-md">
                          修改密码
                        </button>
                        <Dialog.Close asChild>
                          <button className="px-8 py-2 bg-blue-600 text-white rounded-md">
                            提交表单
                          </button>
                        </Dialog.Close>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
                        <Cross2Icon />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </button>
          </div>

          <div className="flex flex-col justify-center w-full p-[1.25rem]">
            <div className="flex flex-row justify-between relative w-full">
              <p className="font-bold text-[1.25rem] text-black">我的队伍</p>
              <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <p className="text-[1rem] text-blue-500"> 创建新队伍</p>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                      <div className="flex flex-col gap-4">
                        <Dialog.Title className="text-[1.5rem] font-bold text-center text-black">
                          组队资料
                        </Dialog.Title>

                        <div className="mt-4 flex flex-row w-full">
                          <p className="font-medium text-[1.25rem] text-black ">
                            标题：
                          </p>
                          <input
                            type="text"
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[1.5rem] focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <p className="font-medium text-[1.25rem] text-black ">
                            描述：
                          </p>
                          <input
                            type="text"
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <p className="font-medium text-[1.25rem] text-black ">
                            要求：
                          </p>
                          <input
                            type="text"
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 mx-2 flex-1 rounded-sm border border-gray-300 h-[6rem] focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex flex-row w-full">
                          <p className="font-medium text-[1.25rem] text-black ">
                            人数：
                          </p>
                          <input
                            type="text"
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 mx-2 w-[1.5rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="font-medium text-[1.25rem] text-black ">/</p>
                          <input
                            type="text"
                            value={""}
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 mx-2 w-[1.5rem] h-[1.5rem] rounded-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                
                        <div className="mt-2 flex justify-center gap-10 w-full">
                          <Dialog.Close asChild>
                            <button className="px-8 py-2 bg-blue-600 text-white rounded-md">
                              提交表单
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>
                      <Dialog.Close asChild>
                        <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
                          <Cross2Icon />
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
            </div>
            <TeamList Teams={teamList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoManage;
