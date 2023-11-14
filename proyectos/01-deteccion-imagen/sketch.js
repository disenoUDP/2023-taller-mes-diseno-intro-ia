/*
Objects to sound

The example detect objects from an image file and plays back a sound, if a you click on either a dog or a horse.

Built with objectDetector model from ml5js and p5js

Created by Andreas Refsgaard 2020

Inspired by Sound Painting project from Finn Årup Nielsen: https://twitter.com/fnielsen/status/1196403002665508864

Image: pxfuel.com/en/free-photo-obtxb
Sounds: freesound.org/people/rvinyard/sounds/117252/ & freesound.org/people/Princess6537/sounds/144885/
*/

let objectDetector;
let img;
let objects = [];

function preload() {
  //Load image and sounds
  img = loadImage('foto.jpg');
}

function setup() {
  createCanvas(640, 420);
  textSize(20);
  strokeWeight(4);
  img.resize(width, height);
  //Load objectDetector model using COCOSSD
  objectDetector = ml5.objectDetector('cocossd', modelReady);
}

function modelReady() {
  select('#status').html('Model Loaded');
  objectDetector.detect(img, gotResult);
}

function gotResult(err, results) {
  if (err) {
    console.log(err);
  }
  console.log(results)
  objects = results;
}

function draw() {
  image(img, 0, 0);
  for (let i = 0; i < objects.length; i++) {
    //Display bounding boxes and labels
    noStroke();
    fill(255);
    text(objects[i].label + " " + nfc(objects[i].confidence * 100.0, 2) + "%", objects[i].x + 5, objects[i].y + 20);
    noFill();
    stroke(0, 255, 0);
    rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

  }
}