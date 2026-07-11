import React from 'react';
import { Scene1Intro } from '../scenes/Scene1Intro';
import { Scene2Architecture } from '../scenes/Scene2Architecture';
import { Scene3Problems } from '../scenes/Scene3Problems';
import { Scene4Design } from '../scenes/Scene4Design';
import { Scene5Walkthrough } from '../scenes/Scene5Walkthrough';
import { Scene6Workflow } from '../scenes/Scene6Workflow';
import { Scene7Demo } from '../scenes/Scene7Demo';
import { Scene8Summary } from '../scenes/Scene8Summary';

export const VisualScenes = ({ currentScene, currentTime, isPlaying }) => {
  switch (currentScene) {
    case 1:
      return <Scene1Intro />;
    case 2:
      return <Scene2Architecture currentTime={currentTime} />;
    case 3:
      return <Scene3Problems currentTime={currentTime} />;
    case 4:
      return <Scene4Design currentTime={currentTime} />;
    case 5:
      return <Scene5Walkthrough currentTime={currentTime} isPlaying={isPlaying} />;
    case 6:
      return <Scene6Workflow currentTime={currentTime} />;
    case 7:
      return <Scene7Demo />;
    case 8:
      return <Scene8Summary currentTime={currentTime} />;
    default:
      return <Scene1Intro />;
  }
};
