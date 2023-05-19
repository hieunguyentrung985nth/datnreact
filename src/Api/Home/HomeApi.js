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
    },
    morePost(category,page){
        const url ='home/more-post';
        return axiosClient.post(url, {categoryids:category, page:page});
    },
    getAllCategories(){
        const url = 'categories/all-categories';
        return axiosClient.get(url);
    },
    getCategoryPosts(slug,page){
        const url = 'home/category-posts?slug='+slug+'&page='+page;
        return axiosClient.get(url);
    }
}

export default HomeApi