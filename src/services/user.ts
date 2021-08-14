import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
    return request({
        url: '/admin/info',
        method: 'get'
    });
}

export async function queryMessage(): Promise<any> {
    return request({
        url: '/user/message'
    });
}

export async function doLogout(): Promise<any> {
    return request({
        url: '/admin/doLogout',
        method: 'post'
    });
}