//ContentScrips are what run on the webpages
(() => {
    let youtubeLeftControls, youtubePlayer
    let currentVideo = ""
    let currentVideoBookmarks = [];

    //console.log(currentVideo + "check1")
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj 
        if (type == "NEW") {
            currentVideo = videoId 
            //console.log(currentVideo + "check2")
            newVideoLoaded()
        } else if (type == "PLAY") {
            youtubePlayer.currentTime = value
        } else if (type == "DELETE") {
            console.log("does this shit work")
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value)
            chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)})

            response(currentVideoBookmarks)
        }
        //console.log('background is actually running')
        //console.log(currentVideo)
    })

    //console.log(typeof currentVideo)

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkButtonExists =  document.getElementsByClassName("bookmark-btm").item(0)
        console.log(bookmarkButtonExists)
        currentVideoBookmarks = await fetchBookmarks()
        if (!bookmarkButtonExists) {
            console.log('this should only fire once ever')
            const bookmarkBtn = document.createElement('img')

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png")
            bookmarkBtn.className = "ytp-button " + "bookmark-btm"
            bookmarkBtn.title = 'click to bookmark current timestamp'

            youtubeLeftControls = document.getElementsByClassName('ytp-left-controls')[0];
            youtubePlayer = document.getElementsByClassName('video-stream')[0];
            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler);
        }
    }

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime
        const newBookmark = {
            time:currentTime,
            desc: 'bookmark at ' + getTime(currentTime)
        }
        currentVideoBookmarks = await fetchBookmarks()
        //console.log("adding a bookmark check")
        ///
        //chrome.storage.sync.set({
        //    [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a,b) => a.time - b.time))
        //})
        console.log('it works before storage')
        
        
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a,b) => a.time - b.time))
        })
    }

    const getTime = t => {
        var date = new Date(0);
        date.setSeconds(t);

        return date.toISOString().substring(11,16)
    }

    newVideoLoaded()
})(); 

