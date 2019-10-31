import { CHECK_SESSION_COOKIE, SESSION_COOKIE } from './constants';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === CHECK_SESSION_COOKIE) {
    chrome.cookies.get(
      {
        url: process.env.COOKIE_URL,
        name: 'rapid.sid'
      },
      cookie => {
        sendResponse({
          type: SESSION_COOKIE,
          payload: cookie
        });
      }
    );

    return true;
  }
});

// Keep icon badge text (counter)  up-to-date
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'stats') {
    port.onMessage.addListener((msg, port) => {
      switch (msg.type) {
        case 'STATS':
          chrome.browserAction.setBadgeText({
            text: (msg.payload.nReviews + msg.payload.nRequests).toString(),
            tabId: port.sender.tab.id
          });
          break;

        case 'HAS_GSCHOLAR':
          // TODO also toggle icon (`setIcon` see https://developer.chrome.com/extensions/browserAction)
          chrome.browserAction.setIcon({
            path: {
              '16': './icons/app-icon--active@16px.png',
              '24': './icons/app-icon--active@1x.png',
              '32': './icons/app-icon--active@1.5x.png',
              '48': './icons/app-icon--active@2x.png'
            },
            tabId: port.sender.tab.id
          });
          chrome.browserAction.setBadgeBackgroundColor({
            color: msg.payload.hasGscholar ? '#ff3333' : 'grey',
            tabId: port.sender.tab.id
          });
          break;

        default:
          break;
      }
    });
  }
});