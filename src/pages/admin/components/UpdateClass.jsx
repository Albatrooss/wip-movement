import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../../styles/components/forms.css';

import adminService from '../../../utils/adminService';

const defaultForm = {
  name: '',
  description: '',
  instructor: 'Caitlin Elmslie',
  dueDate: '',
  screenshot: {},
  video: {},
  type: 'C',
  tags: ['']
}

export default function UpdateClass() {

  const { id } = useParams();

  const [cls, setCls] = useState({});
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = e => {
    if (e.target.name === 'type') {
      setFormData({
        ...formData,
        type: e.target.value
      })
    } else if (e.target.type === 'file') {
      let file = e.target.files[0];
      setFormData({
        ...formData,
        [e.target.name]: file
      })
    } else if (e.target.name === 'tags') {
      setFormData({
        ...formData,
        tags: e.target.value.split(', ')
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    console.log('hello')
    try {
      await adminService.updateOne(formData);
      setSuccessMessage('Success!');
      setFormData(defaultForm);
    } catch (err) {
      setErrMsg(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchClass = async () => {
      try {
        let res = await adminService.getOneClass(id);
        console.log(res);
        setFormData(res);
      } catch (err) {
        setErrMsg(err.message);
      }
    }
    fetchClass();
  }, [id])

  return (
    <>
      <form className="my-form" autoComplete="off" onSubmit={handleSubmit}>
        {errMsg && <p className="err-message">{errMsg}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} /* required */ />
          <label htmlFor="name" className={`label ${formData.name ? 'typed' : ''}`}>Name</label>
        </div>
        <div className="form-description">
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} /* required */ />
          <label htmlFor="description" className={`label ${formData.description ? 'typed' : ''}`}>Description</label>
        </div>
        <div className="row">
          <div className="large-half">
            <input type="text" name="instructor" id="instructor" value={formData.instructor} onChange={handleChange} /* required */ />
            <label htmlFor="instructor" className={`label ${formData.instructor ? 'typed' : ''}`}>Instructor</label>
          </div>
          <div className="large-half">
            <input type="datetime-local" name="dueDate" id="dueDate" onChange={handleChange} /* required */ />
            <label htmlFor="dueDate" className={`label typed`}>Due Date</label>
          </div>
        </div>
        <div>
          <input type="text" name="video" id="video" value={formData.video} onChange={handleChange} /* required */ />
          <label htmlFor="video" className='label typed' >Video URL</label>
        </div>
        <div>
          <input type="file" name="screenshot" id="screenshot" onChange={handleChange} /* required */ />
          <label htmlFor="screenshot" className={`label ${formData.instructor ? 'typed' : ''}`} >Screen Shot</label>
        </div>
        <div>
          <input type="text" name="tags" id="tags" value={formData.tags.join(', ')} onChange={handleChange} placeholder="tag1, tag2" /* required */ />
          <label htmlFor="tags" className={`label ${formData.tags[0] !== '' ? 'typed' : ''}`}>Tags</label>
        </div>
        <div className="row">
          <div className="selectDiv">
            <select name="type" id="type" value={formData.type} onChange={handleChange}>
              <option value="C">Collab</option>
              <option value="D">Dance</option>
              <option value="P">Pilates</option>
              <option value="M">Movement Breakdown</option>
            </select>
            <label htmlFor="tags" className='label typed'>Type</label>
          </div>
          {loading ? <div className="loading"><i className="fas fa-circle-notch fa-spin"></i></div> : <button type="submit">Update</button>}
        </div>
      </form>
      <h2 style={{ marginBottom: '30px' }}>Users who have saved this class:</h2>
      <table className="admin-table">
        <tr>
          <th className="table-header">Username</th>
          <th className="table-header">Email</th>
          <th className="table-header">Signed Up</th>
          <th className="table-header">Last Saved</th>
          <th className='table-num table-header'>Saved Classes</th>
        </tr>
        {formData.enrolled && formData.enrolled.map(student => <tr>
          <th><a href={`/user/{student._id}`}>{student.username}</a></th>
          <th>{student.email}</th>
          <th>{convertDate(student.createdAt)}</th>
          <th>{convertDate(student.updatedAt)}</th>
          <th className='table-num'>{student.myClasses.length}</th>
        </tr>)}
      </table>
      <h2 style={{ margin: '20px' }}>Comments:</h2>
      <table className="admin-table">
        <tr>
          <th className="table-header">Comment</th>
          <th className="table-header">User</th>
          <th className='table-num table-header'>Rating</th>
        </tr>
        {formData.comments && formData.comments.map(comment => <tr>
          <th>{comment.content}</th>
          <th><a href={`/user/${comment.user._id}`}>{comment.user.username}</a></th>
          <th className='table-num'>{comment.rating}</th>
        </tr>)}
      </table>
    </>
  )
}



function convertDate(date) {
  let first = new Date(date).toString().split(' ');
  let second = first.slice(0, 5);
  second[4] = convert24(second[4]);
  return second.join(', ')
}

function convert24(time) {
  let am = true;
  let arr = time.split(':');
  if (parseInt(arr[0]) > 12) am = false;
  arr[0] = arr[0] % 12;
  return `${arr.slice(0, 2).join(':')} ${am ? ' AM' : ' PM'}`;
}