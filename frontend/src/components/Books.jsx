import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Books = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBooks();
  }, [user]);

  const fetchBooks = async (filter = "") => {
    try {
      let response = await axios.get(`http://localhost:4000/books/getBooks${filter}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:4000/books/deleteBook/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book", error);
      }
    }
  };

  const handleEdit = (book) => {
    navigate(`/editBook/${book._id}`, { state: { book } });
  };

  return (
    <div>
      <h2>Books</h2>
      <button onClick={() => fetchBooks("?old=1")}>Books older than 10 mins</button>
      <button onClick={() => fetchBooks("?new=1")}>Books created within last 10 mins</button>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Published Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td>{book.author}</td>
              <td>{book.title}</td>
              <td>{book.genre}</td>
              <td>{book.publishedDate}</td>
              <td>
                {user.role.includes("creator") && (
                  <>
                    <button onClick={() => handleEdit(book)}>Edit</button>
                    <button onClick={() => handleDelete(book._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
