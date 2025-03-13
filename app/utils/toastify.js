import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

// Success Notification
export const notifySuccess = (msg) => {
    return Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Thành công',
        textBody: msg,
        autoClose: 1000,
    });
};

// Error Notification
export const notifyError = (msg) => {
    return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Lỗi',
        textBody: msg,
        autoClose: 1000,
    });
};