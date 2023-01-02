import axiosClient from "../axiosClient";

const AdminApi = {
    addStaff(staff) {
        const url = 'staffs';
        return axiosClient.post(url, staff);
    },
    getStaff(page) {
        const url = 'staffs?page=' + page;
        return axiosClient.get(url);
    },
    statistical(){
        const url = 'admin/statistical';
        return axiosClient.get(url);

    }
}

export default AdminApi;
