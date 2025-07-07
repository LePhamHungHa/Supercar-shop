import axios from "axios";

class Service {
    static BASE_URL = "http://localhost:8080"

    //Users
    static async login(email, password){
        try{
            const response = await axios.post(`${Service.BASE_URL}/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData){
        try {
            const response = await axios.post(`${Service.BASE_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error registering user');
        }
    };

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${Service.BASE_URL}/admin/list-user`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getYourProfile(token){
        try{
            const response = await axios.get(`${Service.BASE_URL}/admin`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${Service.BASE_URL}/admin/user/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${Service.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${Service.BASE_URL}/admin/update-user/${userId}`, userData,
                {
                    headers: {Authorization: `Bearer ${token}`}
                })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    // Supercars
static async getAllSupercars() {
    try {
        const response = await axios.get(`${Service.BASE_URL}/supercars`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching supercars');
    }
}

    //AUTHENTICATION CHECKER
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')

        window.location.reload();
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }
}

export default Service;