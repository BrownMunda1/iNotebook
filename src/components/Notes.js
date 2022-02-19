import React, { useContext, useEffect, useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import NoteItem from './NoteItem';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;

    let navigate=useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes();
        }
        else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, []);

    const [note, setNote] = useState({id:"", edittitle:"", editdescription:"", edittag:""});

    const ref = useRef(null);
    const refClose = useRef(null);

    const updateNote = (currentNote) => {
        ref.current.click(); // use ref only with .current 
        setNote({id:currentNote._id, edittitle:currentNote.title,editdescription:currentNote.description,edittag:currentNote.tag,})
    }

    const handleClick=(e)=>{
        console.log("updating note", note);
        e.preventDefault() // so that page doesn't reload
        editNote(note.id, note.edittitle,note.editdescription,note.edittag)
        refClose.current.click();
        props.showAlert("Updated Successfully", "success")
    }

    // fucntion for the input 
    const onChange=(e)=>{
        setNote({...note, [e.target.name]:e.target.value}) // basically it updates the field correponding to the respective name with the value entered (if e.target.name===title then the value of title is going to be updated in the note state)
    }

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            {/* Modal for updating note */}
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* template for updating the note */}
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="edittitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="edittitle" name='edittitle' value={note.edittitle} aria-describedby="emailHelp" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editdescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="editdescription" name='editdescription' value={note.editdescription}  onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edittag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="edittag" name='edittag'value={note.edittag}  onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.edittitle.length<3 || note.editdescription.length<5}  type="button" onClick={handleClick} className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">

                <div className="row my-3">
                    <h1>Your Notes</h1>
                    {/* Iterating over the notes brought from context api and calling the note item component  */}
                    {notes.map((note) => {
                        return <NoteItem showAlert={props.showAlert} key={note._id} note={note} updateNote={updateNote} />
                    })}
                </div>
            </div>
        </>
    )
};

export default Notes;
