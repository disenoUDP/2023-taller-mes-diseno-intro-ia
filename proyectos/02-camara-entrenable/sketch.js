// Cámara entrenable
// Este ejemplo te permite entrenar tu webcam para que tome una foto.
// Construido con el modelo featureExtractor de ml5.js y p5js
// Ejemplo original Trainable Camera Creado por Andreas Refsgaard 2020
// Adaptado al español por Aarón Montoya 2023

// variable para el modelo featureExtractor
let featureExtractor;

// variable para el clasificador
let clasificador;

// variable para el video
let video;

// variable para la pérdida del modelo
let perdida; 

// variable para numero de imagenes tipo A y B
let imagenesA = 0;
let imagenesB = 0;

// resultado de la clasificación
let resultadoClasificacion;

let confianza = 0;

let imagenActual;
let lastSnapShot;

let temporizador = 0;
let mostrarFotoReciente = false;

let etiquetaActual = 0;

let botonGrabar;
let botonCargar;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // extraer las caracteristicas ya aprendidas de modelo MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modeloListo);
  
  // especificar el numero de etiquetas
  const options = { numLabels: 2 }; 

  // definir clasificador
  clasificador = featureExtractor.classification(video, options);

  imagenActual = createGraphics(width, height);
  configurarBotones();
}

function draw() {
  background(122);
  image(video, 0, 0);

  if (resultadoClasificacion == 'A') {
    etiquetaActual = 0;
  } else if (resultadoClasificacion == 'B') {
    etiquetaActual++;
  }

  // muestra la foto reciente durante un periodo corto
  if (mostrarFotoReciente) {
    image(imagenActual, 0, 0);
  }

  // efecto de flash
  if (temporizador < 5) {
    background(temporizador * 25 + 130);
  } else if (temporizador < 8) {
    background(255);
  }

  if (temporizador > 100) {
    mostrarFotoReciente = false;
  }
  temporizador++;

  if (resultadoClasificacion == 'B' && etiquetaActual > 50) {
    tomarImagen();
  }
}

function tomarImagen() {
  // no funciona en un iframe,
  // pero debería funcionar si corres el código de forma local
  // fuera del editor de p5.js
  save('foto.jpg'); 
  imagenActual.image(video, 0, 0);
  temporizador = 0;
  mostrarFotoReciente = true;
  etiquetaActual = 0;
}

// función llamada cuando el modelo es cargado
function modeloListo() {
  select('#estadoModelo').html('Modelo base (MobileNet) cargado!');
}

// clasificar el cuadro actual
function clasificar() {
  clasificador.classify(resultadoObtenido);
}

// función para crear botones e interfaz de usuario
function configurarBotones() {
  // cuando se presiona el botón A, agregar la imagen actual
  // del video con la etiqueta "A" al clasificador
  botonA = select('#botonA');
  botonA.mousePressed(function() {
    clasificador.addImage('A');
    select('#cantidadImagenesA').html(imagenesA++);
  });

  // cuando se presiona el botón B, agregar la imagen actual
  // del video con la etiqueta "B" al clasificador
  botonB = select('#botonB');
  botonB.mousePressed(function() {
    clasificador.addImage('B');
    select('#cantidadImagenesB').html(imagenesB++);
  });

// botón de entrenamiento
  entrenar = select('#entrenar');
  entrenar.mousePressed(function() {
    clasificador.train((valorPerdida) => {
      if (valorPerdida) {
        perdida = valorPerdida;
        select('#perdida').html('Pérdida: ' + perdida);
      } else {
        select('#perdida').html('Entrenamiento listo! Pérdida final: ' + perdida);
      }
    });
  });

  // boton para predecir
  botonPredecir = select('#botonPredecir');
  botonPredecir.mousePressed(clasificar);
  
}

// muestra los resultados
function resultadoObtenido(err, resultado) {

  // mostrar los errores
  if (err) {
    console.error(err);
  }

  select('#resultado').html(resultado[0].label);
  select('#confianza').html(nf(resultado[0].confidence, 0, 2));

  resultadoClasificacion = resultado[0].label;
  confianza = resultado[0].confidence;
  
  clasificar();
}