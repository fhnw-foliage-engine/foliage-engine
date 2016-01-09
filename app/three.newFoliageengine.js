//global variables
var billboardMap, billboardPositions;
var foliageCall;

//default constructor
THREE.Foliage = function () {
    new THREE.Foliage({});
};

//constructor with params
THREE.Foliage = function (opts) {
    THREE.Object3D.call(this);
    foliageCall = this;

    //callback function when foliage is loaded
    this.loadingDone = opts.callback !== undefined ? opts.callback : this.loadingDone;
    //set custom mapsize
    this.width = opts.width !== undefined ? opts.width : this.width;
    this.depth = opts.depth !== undefined ? opts.depth : this.depth;
    this.positionAmount = this.width * this.depth / 2 /100;
    //set scene for octree debugging
    this.scene = opts.scene;

    //initialize octree
    this.octree = new THREE.Octree({
        depthMax: Infinity,
        objectsThreeshold: 8,
        overlapPct: 0.15,
        //scene: this.scene,
        levelOfDetailRange: this.levelDefinition,
        levelOfDetailChangedCallback: this.levelOfDetailChangedCallback,
        undeffered: true
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
THREE.Foliage.prototype.levelDefinition = [20, 40, 80, 120];

//area width
THREE.Foliage.prototype.width = 100;

//area depth
THREE.Foliage.prototype.depth = 100;

//amount of positions TODO: define a formula!
THREE.Foliage.prototype.positionAmount = 1000;

//default loading done callback Function
THREE.Foliage.prototype.loadingDone = function () { };

//default level of detail despatch event callback function
THREE.Foliage.prototype.levelOfDetailChangedCallback = function (event) {
    if (event.level >= 4) {
        //LOD 4
        var removable = foliageCall.getObjectByName(event.target.uuid);
        foliageCall.remove(removable);
        removable = null;
        billboardPositions[billboardMap.get(event.target.uuid)] = event.target.position.x;
        billboardPositions[billboardMap.get(event.target.uuid) + 1] = event.target.position.y + 0.5;
        billboardPositions[billboardMap.get(event.target.uuid) + 2] = event.target.position.z;
    } else if (event.level == 3) {
        //LOD 3
        var removable = foliageCall.getObjectByName(event.target.uuid);
        foliageCall.remove(removable);
        removable = null;
        billboardPositions[billboardMap.get(event.target.uuid)] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 2] = undefined;
    } else if (event.level == 2) {
        //LOD 2
        var removable = foliageCall.getObjectByName(event.target.uuid);
        foliageCall.remove(removable);
        removable = null;
        billboardPositions[billboardMap.get(event.target.uuid)] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 2] = undefined;
    } else if (event.level == 1) {
        //LOD 1
        var removable = foliageCall.getObjectByName(event.target.uuid);
        foliageCall.remove(removable);
        removable = null;
        billboardPositions[billboardMap.get(event.target.uuid)] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 2] = undefined;
    } else if (event.level == 0) {
        //LOD
        var removable = foliageCall.getObjectByName(event.target.uuid);
        foliageCall.remove(removable);
        removable = null;
        var mesh = foliageCall.lodTemplates[event.level].meshes[0].clone();
        mesh.name = event.target.uuid;
        mesh.position.x = event.target.position.x;
        mesh.position.y = event.target.position.y + 0.5;
        mesh.position.z = event.target.position.z;
        foliageCall.add(mesh);
        billboardPositions[billboardMap.get(event.target.uuid)] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(event.target.uuid) + 2] = undefined;
    } else {
        console.log("updated LOD undefined");
    }
};

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
THREE.Foliage.prototype.createFoliage = function () {
    var positions = this.createRandomPosition();

    //create terrain
    var terrain = this.createTerrain(this.width, this.depth);
    this.add(terrain);
    //end terrain

    //prepare octree
    for (var i = 0; i < positions.length; i = i + 3) {
        var obj = new THREE.Object3D();
        obj.position.set(positions[i], positions[i + 1], positions[i + 2]);
        obj.geometry = new THREE.Geometry();
        obj.geometry.vertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
        this.octree.add(obj);
    }
    this.octree.update();
    //end octree

    //load 3D Models
    for(var i = 0; i < this.models.length - 1; i++) {
        var models = this.models[i];
        this.lodTemplates.push(null);
        if(models){
            for(var j = 0; j < models.length; j++){
                this.handle3DLevel(models[j], j, i);
            }
        }
    }
    //end 3D Models

    //create Billboard
    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsGeometry.dynamic = true;
    var floatPositions = new Float32Array(positions.length);

    this.billboardMap = new Map();
    var objects = this.octree.objects;
    for (var i = 0; i < objects.length; i++) {
        floatPositions[i * 3 + 0] = objects[i].position.x;
        floatPositions[i * 3 + 1] = objects[i].position.y + 0.5;
        floatPositions[i * 3 + 2] = objects[i].position.z;
        this.billboardMap.set(objects[i].uuid, i * 3);
    }
    billboardMap = this.billboardMap;

    this.pointsGeometry.addAttribute('position', new THREE.BufferAttribute(floatPositions, 3));
    billboardPositions = this.pointsGeometry.attributes.position.array;

    var pointsMaterial = new THREE.PointsMaterial();
    pointsMaterial.map = THREE.ImageUtils.loadTexture(this.models[3][0]);
    pointsMaterial.size = 2.0;
    pointsMaterial.alphaTest = 0.1;

    this.points = new THREE.Points(this.pointsGeometry, pointsMaterial);

    this.add(this.points);
    //end billboard
};

//create random positions for foliage
THREE.Foliage.prototype.createRandomPosition = function () {

    var positions = [];
    for (var i = 0; i < this.positionAmount; i++) {
        positions.push((Math.random() * this.width) - this.width / 2);
        positions.push(0);
        positions.push((Math.random() * this.depth) - this.width / 2);
    }

    return positions;
};

//method called for updating foliage LOD
THREE.Foliage.prototype.update = function ( control ) {
    //TODO update position for LOD and other funny stuff...
    //console.log(control.position);
    this.octree.updateLevelOfDetail(control.position);
    this.pointsGeometry.attributes.position.needsUpdate = true;
}

//array with modelspath for each LOD
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
    // lod 3
    [
        '../app/models/grass/lod4/grass_0_single_grass_patch_lod4.js',
        '../app/models/grass/lod4/grass_01_single_grass_patch_lod4.js',
        '../app/models/grass/lod4/grass_03_single_grass_patch_lod4.js',
        '../app/models/grass/lod4/grass_04_single_grass_patch_lod4.js'
    ],
    // lod 4
    [
        '../app/models/textures/grass.png',
    ]
];

THREE.Foliage.prototype.handle3DLevel = function (modelURL, modelIdx, level) {
  if (!this.loader) {
    this.loader = new THREE.JSONLoader();
  }
  this.loader.load(modelURL, this.modelLoaded(level, modelIdx));
};

THREE.Foliage.prototype.modelLoaded = function (level, meshIdx) {
  var foliage = this;
  return function (geometry, material) {
    for (var i = 0; i < material.length; i++) {
      var materialDoubleSided = material[i];
      materialDoubleSided.side = THREE.DoubleSide;
    }
    // Register new loaded LOD Level
    var mesh = new THREE.Mesh(
      new THREE.BufferGeometry().fromGeometry(geometry),
      new THREE.MeshFaceMaterial(material));

    mesh.scale.x = 0.5;
    mesh.scale.y = 0.5;
    mesh.scale.z = 0.5;
    mesh.castShadow = true;
    if (foliage.lodTemplates[level] !== null) {
      foliage.lodTemplates[level].addMesh(meshIdx, mesh);
    } else {
      foliage.lodTemplates[level] = new THREE.Foliage.LodTemplate(meshIdx, mesh, level);
    }
  };
};

/**
 * All LOD level definitions with the loaded meshes
 * @type {Array}
 */

THREE.Foliage.prototype.lodTemplates = [];

/**
 * Object which decribes a LOD level
 * @param {number} meshIdx mesh index
 * @param {THREE.Mesh} mesh THREE.Mesh
 * @param {number} level LOD level index
 * @param {string} mode String '3d' or '2d'
 * @constructor
 */
THREE.Foliage.LodTemplate = function (meshIdx, mesh, level) {
  this.level = level;
  this.meshes = [];
  this.addMesh(meshIdx, mesh);
};

/**
 * All meshes of the LOD level
 * @type {Array}
 */
THREE.Foliage.LodTemplate.prototype.meshes = [];

/**
 * Add another mesh to this LOD level
 * @param {number} meshIdx mesh index
 * @param {THREE.Mesh} mesh THREE.Mesh
 */
THREE.Foliage.LodTemplate.prototype.addMesh = function (meshIdx, mesh) {
  this.meshes[meshIdx] = mesh;
};
