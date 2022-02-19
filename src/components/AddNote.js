import React, {useContext,useState} from 'react';
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    // bring in the context
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({title:"",description:"",tag:""});

    // fucntion for click
    const handleClick=(e)=>{
        e.preventDefault() // so that page doesn't reload   
        addNote(note.title,note.description,note.tag)
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added Note Successfully", "success")
    }

    // fucntion for the input 
    const onChange=(e)=>{
        setNote({...note, [e.target.name]:e.target.value}) // basically it updates the field correponding to the respective name with the value entered (if e.target.name===title then the value of title is going to be updated in the note state)
    }

    return <div>
        <div className="container my-5">
            <h1>Add a Note</h1>
            {/* Form for adding notes  */}
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange} />
                </div>
                <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    </div>
};

export default AddNote;
