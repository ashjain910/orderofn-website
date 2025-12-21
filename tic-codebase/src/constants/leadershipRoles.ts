export const LEADERSHIP_ROLE_OPTIONS = [
    { value: "coordinator", label: "Coordinator" },
    { value: "hod", label: "HOD" },
    { value: "assistant_principal", label: "Assistant Principal" },
    { value: "principal", label: "Principal" },
];

export function getLeadershipRoleLabel(value: string): string {
    const found = LEADERSHIP_ROLE_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
}
