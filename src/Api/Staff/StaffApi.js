import axiosClient from "../axiosClient";

const StaffApi = {
    upPost(post){
        const url = 'posts';
        return axiosClient.post(url, post);
    },
    updatePost(post){
        const url = 'posts/' + post.id;
        return axiosClient.put(url, post);
    },
    uploadImage(file,id){
        const url = 'posts/'+id;
        return axiosClient.post(url, file);
    },
    getAllCategories(){
        const url = 'categories/get-all';
        return axiosClient.get(url);
    },
    getMyPosts(page){
        const url = 'posts/my-posts?page='+page;
        return axiosClient.get(url);
    }
}
export default StaffApi;