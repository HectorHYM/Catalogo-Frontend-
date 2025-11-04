export interface User {
    name: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    flow: 'set' | 'recover';
}
