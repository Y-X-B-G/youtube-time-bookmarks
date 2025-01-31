import { getCurrentTabURL } from "./utility.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement('div')
    const newBookmarkElement = document.createElement('div')
    const controlsElement = document.createElement('div')

    bookmarkTitleElement.textContent = bookmark.desc
    bookmarkTitleElement.className = 'bookmark-title'

    controlsElement.className = 'bookmark-controls'

    newBookmarkElement.id = "bookmark-"+ bookmark.time;
    newBookmarkElement.className = "bookmark" 
    newBookmarkElement.setAttribute("timestamp", bookmark.time)

    setBookmarkAttributes('play', onPlay, controlsElement)
    setBookmarkAttributes('delete', onDelete, controlsElement)

    newBookmarkElement.appendChild(bookmarkTitleElement)
    newBookmarkElement.appendChild(controlsElement)
    bookmarksElement.appendChild(newBookmarkElement)

    //bookmarksElement.innerHTML = '<div>Does this even work</div>'
};

const viewBookmarks = (currentVideoBookmarks=[]) => {
    const bookmarkElement = document.getElementById("bookmarks")
    bookmarkElement.innerHTML = ''

    if (currentVideoBookmarks.length > 0) {
        for (let i=0; i<currentVideoBookmarks.length; i++) {
            const bookmark = currentVideoBookmarks[i]
            addNewBookmark(bookmarkElement, bookmark)
        }
    } else {
        bookmarkElement.innerHTML= "<i class='row'>No bookmarks to show</i>"
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp')
    const activeTab = await getCurrentTabURL()
    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    })
};

const onDelete = async e => {
    const activeTab = await getCurrentTabURL
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp')
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime)

    bookmarkElementToDelete.parentNode. removeChild(bookmarkElementToDelete)
    console.log('is is sending the delete message?')
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, viewBookmarks)
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement('img')

    controlElement.src = './assets/' + src + ".png"
    controlElement.title = src
    controlElement.addEventListener('click', eventListener)
    controlParentElement.appendChild(controlElement)
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTabURL();
    const queryParameters = activeTab.url.split("?")[1]
    const urlParameters = new URLSearchParams(queryParameters)

    const currentVideo = urlParameters.get('v');
    if (activeTab.url.includes('youtube.com/watch') && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]):[];
            //console.log(currentVideoBookmarks)
            viewBookmarks(currentVideoBookmarks)
            //viewbookmark
        })
    } else {
        const container = document.getElementsByClassName('container')[0];
        container.innerHTML = '<div class="title">This is not a youtube video</div>'
    }

});