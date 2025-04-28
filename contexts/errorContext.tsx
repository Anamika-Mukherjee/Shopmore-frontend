// context/NotificationContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// type NotificationType = "success" | "error";

interface ErrorContextType {
  error: string,  
  setError: (value: string) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorContextProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  
  useEffect(()=>{
     if(error){
        setOpen(true);
     }
  }, [error])

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      {error && open && (
        <div
          className="w-[300px] h-auto flex justify-between items-start p-2 fixed top-1/7 left-1/3 bg-gray-200  shadow-md rounded-md"
        >
          <p className="text-red-500 text-sm">{error}</p>
          <button
           type="button"
           onClick = {()=>setOpen(false)}
           className="w-[20px] h-[20px] flex justify-center items-center hover:cursor-pointer"
           >
           <p className="text-sm relative bottom-[10px] left-[8px]">&times;</p>
          </button>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within a ErrorContextProvider");
  }
  return context;
}
