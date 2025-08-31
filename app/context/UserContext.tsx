
// app/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  age: number | null;
  setAge: (age: number) => void;
  gender: string | null;
  setGender: (gender: string) => void;
  skinType: string;
  setSkinType: (type: string) => void;
  waterIntake: number;
  setWaterIntake: (intake: number) => void;
  skinConcerns: string[];
  setSkinConcerns: (concerns: string[]) => void;
  routinePreferences: string;
  setRoutinePreferences: (pref: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [skinType, setSkinType] = useState('normal');
  const [waterIntake, setWaterIntake] = useState(0); // Cups, e.g., 6/8
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [routinePreferences, setRoutinePreferences] = useState('');

  return (
    <UserContext.Provider value={{
      userName, setUserName,
      age, setAge,
      gender, setGender,
      skinType, setSkinType,
      waterIntake, setWaterIntake,
      skinConcerns, setSkinConcerns,
      routinePreferences, setRoutinePreferences,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};