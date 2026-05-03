# Playlist Manager (C++ / HTML / CSS / JavaScript)

## Overview

Playlist Manager is a web-based music management project built as part of a Data Structures course. The frontend is developed using HTML, CSS, and JavaScript, while the backend is implemented in C++ using CGI. The core logic is based on a singly linked list to perform playlist operations such as insertion, deletion, searching, and traversal.

---

## Features

- Add songs from a predefined music library
- Remove songs from the playlist
- Search songs by title
- Sort playlist by title or artist
- Filter songs by genre
- Play songs using встро HTML audio player
- Dynamic updates using AJAX (no page reload)
- Clear entire playlist

---

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript (AJAX, DOM manipulation)

**Backend**
- C++ (CGI)
- Singly Linked List (Data Structures implementation)

---

## Data Structure

The playlist is implemented using a **singly linked list**, where each node stores:

- Song title
- Artist name
- Genre
- Filename
- Pointer to next node

Supported operations:
- Insert node (add song)
- Delete node (remove song)
- Traverse list (display playlist)
- Search node (find song)
- Clear list

---

## Song Library

```javascript
const library = [
    {title:"Heather", artist:"Conan Gray", filename:"heather.mp3", genre:"Pop"},
    {title:"Maniac", artist:"Conan Gray", filename:"maniac.mp3", genre:"Pop"},
    {title:"Only In My Mind", artist:"The Marías", filename:"onlyinmymind.mp3", genre:"Indie"},
    {title:"Sweater Weather", artist:"The Neighbourhood", filename:"sweaterweather.mp3", genre:"Rock"},
    {title:"21", artist:"Gracie Abrams", filename:"21.mp3", genre:"Pop"},
    {title:"Wish You Were Sober", artist:"Conan Gray", filename:"wishyouwere.mp3", genre:"Pop"}
];
