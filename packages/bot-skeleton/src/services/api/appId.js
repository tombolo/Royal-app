import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';
import { getAppId, getSocketURL, website_name } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import APIMiddleware from './api-middleware';

export const generateDerivApiInstance = () => {
    // getSocketURL() already includes wss://.../websockets/v3?app_id=...
    let socket_url = getSocketURL();

    // If you want to add language and brand, append them as query params
    const url = new URL(socket_url);
    url.searchParams.set('l', getLanguage());
    url.searchParams.set('brand', website_name.toLowerCase());

    const deriv_socket = new WebSocket(url.toString());
    const deriv_api = new DerivAPIBasic({
        connection: deriv_socket,
        middleware: new APIMiddleware({}),
    });
    return deriv_api;
};

export const getLoginId = () => {
    const login_id = localStorage.getItem('active_loginid');
    if (login_id && login_id !== 'null') return login_id;
    return null;
};

export const getToken = () => {
    const active_loginid = getLoginId();
    const client_accounts = JSON.parse(localStorage.getItem('client.accounts')) || undefined;
    const active_account = (client_accounts && client_accounts[active_loginid]) || {};
    return {
        token: active_account?.token || undefined,
        account_id: active_loginid || undefined,
    };
};
