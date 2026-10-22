// Page navigation
function goToPageOne() {
    document.body.classList.remove("show-page-two", "show-page-three", "show-page-four");
    window.scrollTo(0, 0);
}

function goToPageTwo() {
    document.body.classList.remove("show-page-three", "show-page-four");
    document.body.classList.add("show-page-two");
    window.scrollTo(0, 0);
}

function goToPageThree() {
    document.body.classList.remove("show-page-two", "show-page-four");
    document.body.classList.add("show-page-three");
    const pageThree = document.getElementById("pageThree");
    if (pageThree) pageThree.scrollTop = 0;
}

// Page four: video memories
function goToPageFour() {
    document.body.classList.remove(
        "show-page-two",
        "show-page-three",
        "show-page-five"
    );

    document.body.classList.add("show-page-four");

    const pageFive = document.getElementById("pageFive");
    if (pageFive) {
        pageFive.scrollTop = 0;
    }

    const pageFour = document.getElementById("pageFour");
    if (pageFour) {
        pageFour.scrollTop = 0;
    }

    window.scrollTo(0, 0);
}

// Page five: letters to Grandpa
function goToPageFive() {
    document.body.classList.remove(
        "show-page-two",
        "show-page-three",
        "show-page-four"
    );

    document.body.classList.add("show-page-five");

    const pageFive = document.getElementById("pageFive");
    if (pageFive) {
        pageFive.scrollTop = 0;
    }

    window.scrollTo(0, 0);
}

// Page one: switch between Grandpa's photo and video.
const mediaFrame = document.getElementById("mediaFrame");
const grandpaPhoto = document.getElementById("grandpaPhoto");
const grandpaVideo = document.getElementById("grandpaVideo");

if (mediaFrame && grandpaPhoto && grandpaVideo) {
    grandpaVideo.style.display = "none";
    grandpaPhoto.style.display = "block";

    grandpaPhoto.addEventListener("click", () => {
        grandpaPhoto.style.display = "none";
        grandpaVideo.style.display = "block";
        grandpaVideo.play().catch(() => {
            // If autoplay is blocked, the native video controls remain available.
        });
    });

    grandpaVideo.addEventListener("ended", () => {
        grandpaVideo.pause();
        grandpaVideo.currentTime = 0;
        grandpaVideo.style.display = "none";
        grandpaPhoto.style.display = "block";
    });
}

// Page two: vintage album, showing m1.jpg through m23.jpg in 12 spreads.
const albumLeftPage = document.getElementById("albumLeftPage");
const albumRightPhoto = document.getElementById("albumRightPhoto");
const albumPageCount = document.getElementById("albumPageCount");
const albumPrevious = document.getElementById("albumPrevious");
const albumNext = document.getElementById("albumNext");
const albumTitle = document.getElementById("albumTitle");
let albumSpread = 0;
const albumSpreadCount = 13;

function renderAlbumSpread() {
    if (!albumLeftPage || !albumRightPhoto || !albumPageCount) return;

    albumLeftPage.innerHTML = "";
    if (albumTitle && albumSpread === 0) {
        albumTitle.textContent = "关于爷爷";
        albumLeftPage.appendChild(albumTitle);
    } else {
        const photoNumber = albumSpread * 2;
        if (photoNumber <= 24) {
            const leftImage = document.createElement("img");
            leftImage.src = `images/m${photoNumber}.jpg`;
            leftImage.alt = `爷爷的人生照片 ${photoNumber}`;
            albumLeftPage.appendChild(leftImage);
        }
    }

    const rightPhotoNumber = albumSpread === 0 ? 1 : albumSpread * 2 + 1;
    if (rightPhotoNumber <= 24) {
        albumRightPhoto.src = `images/m${rightPhotoNumber}.jpg`;
        albumRightPhoto.alt = `爷爷的人生照片 ${rightPhotoNumber}`;
        albumRightPhoto.style.visibility = "visible";
    } else {
        albumRightPhoto.removeAttribute("src");
        albumRightPhoto.alt = "";
        albumRightPhoto.style.visibility = "hidden";
    }

    albumPageCount.textContent = `${String(albumSpread + 1).padStart(2, "0")} / ${albumSpreadCount}`;
    if (albumPrevious) albumPrevious.disabled = albumSpread === 0;
    if (albumNext) albumNext.disabled = albumSpread === albumSpreadCount - 1;
}

albumPrevious?.addEventListener("click", () => {
    if (albumSpread > 0) {
        albumSpread -= 1;
        renderAlbumSpread();
    }
});

albumNext?.addEventListener("click", () => {
    if (albumSpread < albumSpreadCount - 1) {
        albumSpread += 1;
        renderAlbumSpread();
    }
});

renderAlbumSpread();

// Page three: family memory wall with 75 photos.
const memoryWall = document.getElementById("memoryWall");
const photoLightbox = document.getElementById("photoLightbox");
const photoLightboxImage = document.getElementById("photoLightboxImage");
const photoLightboxClose = document.getElementById("photoLightboxClose");

if (memoryWall) {
    // Reorder this array whenever desired; filenames remain images/1.jpg to images/75.jpg.
    const memoryPhotoOrder = Array.from({ length: 75 }, (_, index) => index + 1);

    memoryPhotoOrder.forEach((photoNumber) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-photo";
        button.setAttribute("aria-label", `放大查看第 ${photoNumber} 张家庭照片`);

        const image = document.createElement("img");
        image.src = `images/${photoNumber}.jpg`;
        image.alt = "家庭回忆照片";
        image.loading = "lazy";
        image.decoding = "async";

        button.appendChild(image);
        button.addEventListener("click", () => {
            if (!photoLightbox || !photoLightboxImage) return;
            photoLightboxImage.src = image.src;
            photoLightbox.classList.add("is-open");
            photoLightbox.setAttribute("aria-hidden", "false");
            photoLightboxClose?.focus();
        });
        memoryWall.appendChild(button);
    });
}

function closePhotoLightbox() {
    if (!photoLightbox || !photoLightboxImage) return;
    photoLightbox.classList.remove("is-open");
    photoLightbox.setAttribute("aria-hidden", "true");
    photoLightboxImage.removeAttribute("src");
}

photoLightboxClose?.addEventListener("click", closePhotoLightbox);
photoLightbox?.addEventListener("click", (event) => {
    if (event.target === photoLightbox) closePhotoLightbox();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePhotoLightbox();
});

// ========================================
// Page four: Grandpa's video memories
// ========================================

const videoWall = document.getElementById("videoWall");
const videoLightbox = document.getElementById("videoLightbox");
const videoLightboxPlayer = document.getElementById("videoLightboxPlayer");
const videoLightboxClose = document.getElementById("videoLightboxClose");

if (
    videoWall &&
    videoLightbox &&
    videoLightboxPlayer &&
    videoLightboxClose
) {
    // Create 11 video cards: V1.mp4 through V11.mp4.
    for (let i = 1; i <= 11; i++) {
        const card = document.createElement("button");

        card.type = "button";
        card.className = "video-memory-card";
        card.setAttribute("aria-label", `播放第 ${i} 个视频`);

        const preview = document.createElement("video");

        preview.src = `images/V${i}.mp4`;
        preview.preload = "metadata";
        preview.muted = true;
        preview.playsInline = true;
        preview.setAttribute("aria-label", `视频 ${i} 的预览`);

        // Keep previews silent and prevent automatic playback.
        preview.controls = false;
        preview.autoplay = false;

        card.appendChild(preview);
        videoWall.appendChild(card);

        // Clicking a card opens the video player with sound.
        card.addEventListener("click", () => {
            videoLightboxPlayer.pause();
            videoLightboxPlayer.removeAttribute("src");

            videoLightboxPlayer.src = `images/V${i}.mp4`;
            videoLightboxPlayer.currentTime = 0;
            videoLightboxPlayer.muted = false;
            videoLightboxPlayer.controls = true;

            videoLightbox.classList.add("is-open");
            videoLightbox.setAttribute("aria-hidden", "false");

            videoLightboxPlayer.play().catch((error) => {
                console.log("视频播放需要手动启动：", error);
            });
        });
    }
}

// Close the video player and stop playback.
function closeVideoLightbox() {
    if (!videoLightbox || !videoLightboxPlayer) return;

    videoLightboxPlayer.pause();
    videoLightboxPlayer.removeAttribute("src");
    videoLightboxPlayer.load();

    videoLightbox.classList.remove("is-open");
    videoLightbox.setAttribute("aria-hidden", "true");
}

videoLightboxClose?.addEventListener("click", closeVideoLightbox);

// Clicking the dark background closes the video.
videoLightbox?.addEventListener("click", (event) => {
    if (event.target === videoLightbox) {
        closeVideoLightbox();
    }
});

// Press Escape to close the video.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeVideoLightbox();
    }
});

// ========================================
// Page five: letters to Grandpa
// ========================================

const letterBookCover = document.getElementById("letterBookCover");
const letterBook = document.getElementById("letterBook");
const letterPages = document.querySelectorAll('#letterBook .letter-book-pages > article.letter-page[data-letter]');
const letterTabs = document.querySelectorAll("#letterBook [data-letter-target]");
const letterPrevious = document.getElementById("letterPrevious");
const letterNext = document.getElementById("letterNext");

let currentLetter = 0;

// Open the book.
letterBookCover?.addEventListener("click", () => {
    if (!letterBook || !letterBookCover) return;

    letterBookCover.hidden = true;
    letterBook.hidden = false;
    letterBook.style.display = "block";

    showLetter(0);
});

// Display the selected letter.
function showLetter(index) {
    if (index < 0 || index >= letterPages.length) return;

    currentLetter = index;

    // Reset all five letter cards, then show only the selected one.
    letterPages.forEach((page, i) => {
        const isSelected = i === index;
        page.hidden = !isSelected;
        page.classList.toggle("is-active", isSelected);
        page.setAttribute("aria-hidden", String(!isSelected));
        page.scrollTop = 0;
    });

    letterTabs.forEach((tab, i) => {
        tab.classList.toggle("is-selected", i === index);

        if (i === index) {
            tab.setAttribute("aria-current", "page");
        } else {
            tab.removeAttribute("aria-current");
        }
    });

    if (letterPrevious) {
        letterPrevious.disabled = index === 0;
    }

    if (letterNext) {
        letterNext.disabled = index === letterPages.length - 1;
    }
}

// Click an index tab to jump to its letter.
letterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = Number(tab.dataset.letterTarget);
        showLetter(target);
    });
});

// Previous letter.
letterPrevious?.addEventListener("click", () => {
    if (currentLetter > 0) {
        showLetter(currentLetter - 1);
    }
});

// Next letter.
letterNext?.addEventListener("click", () => {
    if (currentLetter < letterPages.length - 1) {
        showLetter(currentLetter + 1);
    }
});

// Initialize the first letter.
showLetter(0);
