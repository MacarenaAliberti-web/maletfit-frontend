// src/types/routine.ts
export interface RoutineExercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weightKg: number | null;
    orderIndex: number;
}

export interface Routine {
    id: string;
    title: string;
    notes: string | null;
    exercises: RoutineExercise[];
}

export interface RoutineWithStudent extends Routine {
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}