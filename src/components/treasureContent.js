import box_close_png from '../images/box_close_png.png';
import box_open_png from '../images/box_open_png.png';
import image1 from '../images/l1_img1.jpg';
import image2 from '../images/l1_img2.png';
import image3 from '../images/l1_img3.jpg';
import img2 from '../images/img2.png';
import img3 from '../images/img3.png';
import img4 from '../images/img4.png';
import img5 from '../images/img5.png';
import img6 from '../images/img6.jpeg';

import gha from '../assets/gha.mp3'
import aa from '../assets/aa.mp3';
import na from '../assets/na.mp3';
import la from '../assets/la.mp3';
import tha from '../assets/tha.mp3'

import anubhava from '../assets/anubhava.mp3'
import sorry from '../assets/sorry.mp3'
import nadi from '../assets/nadi.mp3'
import rutu from '../assets/rutu.mp3'

import iiii1 from '../images/iiii1.jpeg';
import iii2 from '../images/iii2.jpeg';
import iii3 from '../images/iii3.jpeg';
import iii4 from '../images/iii4.jpeg';

const createTreasureContent = () => [
  //   {
  //     x: 960, // Assuming 128x128 for treasure image
  //     y: 290,
  //     imageClosed: box_close_png,
  //     imageOpen: box_open_png,
  //     taskDescription: "Say the word 'apple' correctly!",
  //     image: image1,
  //     letter: 'ಆ'
  //     // audio: audio1,
  //   },
    { //1
      x: 2870,
      y: 90,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Pronounce the above word!",
      letterImage: image1,
      letter: "ಆ",
      audio: aa,
    },
    { //2
      x: 5970,
      y: 290,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: img2,
      letter: 'ನ',
      audio: na,
    },
    { //3
      x: 7870,
      y: 139-30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: img3,
      letter: 'ಠ',
      audio: tha,
    },
    { //4
      x: 10410,
      y: 319 - 30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: img4,
      letter: 'ಳ',
      audio: la,
    },
    { //5
      x: 13772 - 200,
      y: 319 - 30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: img5,
      letter: 'ಘ',
      audio: gha,
    },
    { //6
      x: 18037,
      y: 49 - 30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: img6,
      letter: 'ತ್ರ'
      // audio: ,
    },
    { //1
      x: 18820 + 2870,
      y: 90,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Pronounce the above word!",
      letterImage: iiii1,
      letter: "ನದಿ",
      audio: nadi,
    },
    { //2
      x: 18820 + 5970,
      y: 290,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: iii2,
      letter: 'ಅನುಭವ',
      audio: anubhava,
    },
    { //3
      x: 18820 + 7870,
      y: 139-30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: iii3,
      letter: 'ಋತು',
      audio: rutu,
    },
    { //4
      x: 18820 + 10410,
      y: 319 - 30,
      imageClosed: box_close_png,
      imageOpen: box_open_png,
      taskDescription: "Repeat the phrase 'I can speak!'",
      letterImage: iii4,
      letter: 'ಕ್ಷಮೆ',
      audio: sorry,
    },
    // { //5
    //   x: 18820 + 13772 - 200,
    //   y: 319 - 30,
    //   imageClosed: box_close_png,
    //   imageOpen: box_open_png,
    //   taskDescription: "Repeat the phrase 'I can speak!'",
    //   letterImage: image3,
    //   letter: 'ಹಾ'
    //   // audio: audio1,
    // },
    // { //6
    //   x: 18820 + 18037,d
    //   y: 49 - 30,
    //   imageClosed: box_close_png,
    //   imageOpen: box_open_png,
    //   taskDescription: "Repeat the phrase 'I can speak!'",
    //   letterImage: image3,
    //   letter: 'ಹಾ'
    //   // audio: audio1,
    // },
];

export default createTreasureContent;