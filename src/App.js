import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Post from "./Post";
import { db, auth } from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';

import ImageUpload from "./ImageUpload";
function App() {

  // const [posts, setPosts] = useState([
  //   {
  //     username:'santos',
  //     caption:"Hello it's me",
  //     imageUrl:'https://via.placeholder.com/200x200.png'
  //   },
  //   {
  //     username:'aliza',
  //     caption:"Wow it works",
  //     imageUrl:'https://via.placeholder.com/200x200.png'
  //   },
  //   {
  //     username:'sujan',
  //     caption:"What's up",
  //     imageUrl:'https://via.placeholder.com/200x200.png'
  //   }  

  // ]);

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false)
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        console.log(authUser)
        setUser(authUser)
      } else {
        //user has logged out
        setUser(null)
      }
    })
    return () => {
      // perform cleanup
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      //every time a new post created it fire onSnapshot event handler
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
    // return () => {
    //   cleanup
    // }
  }, [])

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
      .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  return (
    <div className="app">

      {/* sign Up */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
            <form action="" class="app__signup">
              <center>
                <h2 id="simple-modal-title">Sign Up</h2>
              </center>
              <input type="text" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} />
              <input type="text" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" onClick={signUp}>Sign Up</button>
            </form>
          </div>
      </Modal>

      {/* Sing In */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <div style={modalStyle} className={classes.paper}>
            <form action="" class="app__signup">
              <center>
                <h2 id="simple-modal-title">Sign In</h2>
              </center>
              {/* <input type="text" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} /> */}
              <input type="text" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" onClick={signIn}>Sign In</button>
            </form>
          </div>
      </Modal>

      
      <div className="app__header">
        <img src="https://via.placeholder.com/100x20.png" className="app__headerImage" alt="logo" />

        {user ? (
          <Button className="app__signup" onClick={() => auth.signOut()}>
            Log Out
          </Button>
        ) : (
            <div className="app_loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button className="app__signup" onClick={handleOpen}>Sign Up</Button>
            </div>
          )
        }
        

        </div>
        <h1>Welcome to Instagram-clone</h1>
        <div className="app__posts">
        {
          posts.map(({ id, post }) => (
            <Post
              key={id}
              postId = {id}
              user= {user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
            ))
        }
        </div>
      
      
      {/* caption input for upload */}
      {/* File picker */}
      {/* Push button */}
      <div className="app__upload">
          {user ?.displayName ? (
            <ImageUpload username = { user.displayName} />
          ):(
            <h3>Sorry you need to login</h3>
          )}
    </div>
      </div>

      
  );
}

export default App;
