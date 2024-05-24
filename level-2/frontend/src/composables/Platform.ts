import axios from "axios"

const baseUrl : string = 'http://localhost:3001'

const Platform = () => {

    const getAvailability = async (id: number, url: string, username: string, retry: boolean = false) => {
        try {

            const response = await axios.post(baseUrl + '/check-availability', { id: id, url: url, username: username, retry: retry }, {headers: {}})
            return response
        } catch (err : any) {

        }
    }

    return {
        getAvailability
    }
}

export default Platform
