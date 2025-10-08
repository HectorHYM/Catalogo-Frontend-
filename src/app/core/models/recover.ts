export interface Recover{
    email: string;
    tokenType: string;
    flow: 'set' | 'recover';
}