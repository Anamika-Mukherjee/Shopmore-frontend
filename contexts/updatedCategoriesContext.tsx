//context to store product data when category filter is applied
"use client";
import {createContext, useContext, useState} from "react";

interface UpdatedCategoriesContextType{
    updatedCategories: Category[];
    setUpdatedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const UpdatedCategoriesContext = createContext<UpdatedCategoriesContextType | null>(null);

export const useUpdatedCategoriesContext = ()=>{
     const context = useContext(UpdatedCategoriesContext);

     if(!context){
        throw new Error("useUpdatedCategoriesContext can only be used within useUpdatedCategoriesContextProvider");
     }

     return context;
}

export const UpdatedCategoriesContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [updatedCategories, setUpdatedCategories] = useState<Category[]>([]);
  
    return (
      <UpdatedCategoriesContext.Provider value={{ updatedCategories, setUpdatedCategories }}>
        {children}
      </UpdatedCategoriesContext.Provider>
    );
  };
