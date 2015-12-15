//default constructor
THREE.Foliage = function () {
	new THREE.Foliage({});
};

//constructor with params
THREE.Foliage = function (opts) {
	THREE.Object3D.call(this);

  //callback function when foliage is loaded
	this.loadingDone = opts.callback !== undefined ? opts.callback : this.loadingDone;

  this.octree = new THREE.Octree({
    undeffered: false,
    depthMax: Infinity,
    objectsThreeshold: 8,
    overlapPct: 0.0,
    levelOfDetailRange: this.levelDefinition,
    levelOfDetailChangedCallback: this.levelOfDetailChangedCallback
  });

  //create terrain and foliage
	this.createFoliage();

  //call callback
	this.loadingDone();
}

//construction and inheritation
THREE.Foliage.prototype = Object.create(THREE.Object3D.prototype);
THREE.Foliage.prototype.constructor = THREE.Foliage;

//LOD Range and amount Definition
THREE.Foliage.prototype.levelDefinition = [1, 7.5, 20, 50];

//area width
THREE.Foliage.prototype.width = 100;

//area depth
THREE.Foliage.prototype.depth = 100;

//default loading done callback Function
THREE.Foliage.prototype.loadingDone = function () { };

//default level of detail despatch event callback function
THREE.Foliage.prototype.levelOfDetailChangedCallback = function ( event ) { };

//create default terrain
THREE.Foliage.prototype.createTerrain = function (width, height) {
  var geometry = new THREE.PlaneGeometry(width, height, width, height);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  for (var i = 0; i < geometry.vertices.length; i++) {
    var x = geometry.vertices[i].x;
    var z = geometry.vertices[i].z;
    //plain terrain
    geometry.vertices[i].y = 0;
  }
  // create the textureDiffuse
  var textureDiffuseUrl = 'textures/sand_clean_bumpy_01_b.png';
  var textureDiffuse = THREE.ImageUtils.loadTexture(textureDiffuseUrl);
  textureDiffuse.wrapS = THREE.RepeatWrapping;
  textureDiffuse.wrapT = THREE.RepeatWrapping;
  textureDiffuse.repeat.x = width / 2;
  textureDiffuse.repeat.y = height / 2;
  // create the textureNormal
  var textureNormalUrl = 'textures/sand_clean_bumpy_01_b_normal.png';
  var textureNormal = THREE.ImageUtils.loadTexture(textureNormalUrl);
  textureNormal.wrapS = THREE.RepeatWrapping;
  textureNormal.wrapT = THREE.RepeatWrapping;
  textureNormal.repeat.x = width / 2;
  textureNormal.repeat.y = height / 2;
  var material = new THREE.MeshPhongMaterial({
    map: textureDiffuse,
    normalMap: textureNormal,
    normalScale: new THREE.Vector2(1, 1).multiplyScalar(0.5)
  });
  var terrain = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), material);
  //Shadowcasting on the ground
  terrain.receiveShadow = true;
  return terrain;
};

//create Foliage and default terrain
THREE.Foliage.prototype.createFoliage = function() {
  var terrain = this.createTerrain(this.width, this.depth);
  var positions = this.createRandomPosition();
  for(var i = 0; i < positions.length; i++){
    var obj = new THREE.Object3D();
    obj.position = new THREE.Vector3(positons[i].x, 0, positons[i].z);
    this.octree.addDeferred(obj);
  }
  
	this.add(terrain);
};

THREE.Foliage.prototype.createRandomPosition = function () {

  var positions = [];
  var positionsNumber = 1000;
  for(var i = 0; i < positionsNumber; i++) {
    positions.push({
      x: Math.random() * this.width,
      z: Math.random() * this.depth
    });
  }

  return positions;
};

THREE.Foliage.prototype.models = [
  // lod 0
  [
    '../app/models/grass/lod2/grass_0_single_grass_patch_lod2.js',
    '../app/models/grass/lod2/grass_01_single_grass_patch_lod2.js',
    '../app/models/grass/lod2/grass_03_single_grass_patch_lod2.js',
    '../app/models/grass/lod2/grass_04_single_grass_patch_lod2.js'
  ],
  // lod 2
  [
    '../app/models/grass/lod3/grass_0_single_grass_patch_lod3.js',
    '../app/models/grass/lod3/grass_01_single_grass_patch_lod3.js',
    '../app/models/grass/lod3/grass_03_single_grass_patch_lod3.js',
    '../app/models/grass/lod3/grass_04_single_grass_patch_lod3.js'
  ],
  // lod 2
  [
    '../app/models/grass/lod4/grass_0_single_grass_patch_lod4.js',
    '../app/models/grass/lod4/grass_01_single_grass_patch_lod4.js',
    '../app/models/grass/lod4/grass_03_single_grass_patch_lod4.js',
    '../app/models/grass/lod4/grass_04_single_grass_patch_lod4.js'
  ],
  // lod 3
  [
    '../app/models/textures/grass.png',
  ]
];
