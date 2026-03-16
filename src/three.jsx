import * as THREE from 'three';
import Sidebar from "./sideBar";
import { useState, useEffect, useRef } from "react";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

function MyThree() {
  const refContainer = useRef(null);
  const cubeRef = useRef(null);
  const boxGroupRef = useRef(null);
  const cubeLinesRef = useRef(null);
  const verticesRef = useRef(null);
  const velocityYRef = useRef(0);
  const applyGravityRef = useRef(false);

  const [showEdges, setShowEdges] = useState(false);
  const [showVertices, setShowVertices] = useState(false);

const [applyGravity, setApplyGravity] = useState(false);
const handleGravityToggle = (value) => {
  setApplyGravity(value);
  applyGravityRef.current = value;
  if (value && boxGroupRef.current) {      
    boxGroupRef.current.position.y += 3 
    velocityYRef.current = 0;                        
  }
};

  useEffect(() => {

    let hovered = null;
    let textScale = 0;
    let rotation=true;
    let animationId; 
    const gravity=-0.0001;
    const ground=0.4;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.DirectionalLight(0xffffff, 1.5).position.set(5, 8, 6));
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    refContainer.current && refContainer.current.appendChild(renderer.domElement);

const backGroundtexture = new THREE.TextureLoader().load('/images/back.jpg');
scene.background=backGroundtexture;
backGroundtexture.colorSpace = THREE.SRGBColorSpace;

var box = new THREE.BoxGeometry(1.1, 1.1, 1.1);
  const bxmaterials = new THREE.MeshStandardMaterial({color: 0x668BB1,         
  metalness: 0.8,        
  roughness: 0.15,          
  envMapIntensity: 1.5,});
  var cube = new THREE.Mesh(box, bxmaterials);
  cubeRef.current = cube;

var lid = new THREE.BoxGeometry(1.1, 0.1, 1.1);
  var ldmaterial = new THREE.MeshLambertMaterial({ color: 0xe7b32d, 
  metalness: 1.0,          
  roughness: 0.08,       
  envMapIntensity: 1.8, }); 
  var cap = new THREE.Mesh(lid, ldmaterial);
cube.position.set(0, 0, 0);
    var boxGroup = new THREE.Group();
    scene.add(boxGroup);   
    boxGroup.add(cube);

    //gruping
    var lidGroup = new THREE.Group();
    cap.position.set(0, 0.01, 0.5); 
    lidGroup.add(cap);
    lidGroup.position.set(0, 0.6, -0.5); 
    
    boxGroup.add(lidGroup);
    boxGroup.position.set(0.9,0.4,0);
    boxGroupRef.current = boxGroup;

    camera.position.z =5;
camera.position.y=1;
camera.position.x=1;

const cubeEdges = new THREE.EdgesGeometry(cube.geometry);
const cubeEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
const cubeLines = new THREE.LineSegments(cubeEdges, cubeEdgeMaterial);
cubeLines.raycast = () => {};
cube.add(cubeLines);
cubeLinesRef.current = cubeLines;

const capEdges = new THREE.EdgesGeometry(cap.geometry);
const capEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
const capLines = new THREE.LineSegments(capEdges, capEdgeMaterial);
capLines.raycast = () => {};
cap.add(capLines);
    
const loader = new FontLoader();

const canvas = document.createElement("canvas");
canvas.width = 1900;
canvas.height = 400;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#C0C0C0";
ctx.font = "bold 300px 'Harlow Solid Italic'";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.shadowColor = "#88f"; 
ctx.shadowBlur = 20;
ctx.fillText("Eid Mubarak!", canvas.width / 2, canvas.height / 2);

const texture = new THREE.CanvasTexture(canvas);
const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
const textSprite = new THREE.Sprite(spriteMaterial);
textSprite.position.set(1, 1.4, 0); 
textSprite.material.depthTest = false;
textSprite.material.depthWrite = false;
textSprite.renderOrder = 999;
textSprite.visible = false;

textSprite.lookAt(camera.position);  
scene.add(textSprite);     

var animate = function () {
animationId = requestAnimationFrame(animate); 

if (applyGravityRef.current) {

if(lidOpen==true){
      lidOpen=false;
      textSprite.visible = false;
      }

  velocityYRef.current += gravity;
  boxGroupRef.current.position.y += velocityYRef.current;

  if (boxGroupRef.current.position.y <= ground) {
    boxGroupRef.current.position.y = ground;
    velocityYRef.current = 0;
    applyGravityRef.current = false; 
    setApplyGravity(false);
  }
}

if(rotation === true){
    boxGroup.rotation.y += 0.01;
      }
    if (lidOpen && lidGroup.rotation.x > -Math.PI/2) {
      lidGroup.rotation.x -= 0.03;
      }
     else if(!lidOpen && lidGroup.rotation.x < 0){
     lidGroup.rotation.x += 0.03;
     if (lidGroup.rotation.x > 0) {
     lidGroup.rotation.x = 0;
    }
   }   

if (lidOpen && textScale < 1) {
  textSprite.visible = true;
  textScale += 0.03;
}
else if (!lidOpen && textScale > 0) {
  textScale -= 0.03;
}

textSprite.scale.set(
  2 * textScale,
  1 * textScale,
  1
);

if (textScale <= 0) {
  textSprite.visible = false;
}

textSprite.lookAt(camera.position);
renderer.render(scene, camera);
};

window.addEventListener("mousemove", (e) => {

  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([cube, cap]);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (hovered !== obj) {
      if (hovered) hovered.material.emissive.set(0x000000);
      hovered = obj;
      if(hovered==cube)
      hovered.material.emissive.set(0x444444); 
      else if(hovered == cap)
      hovered.material.emissive.set(0xCDA746); 
    }
  } else {
    if (hovered) hovered.material.emissive.set(0x000000);
    hovered = null;
  }
});

let lidOpen=false;
window.addEventListener("click", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();

mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([cube, cap]);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    if (hit == cube) {
      if(rotation==true){
      boxGroup.rotation.y= Math.PI/4;
      rotation = false;
      }
      else{
        rotation=true;
      }
    } else if (hit == cap) {
      boxGroup.rotation.y= Math.PI/4;
      rotation = false;
      if(lidOpen==false){
      lidOpen=true;
      textSprite.visible = true;
      textScale = 0;
      }
      else{
        lidOpen=false;
      
      }
    }
  }
});

/*const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);*/
 
      animate();
  }, []);
  
useEffect(()=>{

if(!cubeLinesRef.current) return;
if(showEdges){
cubeLinesRef.current.material.color.set(0xff0000);
}else{
cubeLinesRef.current.material.color.set(0x333333);
}
},[showEdges]);

useEffect(()=>{

const cube = cubeRef.current;
if(!cube) return;
if(showVertices){
const positions = cube.geometry.attributes.position.array;
const pointsArray = [];
for(let i=0;i<positions.length;i+=3){
pointsArray.push(
new THREE.Vector3(
positions[i],
positions[i+1],
positions[i+2]
)
);
}

const vertices = new THREE.BufferGeometry().setFromPoints(pointsArray);
const pointsMaterial = new THREE.PointsMaterial({
color:0x00ff00,
size:0.07
});

const points = new THREE.Points(vertices,pointsMaterial);
points.raycast = () => {}; 
cube.add(points);
verticesRef.current = points;
}else{
if(verticesRef.current){
cube.remove(verticesRef.current);
verticesRef.current = null;
}
}
},[showVertices]);

  return (

<div
    style={{
      display: "flex",
      flexWrap: "nowrap",
      height: "100vh",
    }}
  >

  <Sidebar
    showEdges={showEdges}
    setShowEdges={setShowEdges}
    showVertices={showVertices}
    setShowVertices={ setShowVertices}
    applyGravity={applyGravity}            
    handleGravityToggle={handleGravityToggle}
  />

  <div
      ref={refContainer}
      style={{
        flex: 1,
        minWidth: 0,
      }}
    ></div>

</div>

);
}

export default MyThree;