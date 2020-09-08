import React, { useState, useEffect } from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import {db} from "./firebase"
import firebase from "firebase";
import { Button } from '@material-ui/core';

function Post({postId,user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState([])

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })

        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComments('');

    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className= 'post__avatar'
                    alt={username}
                    src='https://via.placeholder.com/200x200.png'
                />
                <h3 className="post__username">{username}</h3>
            </div>
            {/* header-> avator and username */}
            {/* image */}
            <img src={imageUrl} className="post__image"alt=""/>
            {/* username and caption */}
            <h4 className="post__text"><strong>{username } </strong> {caption}</h4>
            
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p><strong>
                            {comment.username}
                        </strong>
                            {comment.text}
                        </p>
                    )

                    )

                }

            </div>
            <form className="post__commentBox">
            <input className="post__input" type="text" value={comment} placeholder="comment" onChange={(e) => setComment(e.target.value)} />
            <Button type="submit" onClick={postComment} >comment</Button>
            </form>
        </div>
    )
}

export default Post
