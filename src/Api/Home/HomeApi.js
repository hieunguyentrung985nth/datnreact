import axiosClient from "../axiosClient";

const HomeApi = {
    getFivePosts(){
        const url = 'home/five-posts';
        return axiosClient.get(url);
    },
    getPopularPosts(){
        const url = 'home/month-post';
        return axiosClient.get(url);
    },
    getAllPosts(page){
        const url = 'home/all-posts?page='+page;
        return axiosClient.get(url);
    },
    getDetail(slug){
        const url = 'home/detail?slug='+slug;
        return axiosClient.get(url);
    },
    searchPost(search,page){
        const url ='home/search-post?search='+search+'&page='+page;
        return axiosClient.get(url);
      }

}

export default HomeApi