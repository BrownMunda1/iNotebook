import React, { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {

    const host = "http://localhost:5000";

    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial); // creating a state which contains the notes

    // Get all note
    const getNotes = async (title,description,tag) => {
        // api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            "auth-token" : localStorage.getItem('token')
            }
        });
        const json=await response.json()
        console.log(json);

        setNotes(json)

    }
    // Add a note
    const addNote = async (title, description, tag) => {
        console.log('adding a new note')
        // to do : api calls
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });

        const note=await response.json();
        setNotes(notes.concat(note));
    }
    
    // Delete a note
    const deleteNote = async (id) => {
        // to do : api calls
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            "auth-token" : localStorage.getItem('token')
            } 
        });
        const json= response.json();
        console.log(json);

        console.log("deleting node with id : " + id);
        const newNotes=notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes);
    }
    
    // Edit a note
    const editNote = async (id,title,description,tag) => {
        // to do : api calls
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            "auth-token" : localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}) 
        });
        const json=await response.json();
        console.log(json)

        let newNotes=JSON.parse(JSON.stringify(notes)) // do this, as changing the state directly is not allowed in react
        for(let i=0;i<newNotes.length;i++){
            if(newNotes[i]._id===id){
                newNotes[i].title=title;
                newNotes[i].description=description;
                newNotes[i].tag=tag;
                break;
            }
        }
        setNotes(newNotes)

    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
