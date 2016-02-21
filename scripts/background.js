chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    if (info.status === "complete") {
        chrome.storage.local.get('hangout_url', function(result) {
            var hangout_url = result.hangout_url;
            if (hangout_url) {
                if(tab.url.toLowerCase().includes(hangout_url.split('?')[0])) {
                    keep_hangout_online(tab.id);
                }
            }
        });
    }
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
    console.log("Received an alarm.", alarm);
    chrome.windows.create({
        type: 'normal',
        focused: true,
        state: 'fullscreen'
    }, function(created_window) {
        console.log("New Google Hangouts window lunched:", created_window);
        chrome.storage.local.get('hangout_url', function(result) {
            chrome.tabs.update(created_window.tabs[0].id, {
                url: result.hangout_url
            }, function(tab) {
                console.log("Tab lunched, happy Hangouting!");
            });
        });
    });
});

function keep_hangout_online(tab_id) {
    chrome.storage.local.get('device_mode', function(result) {
        if (result.device_mode) {
            chrome.tabs.executeScript(
                tab_id,
                {
                    file: 'scripts/google-hangout-keep-online.js'
                }
            );
        }
    });
}
