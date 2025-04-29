// context/NotificationContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// type NotificationType = "success" | "error";

interface InfoContextType {
  info: string,  
  setInfo: (value: string) => void;
}

const InfoContext = createContext<InfoContextType | null>(null);

export function InfoContextProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  
  useEffect(()=>{
     if(info){
        setOpen(true);
     }
  }, [info])

  return (
    <InfoContext.Provider value={{ info, setInfo }}>
      {children}
      {info && open && (
        <div
          className="w-[300px] h-auto flex justify-between items-start p-2 fixed top-1/7 left-0 lg:left-1/3 bg-gray-200  shadow-md rounded-md"
        >
          <p className="text-green-600 text-sm">{info}</p>
          <button
           type="button"
           onClick = {()=>setOpen(false)}
           className="w-[20px] h-[20px] flex justify-center items-center hover:cursor-pointer"
           >
           <p className="text-sm relative bottom-[10px] left-[8px]">&times;</p>
          </button>
        </div>
      )}
    </InfoContext.Provider>
  );
}

export function useInfoContext() {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error("useInfoContext must be used within a InfoContextProvider");
  }
  return context;
}
