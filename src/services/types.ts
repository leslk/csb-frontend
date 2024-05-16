export interface Tournament {
    city: string;
    address: string;
    zipCode: string;
    availablePlaces: number;
    participants: any[];
    startDate: string;
    description?: string;
    status: string;
    tournamentHistory: TournamentHistory;
    price: number;
    _id?: string;
}

export interface TournamentHistory {
    content: string | null;
    images: string[];
    title: string | null;
    _id?: string;
}

export interface Participant {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    payment: string;
    _id?: string;
}

export interface AdminAccount {
    email: string;
    firstName: string;
    lastName: string;
    _id?: string;
    isSuperAdmin: boolean;
    status: string;
}

export interface Member {
    firstName: string;
    lastName: string;
    role: string;
    image: string;
    _id?: string;
}

export interface Contact {
    facebook: string;
    instagram: string;
    tiktok: string;
    email: string;
    _id?: string;
}

export interface SiteContent {
    aboutUs: string;
    contact: Contact;
    members: Member[];
    _id?: string;
}
