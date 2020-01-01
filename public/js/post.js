function createShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.querySelector('#title').innerHTML);
    document.querySelector('#shareButtons').innerHTML =
        `<a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" title="Facebook" style="display:inline-block;vertical-align:middle;background:#3b5998;">
            <svg style="display:block;fill:#fff;height:44%;margin:28% auto;" viewBox="0 -256 864 1664">
                <path transform="matrix(1,0,0,-1,-95,1280)" d="M 959,1524 V 1260 H 802 q -86,0 -116,-36 -30,-36 -30,-108 V 927 H 949 L 910,631 H 656 V -128 H 350 V 631 H 95 v 296 h 255 v 218 q 0,186 104,288.5 104,102.5 277,102.5 147,0 228,-12 z" />
            </svg>
        </a> 
        <a href="https://twitter.com/share?url=${url}&text=${title}" target="_blank" title="Twitter" style="display:inline-block;vertical-align:middle;background:#1b95e0;">
            <svg style="display:block;fill:#fff;height:36%;margin:32% auto;" viewBox="0 -256 1576 1280">
                <path transform="matrix(1,0,0,-1,-44,1024)" d="m 1620,1128 q -67,-98 -162,-167 1,-14 1,-42 0,-130 -38,-259.5 Q 1383,530 1305.5,411 1228,292 1121,200.5 1014,109 863,54.5 712,0 540,0 269,0 44,145 q 35,-4 78,-4 225,0 401,138 -105,2 -188,64.5 -83,62.5 -114,159.5 33,-5 61,-5 43,0 85,11 Q 255,532 181.5,620.5 108,709 108,826 v 4 q 68,-38 146,-41 -66,44 -105,115 -39,71 -39,154 0,88 44,163 Q 275,1072 448.5,982.5 622,893 820,883 q -8,38 -8,74 0,134 94.5,228.5 94.5,94.5 228.5,94.5 140,0 236,-102 109,21 205,78 -37,-115 -142,-178 93,10 186,50 z" />
            </svg>
        </a> 
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title} "target="_blank" title="LinkedIn" style="display:inline-block;vertical-align:middle;background:#0077b5;">
            <svg style="display:block;fill:#fff;height:42%;margin:29% auto;" viewBox="0 -256 1536 1468">
                <path transform="matrix(1,0,0,-1,0,1132)" d="M 349,911 V -80 H 19 v 991 h 330 z m 21,306 q 1,-73 -50.5,-122 Q 268,1046 184,1046 h -2 q -82,0 -132,49 -50,49 -50,122 0,74 51.5,123 51.5,48 134.5,48 83,0 133,-48 50,-49 51,-123 z M 1536,488 V -80 h -329 v 530 q 0,105 -40,164.5 Q 1126,674 1040,674 977,674 934.5,639.5 892,605 871,554 860,524 860,473 V -80 H 531 q 2,399 2,647 0,248 -1,296 l -1,48 H 860 V 767 h -2 q 20,32 41,56 21,24 56.5,52 35.5,28 87.5,43.5 51,15.5 114,15.5 171,0 275,-113.5 Q 1536,707 1536,488 z" />
            </svg>
        </a>`;
}

document.addEventListener('DOMContentLoaded', function (e) {
    createShareButtons();
});