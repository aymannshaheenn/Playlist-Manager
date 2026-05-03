const library = [
    {title:"Heather", artist:"Conan Gray", filename:"heather.mp3", genre:"Pop"},
    {title:"Maniac", artist:"Conan Gray", filename:"maniac.mp3", genre:"Pop"},
    {title:"Only In My Mind", artist:"The Marías", filename:"onlyinmymind.mp3", genre:"Indie"},
    {title:"Sweater Weather", artist:"The Neighbourhood", filename:"sweaterweather.mp3", genre:"Rock"},
    {title:"21", artist:"Gracie Abrams", filename:"21.mp3", genre:"Pop"},
    {title:"Wish You Were Sober", artist:"Conan Gray", filename:"wishyouwere.mp3", genre:"Pop"}
];

let currentPlaylist = [];
let addedTitles = new Set();

function ajaxPost(data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/cgi-bin/playlist.cgi", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => callback(xhr.responseText);
    xhr.send(data);
}

// Side panel toggle
function toggleSidePanel() {
    const panel = document.getElementById('sidePanel');
    const content = document.getElementById('content');
    panel.classList.toggle('expanded');
    panel.classList.toggle('collapsed');
    content.style.marginLeft = panel.classList.contains('expanded') ? '220px' : '60px';
}

// Views
function toggleView(viewId) {
    const views = ['playlist-view', 'add-view', 'search-view'];
    views.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    document.getElementById('filterBar').style.display = (viewId === 'playlist-view') ? 'flex' : 'none';
}

function showView() { toggleView('playlist-view'); loadPlaylist(); }
function showAdd() { toggleView('add-view'); loadLibrary(); }
function showSearch() { 
    toggleView('search-view'); 
    document.getElementById('search-bar').value = "";
    document.getElementById('search-result').innerHTML = "";
}

// Playlist
function loadPlaylist() {
    ajaxPost('action=view', res => {
        try { 
            currentPlaylist = JSON.parse(res); 
            addedTitles.clear();
            currentPlaylist.forEach(s => addedTitles.add(s.title));
        } catch { currentPlaylist = []; addedTitles.clear(); }
        displayPlaylist(currentPlaylist);
        loadLibrary(); // refresh library buttons in sync
    });
}

function displayPlaylist(pl) {
    const plDiv = document.getElementById('playlist');
    plDiv.innerHTML = "";
    if (pl.length === 0) {
        document.getElementById('empty-msg').style.display = "block";
    } else {
        document.getElementById('empty-msg').style.display = "none";
        const genreFilter = document.getElementById('genreFilter').value;
        pl.forEach(s => {
            if (genreFilter !== 'all' && s.genre !== genreFilter) return;
            const node = document.createElement("div");
            node.className = "song-card";
            node.innerHTML = `
                <div class="song-info">
                    <p><strong>${s.title}</strong> - ${s.artist}</p>
                    <p>${s.genre}</p>
                    <audio controls src="music/${s.filename}"></audio>
                </div>
                <div>
                    <button class="fav-btn" onclick="toggleFavorite('${s.title}')">❤️</button>
                    <button class="del-btn" onclick="deleteSong('${s.title}')">-</button>
                </div>`;
            plDiv.appendChild(node);
        });
    }
}

// Sort & filter
function sortPlaylist() {
    const type = document.getElementById('sortSelect').value;
    const sorted = [...currentPlaylist];
    if (type === "title") sorted.sort((a,b)=>a.title.localeCompare(b.title));
    else if (type === "artist") sorted.sort((a,b)=>a.artist.localeCompare(b.artist));
    displayPlaylist(sorted);
}
function filterPlaylist() { displayPlaylist(currentPlaylist); }

// Library
function loadLibrary() {
    const div = document.getElementById("song-library");
    div.innerHTML = "";
    library.forEach(s => {
        const isAdded = addedTitles.has(s.title);
        const node = document.createElement("div");
        node.className = "song-card";
        node.innerHTML = `
            <div class="song-info">
                <p><strong>${s.title}</strong> - ${s.artist}</p>
                <p>${s.genre}</p>
                <audio controls src="music/${s.filename}"></audio>
            </div>
            <button class="add-btn" 
                    onclick="addSong('${s.title}','${s.artist}','${s.genre}','3:00','${s.filename}')" 
                    ${isAdded ? "disabled style='opacity:0.5'" : ""}>
                ${isAdded ? "Added" : "+"}
            </button>`;
        div.appendChild(node);
    });
}

// Add song
function addSong(t,a,g,d,f) {
    if (addedTitles.has(t)) return;
    ajaxPost(`action=add&title=${t}&artist=${a}&genre=${g}&duration=${d}&filename=${f}`, res => {
        loadPlaylist();
    });
}

// Delete
function deleteSong(title) {
    ajaxPost(`action=delete&title=${title}`, res => {
        loadPlaylist();
    });
}

// Favorite
function toggleFavorite(title) {
    alert(`"${title}" ❤️ favorited!`);
}

// Search
function searchSong() {
    const q = document.getElementById('search-bar').value;
    if (!q) { document.getElementById('search-result').innerHTML = ""; return; }
    ajaxPost(`action=search&title=${q}`, res => {
        try {
            const results = JSON.parse(res);
            const container = document.getElementById('search-result');
            container.innerHTML = "";
            if (results.length === 0) container.innerHTML = "<p style='color:#ff99ff'>No matches found!</p>";
            results.forEach(s => {
                const isAdded = addedTitles.has(s.title);
                const node = document.createElement("div");
                node.className = "song-card";
                node.innerHTML = `
                    <div class="song-info">
                        <p><strong>${s.title}</strong> - ${s.artist}</p>
                        <p>${s.genre}</p>
                        <audio controls src="music/${s.filename}"></audio>
                    </div>
                    <button class="add-btn" 
                            onclick="addSong('${s.title}','${s.artist}','${s.genre}','3:00','${s.filename}')" 
                            ${isAdded ? "disabled style='opacity:0.5'" : ""}>
                        ${isAdded ? "Added" : "+"}
                    </button>`;
                container.appendChild(node);
            });
        } catch {
            document.getElementById('search-result').innerHTML = "<p style='color:#ff99ff'>No matches found!</p>";
        }
    });
}

// Clear playlist
function clearPlaylist() {
    if (!confirm("Are you sure you want to delete the entire playlist?")) return;

    ajaxPost("action=clear", res => {
        try {
            currentPlaylist = JSON.parse(res); // should now be empty []
        } catch {
            currentPlaylist = [];
        }
        addedTitles.clear();          // reset added tracker
        displayPlaylist(currentPlaylist); // remove songs from main view
        loadLibrary();               // refresh add buttons
        alert("Playlist cleared!");
    });
}



