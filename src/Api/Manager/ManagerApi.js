import axiosClient from "../axiosClient";

const ManagerApi = {
    getApprovePosts(page) {
        const url = 'posts/approve-posts?page=' + page;
        return axiosClient.get(url);
    },
    getMoreNotifications(id, page) {
        const url = 'notifications?id=' + id + '&page=' + page;
        return axiosClient.get(url);
    },
    approvePost(id) {
        const url = 'posts/approve-post';
        return axiosClient.post(url, { id: id });
    },
    declinePost(id, feed) {
        const url = 'posts/decline-post/' + id;
        return axiosClient.post(url, feed);
    },
    getAllPosts(page) {
        const url = 'posts/all-posts?page=' + page;
        return axiosClient.get(url);
    },
    updatePost(post) {
        const url = 'posts/update-post?id=' + post.id;
        return axiosClient.put(url, post);
    },
    deletePost(id) {
        const url = 'posts/delete-post?id=' + id;
        return axiosClient.delete(url);
    },
    addCategory(category) {
        const url = 'categories';
        return axiosClient.post(url, category);
    },
    getCategory(page) {
        const url = 'categories?page=' + page;
        return axiosClient.get(url);
    },
    getAllCategories() {
        const url = 'categories/get-all';
        return axiosClient.get(url);
    },
    updateCategory(category) {
        const url = 'categories/' + category.id;
        return axiosClient.put(url, category);
    },
    deleteCategory(id) {
        const url = 'categories/' + id;
        return axiosClient.delete(url);
    }
}

export default ManagerApi;