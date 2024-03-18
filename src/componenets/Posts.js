
import React, { useEffect, useState } from "react";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [editedPost, setEditedPost] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    const handleEdit = (postId) => {
        const postToEdit = posts.find(post => post.id === postId);
        setEditedPost({ ...postToEdit });
    };

    const handleUpdate = () => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
            method: 'PUT',
            body: JSON.stringify(editedPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response => response.json())
        .then(updatedPost => {
            const updatedPosts = posts.map(post =>
                post.id === updatedPost.id ? updatedPost : post
            );
            setPosts(updatedPosts);
            setEditedPost(null);
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });
    };

    const handleDelete = (postId) => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        })
        .then(() => {
            const updatedPosts = posts.filter(post => post.id !== postId);
            setPosts(updatedPosts);
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            {/* <h1>POSTS</h1> */}
            <table className="border">
                <thead className="sticky" >
                    <tr className="color3">
                        <th>Post Id</th>
                        <th>Post Title</th>
                        <th>Post Body</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{editedPost && editedPost.id === post.id ?
                                <textarea
                                className="textarea2"
                                    // type="text"
                                    name="title"
                                    value={editedPost.title}
                                    onChange={handleInputChange}
                                /> : post.title}</td>
                            <td>{editedPost && editedPost.id === post.id ?
                                <textarea
                                     className="textarea"
                                    name="body"
                                    value={editedPost.body}
                                    onChange={handleInputChange}
                                /> : post.body}</td>
                            <td className="dflex">
                                {editedPost && editedPost.id === post.id ?
                                    <>
                                        <button className="btn" onClick={handleUpdate}>Save</button>
                                        <button className="btn" onClick={() => setEditedPost(null)}>Cancel</button>
                                    </>
                                    :
                                    <>
                                        <button className="btn" onClick={() => handleEdit(post.id)}>Edit</button>
                                        <button className="btn" onClick={() => handleDelete(post.id)}>Delete</button>
                                    </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
