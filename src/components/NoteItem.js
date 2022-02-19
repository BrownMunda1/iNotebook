import React ,{useContext} from 'react';
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const { note,updateNote } = props;

    const context = useContext(noteContext);
    const { deleteNote } = context;

    return <div className='col-md-4'>
        <div className="card my-3">
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                <i className="far fa-edit mx-2" onClick={()=>updateNote(note)}></i>
                <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted Successfully", "success")}}></i>
            </div>
        </div>
    </div>;
};

export default NoteItem;
