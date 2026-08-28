// src/types/instructor.ts
export interface InstructorWithUser {
    id: string; // Instructor.id — el que necesita Schedule.instructorId
    bio: string | null;
    specialty: string | null;
    user: {
        id: string; // User.id — distinto del Instructor.id de arriba
        fullName: string;
        email: string;
    };
}