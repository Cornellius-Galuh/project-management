import apiFrontend from "@/config/axios"

const isLoggedIn = async () => {
    try{
        const {data} = await apiFrontend.get('/auth/whoami')
        return data.user
    }catch(error){
        return null
    }
}

export default isLoggedIn