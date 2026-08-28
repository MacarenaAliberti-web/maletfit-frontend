export type GymClass = {
    id: string
    name: string
    instructor: string
    day: string
    time: string
    capacity: number
    booked: number
    category: "Fuerza" | "Cardio" | "Movilidad" | "HIIT"
}

export const categoryStyles: Record<
    GymClass["category"],
    { label: string; className: string }
> = {
    Fuerza: { label: "Fuerza", className: "bg-chart-4/15 text-chart-4" },
    Cardio: { label: "Cardio", className: "bg-chart-2/15 text-chart-2" },
    Movilidad: { label: "Movilidad", className: "bg-chart-5/15 text-chart-5" },
    HIIT: { label: "HIIT", className: "bg-primary/15 text-primary" },
}

