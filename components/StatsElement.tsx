import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

interface StatsElementProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatsElement: React.FC<StatsElementProps> = ({ title, value, change, isPositive, icon }) => {
  const changeColor = isPositive ? "text-green-400" : "text-red-400";
  const ChangeIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <div className="w-full h-32 flex flex-col justify-center items-center rounded-lg p-4
                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white
                dark:bg-black/20 dark:border-gray-700">
      <div className="flex items-center gap-x-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex flex-col items-start">
          <h4 className="text-lg text-gray-300">{title}</h4>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className={`${changeColor} flex gap-x-1 items-center text-sm`}>
            <ChangeIcon />
            {change} Since last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsElement;
