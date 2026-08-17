// ============================================================
// HERO VIDEO PLAYLIST LOADER
// Plays through every clip listed below in order, then loops
// back to the first one and repeats forever.
//
// Whenever you add a new clip to the /Vids/ folder, add its
// filename to this array too — browsers can't read folder
// contents directly, so this list has to be kept in sync by hand.
// ============================================================

const heroVideoPlaylist = [
    '/Vids/clip1.mp4',
    '/Vids/clip2.mp4',
    // add more clips here, e.g. '/Vids/clip4.mp4'
];

document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.stockfootage');

    if (!heroVideo) {
        console.error('hero-video-loader.js: no element with class "stockfootage" found on this page.');
        return;
    }

    if (heroVideoPlaylist.length === 0) {
        console.error('hero-video-loader.js: heroVideoPlaylist is empty — add at least one clip.');
        return;
    }

    let currentClipIndex = 0;

    function playClip(index) {
        heroVideo.src = heroVideoPlaylist[index];
        heroVideo.load();
        heroVideo.play().catch(err => {
            // Autoplay can be blocked by the browser in some cases —
            // this just logs it instead of failing silently.
            console.warn('hero-video-loader.js: playback was blocked.', err);
        });
    }

    // When one clip finishes, move to the next — wrap back to 0 after the last
    heroVideo.addEventListener('ended', () => {
        currentClipIndex = (currentClipIndex + 1) % heroVideoPlaylist.length;
        playClip(currentClipIndex);
    });

    playClip(currentClipIndex);
});
