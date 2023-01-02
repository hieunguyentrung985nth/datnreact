import { API_URL } from "../utils/Enviroment";

const HomeService = {
    async getFivePosts(){
        let response = await fetch(API_URL+'home/five-posts');
        let data =await response.json();
        return data;
    }
} 

export default HomeService