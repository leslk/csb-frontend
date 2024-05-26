import axios from 'axios';
import { useServicesStore } from '@/stores/services';
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';
import { type Credentials } from './types';
import 'moment/dist/locale/fr';


/**
 * This class contains all the methods to interact with the API for the authentication
 */
export class Auth {
    /**
     * This method checks if the user is authenticated
     * @param userCredentials The credentials of the user
     * @returns The response from the API
     */
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

    /**
     * This method resets the password
     * @param adminId The id of the account
     * @param passwordData The new password
     * @returns The response from the API
     */
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

    /**
     * This method sends an email to the user to reset the password
     * @param email The email of the user
     * @returns The response from the API
     */
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

    /**
     * This method logs out the user
     * @returns The response from the API
     */
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


/**
 * This class contains all the methods to interact with the API for the admin
 */
export class Admin {
    /**
     * This method gets all the accounts
     * @returns The response from the API
     */
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

    /**
     * This method resend the invitation to the pending account
     * @param adminId The id of the account
     * @returns The response from the API
     */
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

    /**
     * This method updates the account
     * @param admin The account to update
     * @returns The response from the API
     */
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

    /**
     * This method creates the account
     * @param admin The account to create
     * @returns The response from the API
     */
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

    /**
     * This method checks the token
     * @param id The id of the account
     * @param token The token
     * @returns The response from the API
     */
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

    /**
     * This method deletes the account
     * @param adminId The id of the account
     * @returns The response from the API
     */
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

    /**
     * This method updates the password
     * @param adminId The id of the account
     * @param passwordData The new password
     */
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

    /**
     * This method creates the password
     * @param adminId The id of the account
     * @param passwordData The new password
     */
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

/**
 * This class contains all the methods to interact with the API for the tournament
 */
export class Tournament {
    /**
     * This method creates the tournament
     * @param tournament The tournament to create
     * @returns The response from the API
     */
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

    /**
     * This method gets all the tournaments
     * @returns The response from the API
     */
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

    /**
     * This method gets a tournament
     * @param tournamentId The id of the tournament
    */
    static async getTournament(tournamentId: string) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournamentId}`,
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

    /**
     * This method updates the tournament
     * @param tournament The tournament to update
     * @returns The response from the API
     */
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

    /**
     * This method adds the tournament history
     * @param tournamentId The id of the tournament
     * @param tournamentHistory The history of the tournament
     * @returns The response from the API
     */
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

    /**
     * This method add a participant to the tournament
     * @param tournamentId The id of the tournament
     * @param participant The participant to add
     * @returns The response from the API
     */
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

    /**
     * This method add a participant to the tournament
     * @param tournamentId The id of the tournament
     * @param participant The participant to add
     * @returns The response from the API
     */
    static async userAddParticipant(tournamentId: string, participant: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/tournaments/${tournamentId}/user-participants`,
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


    /**
     * This method deletes a participant from the tournament
     * @param tournamentId The id of the tournament
     * @param participantId The id of the participant
     * @returns The response from the API
     */
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

/**
 * This class contains all the methods to interact with the API for the upload
 */
export class Upload {
    /**
     * This method uploads an image
     * @param image The image to upload
     * @returns The response from the API
     */
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

    /**
     * This method deletes an image
     * @param imageUrl The url of the image to delete
     * @returns The response from the API
     */
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

/**
 * This class contains all the methods to interact with the API for the site content
 */
export class ErrorMessage {
    /**
     * This method gets the error message from the response
     * @param error The error
     * @returns The error message
     */
    static getErrorMessage(error: any) {
        console.log(error);
        return error.response.data.error;
    }
}

/**
 * This class contains all the methods to interact with the API for the site content
 */
export class DateUtils {
    /**
     * This method formats the date
     * @param date The date to format
     * @returns The formatted date
     */
    static formatDate(date: string) {
        moment.locale('fr');
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

    /**
     * This method formats the date in the format DD/MM/YYYY
     * @param date The date to format
     * @returns The formatted date
     */
    static getDate(date: string) {
        return moment(date).format('DD/MM/YYYY');
    }

    /**
     * This method formats the date in the format HH:mm
     * @param date The date to format
     * @returns The formatted date
     */
    static getTime(date: string) {
        moment.locale('fr');
        return moment(date).format('HH:mm');
    }
}

/**
 * This class contains all the methods to interact with the API for the site content
 */
export class SiteContent {
    /**
     * This method gets the site content
     * @returns The response from the API
     */
    static async getSiteContent() {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/siteContent`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } finally {
            serviceStore.setLoading(false);
        }
    }

    /**
     * This method updates the site content
     * @param siteContent The site content to update
     * @returns The response from the API
     */
    static async updateSiteContent(siteContent: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}api/siteContent`,
                siteContent,
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

/**
 * This class contains all the methods to interact with the API for the contact
 */
export class Contact {
    /**
     * This method gets the contact
     * @param contactData The contact data
     * @returns The response from the API
     */
    static async sendMessage(contactData: any) {
        const serviceStore = useServicesStore();
        serviceStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/contact`,
                contactData,
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
