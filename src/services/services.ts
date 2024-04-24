import axios from 'axios';
import { useServicesStore } from '@/stores/services';
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';
import 'moment/dist/locale/fr';

interface Credentials {
    email: string;
    password: string;
}

export class Auth {
    static async login(userCredentials: Credentials) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/admins/login`,
                userCredentials,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const authStore = useAuthStore();
            authStore.logout();
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async resetPassword(adminId: string, passwordData: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}/resetPassword`,
                passwordData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async forgetPassword(email: string) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/admins/forgetPassword`,
                { email },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async logout() {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/admins/logout`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }
}

export class Admin {
    static async getAccounts() {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/admins/`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async resendInvitation(adminId: string) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}/sendInvitation`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async updateAdmin(admin: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/admins/${admin._id}`,
                admin,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async createAdmin(admin: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}api/admins`, admin, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async checkToken(id: string, token: string) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}api/admins/checkToken/${id}/${token}`,
                {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async deleteAdmin(adminId: string) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async updatePassword(adminId: string, passwordData: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}/password`,
                passwordData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async createPassword(adminId: string, passwordData: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}/password`,
                passwordData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }
}

export class Tournament {
    static async createTournament(tournament: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/tournaments`,
                tournament,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async getTournaments() {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/tournaments`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async updateTournament(tournament: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournament._id}`,
                tournament,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }

    static async addTournamentHistory(tournamentId: string, tournamentHistory: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournamentId}/tournamentHistory`,
                tournamentHistory,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }

    static async addParticipant(tournamentId: string, participant: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournamentId}/participants`,
                participant,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }

    static async deleteParticipant(tournamentId: string, participantId: string) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournamentId}/participants/${participantId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }
}

export class Upload {
    static async uploadImage(image: any) {
        const form = new FormData();
        form.append('image', image);

        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}api/upload`, form, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }

    static async deleteImage(imageUrl: string) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}api/upload?imageUrl=${imageUrl}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }
}

export class ErrorMessage {
    static getErrorMessage(error: any) {
        return error.response.data.error;
    }
}

export class DateUtils {
    static formatDate(date: string) {
        const targetDate = moment(date);
        const currentDate = moment();
        const currentDateTimestamp = currentDate.valueOf();
        const targetDateTimestamp = targetDate.valueOf();
        // Calcul de la différence entre la date cible et la date actuelle
        const timeDifference = targetDate.diff(currentDate, 'milliseconds');
        const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

        // Si la date est dans les 3 prochains jours
        if (
            targetDateTimestamp > currentDateTimestamp &&
            timeDifference < threeDaysInMilliseconds
        ) {
            const isToday = targetDate.isSame(currentDate, 'day');
            const isTomorrow = targetDate.isSame(currentDate.add(1, 'days'), 'day');
            const dayName = isToday
                ? "Aujourd'hui"
                : isTomorrow
                  ? 'Demain'
                  : targetDate.format('dddd');
            return `${dayName} à ${targetDate.format('HH:mm')}`;
        } else {
            return targetDate.format('DD MMM YYYY à HH:mm');
        }
    }
}
