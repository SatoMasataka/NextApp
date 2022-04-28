import {
    createContext,
    Dispatch,
    // FC,
    SetStateAction,
    // useCallback,
    // useContext,
    // useState,
} from "react";
export const dataContext = createContext<{
    setTheme: Dispatch<SetStateAction<string>>, theme: string
}>({ setTheme: () => { }, theme: "" })

