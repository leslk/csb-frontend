import axios from "axios"
import { useServicesStore } from "@/stores/services"
import { useAuthStore } from "@/stores/auth"

interface Credentials {
    email: string
    password: string
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
                    "Content-Type": "application/json",
                },
            }
        )
        const authStore = useAuthStore();
        authStore.logout();
        return response;

    } finally {
        servicesStore.setLoading(false);
    }
  }

  static async logout() {
    const servicesStore = useServicesStore();
    servicesStore.setLoading(true);
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}api/admins/logout`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
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
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}api/admins/`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
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
                `${import.meta.env.VITE_API_URL}api/admins/${admin._id}/update`,
                admin,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }

    static async createAdmin(admin: any) {
        const servicesStore = useServicesStore();
        servicesStore.setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}api/admins/create`,
                admin,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            return response;
        }
        finally {
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
                        "Content-Type": "application/json",
                    },
                }
            )
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
                `${import.meta.env.VITE_API_URL}api/admins/${adminId}/password/update`,
                passwordData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            return response;
        } finally {
            servicesStore.setLoading(false);
        }
    }
}

export class ErrorMessage {
    static getErrorMessage(error: any) {
        return error.response.data.error;
    }
}