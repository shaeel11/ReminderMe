import React from 'react';
import '../App.css';
import { Button } from './Button2';
import './Main.css';

function Main() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>ReminderMe</h1>
      <p>Let's help you get back on track</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large' 
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
}

export default Main;