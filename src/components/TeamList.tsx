import React from "react";

interface Team {
  id: string;
  teamname: string;
  introduction: string;
  Now: number;
  MAX: number;
}

interface TeamProps {
  Teams: Team[];
}

const TeamList: React.FC<TeamProps> = ({ Teams }) => {
  return (
    <div>
      {Teams.length === 0 ? (
        <p> No Items here</p>
      ) : (
        <>
          <div className="flex py-2 w-full self-strech">
            <ul className="flex flex-col gap-2 w-full">
              {Teams.map((team) => (
                <li
                  key={team.id}
                  className="bg-gray-100 border border-gray-400 rounded p-4 relative text-left w-full"
                >
                  <h3 className="font-bold text-lg mb-1">{team.teamname}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {team.introduction}
                  </p>
                  <p className="text-sm">
                    {" "}
                    人数: {team.Now}/{team.MAX}
                  </p>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded absolute bottom-4 right-4">
                    编辑
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamList;
