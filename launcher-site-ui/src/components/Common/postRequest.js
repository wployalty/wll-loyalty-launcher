import axios from "axios";

export const postRequest = (params, url = wll_localize_data.ajax_url) => {
    let headers = {"Content-Type": "multipart/form-data",};
    params.is_admin_side = false;
    let data = new FormData();
    if (params) {
        Object.keys(params).map((key) => {
            data.append(key, params[key])
        });
    }
    return axios({
        method: "POST",
        url,
        data,
        headers,
    })
};