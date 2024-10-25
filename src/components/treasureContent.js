import box_close_png from '../images/box_close_png.png';
import box_open_png from '../images/box_open_png.png';
import image1 from '../images/l1_img1.jpg';
import image2 from '../images/l1_img2.png';
import image3 from '../images/l1_img3.jpg';

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
{
  x: 2870,
  y: 90,
  imageClosed: box_close_png,
  imageOpen: box_open_png,
  taskDescription: "Pronounce the above word!",
  letterImage: image1,
  letter: "ಆ",
  // audio: audio1,
},
{
  x: 5970,
  y: 290,
  imageClosed: box_close_png,
  imageOpen: box_open_png,
  taskDescription: "Repeat the phrase 'I can speak!'",
  letterImage: image3,
  letter: 'ಹಾ' 
  // audio: audio1,
},
];

export default createTreasureContent;