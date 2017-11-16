import Xext from './external-api';
import Exts from './exts';
import manager from './manager';
import App from '../core';

global.Xext = Xext;

// load exts modules
const loadModules = () => {
    Exts.exts.forEach(ext => {
        if (ext.isDev) {
            const reloadExt = manager.reloadDevExtension(ext);
            if (reloadExt) {
                ext = reloadExt;
            }
        }

        if (ext.hasModule) {
            if (ext.lazy) {
                if (DEBUG) {
                    console.collapse('Extension Lazy load', 'greenBg', this.name, 'greenPale');
                    console.log('extension', ext);
                    console.groupEnd();
                }
            } else {
                ext.loadModule(Xext);
            }
        }
    });
};

// Listen events
App.server.onUserLogin((user, error) => {
    if (!error) {
        Exts.exts.forEach(ext => {
            ext.callModuleMethod('onUserLogin', user);
        });
    }
});

App.server.onUserLoginout((user, code, reason, unexpected) => {
    Exts.exts.forEach(ext => {
        ext.callModuleMethod('onUserLoginout', user, code, reason, unexpected);
    });
});

App.profile.onUserStatusChange((status, oldStatus, user) => {
    Exts.exts.forEach(ext => {
        ext.callModuleMethod('onUserStatusChange', status, oldStatus, user);
    });
});

App.im.server.onSendChatMessages((messages, chat) => {
    Exts.exts.forEach(ext => {
        ext.callModuleMethod('onSendChatMessages', messages, chat, App.profile.user);
    });
});

App.im.server.onReceiveChatMessages((messages) => {
    Exts.exts.forEach(ext => {
        ext.callModuleMethod('onReceiveChatMessages', messages, App.profile.user);
    });
});

export default {
    loadModules,
};
