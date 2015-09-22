/*jslint node: true */
'use strict';

// Foliage Engine by Andri Hadorn & Lukas Zimmermann
/**
 * Creates a new foliage object with the default values
 *
 * @author Andri Hadorn & Lukas Zimmermann
 * @constructor
 */
THREE.Foliage = function () {
  new THREE.Foliage({});
};

/**
 *  Creates a new foliage object
 *
 *  otps can contain:
 *      width: width of the foliage object,
 *      depth: depth of the foliage object,
 *      callback: function which is called after the
 *      foliage is successfully created,
 *      models: an arrax for each LOD level with all models for this level,
 *      createTerrain: a function which creates a plane or a terrain,
 *      calculateHeight: a function which gets the height (y axis) for a
 *      foilage object on a point (x, z)
 *      createPositions: a function which generates an array for each
 *      LOD level with multiple positions. Each position has
 *      an x, y value and a meshIdx, which mesh should be displayed
 *
 * @author Andri Hadorn & Lukas Zimmermann
 * @constructor
 */
THREE.Foliage = function (opts) {
  if (!(this instanceof THREE.Foliage)) {
    return new THREE.Foliage(name);
  }
  THREE.Object3D.call(this);
  // handle default arguments
  opts = opts || {};
  this.width = opts.width !== undefined ? opts.width : this.width;
  this.depth = opts.depth !== undefined ? opts.depth : this.depth;
  this.callback = opts.callback !== undefined ? opts.callback : this.callback;
  this.models = opts.models !== undefined ? opts.models : this.models;
  this.levelDefinition =
    opts.levelDefinition !== undefined ? opts.levelDefinition : this.levelDefinition;
  this.createTerrain = opts.createTerrain !== undefined ? opts.createTerrain : this.createTerrain;
  this.calculateHeight =
    opts.calculateHeight !== undefined ? opts.calculateHeight : this.calculateDefaultHeight;
  this.createPositions =
    opts.createPositions !== undefined ? opts.createPositions : this.createPositions;
  for (var i = 0; i < this.models.length; i++) {
    var level = this.models[i].level;
    var models = this.models[i].models;
    var textures = this.models[i].textures;
    this.lodTemplates.push(null);
    if (models) {
      for (var j = 0; j < models.length; j++) {
        this.totalModels++;
        this.handle3DLevel(models[j], j, level);
      }
    }
    if (textures) {
      textures = textures();
      for (var x = 0; x < textures.length; x++) {
        this.totalModels++;
        this.handle2DLevel(textures[x], x, level);
      }
    }
  }
  this.updateMatrix();
};

// JS Class Foliage
THREE.Foliage.prototype = Object.create(THREE.Object3D.prototype);
THREE.Foliage.prototype.constructor = THREE.Foliage;
/**
 * Default width of a foliage object
 * @type {number}
 */

THREE.Foliage.prototype.width = 100;
/**
 * Default depth of a foliage object
 * @type {number}
 */

THREE.Foliage.prototype.depth = 100;
/**
 * The last camera position of the last update
 * @type {THREE.Vector3}
 */

THREE.Foliage.prototype.oldCameraPos = new THREE.Vector3();
/**
 * All LOD level definitions with the loaded meshes
 * @type {Array}
 */

THREE.Foliage.prototype.lodTemplates = [];
/**
 * All created LOD objects, created by THREE.Foliage.createLOD()
 * @type {Array}
 */

THREE.Foliage.prototype.lodObjects = [];
/**
 * Counts the amount of the definied models
 * @type {number}
 */

THREE.Foliage.prototype.totalModels = 0;
/**
 * Counts the amount of all loaded models
 * @type {number}
 */

THREE.Foliage.prototype.modelsLoaded = 0;
/**
 * Update in update() can be forced if forceUpdate is true
 * @type {boolean}
 */

THREE.Foliage.prototype.forceUpdate = false;
/**
 * The distance definition for each LOD level
 * @type {number[]}
 */

THREE.Foliage.prototype.levelDefinition = [
  1,
  7.5,
  20,
  50
];

/**
 * Array of LOD level definitions, each definition
 * contains the level number and an array of models or textures
 * @type {Array}
 */
THREE.Foliage.prototype.models = [
  {
    level: 1,
    models: [
      '../app/models/grass/lod2/grass_0_single_grass_patch_lod2.js',
      '../app/models/grass/lod2/grass_01_single_grass_patch_lod2.js',
      '../app/models/grass/lod2/grass_03_single_grass_patch_lod2.js',
      '../app/models/grass/lod2/grass_04_single_grass_patch_lod2.js'
    ]
  },
  {
    level: 2,
    models: [
      '../app/models/grass/lod3/grass_0_single_grass_patch_lod3.js',
      '../app/models/grass/lod3/grass_01_single_grass_patch_lod3.js',
      '../app/models/grass/lod3/grass_03_single_grass_patch_lod3.js',
      '../app/models/grass/lod3/grass_04_single_grass_patch_lod3.js'
    ]
  },
  {
    level: 3,
    models: [
      '../app/models/grass/lod4/grass_0_single_grass_patch_lod4.js',
      '../app/models/grass/lod4/grass_01_single_grass_patch_lod4.js',
      '../app/models/grass/lod4/grass_03_single_grass_patch_lod4.js',
      '../app/models/grass/lod4/grass_04_single_grass_patch_lod4.js'
    ]
  },
  {
    level: 4,
    textures: function () {
      // create the textureDiffuse
      var textureDiffuseUrl = 'textures/lod2d.png';
      var textureDiffuse = THREE.ImageUtils.loadTexture(textureDiffuseUrl);
      textureDiffuse.wrapS = THREE.RepeatWrapping;
      textureDiffuse.wrapT = THREE.RepeatWrapping;
      textureDiffuse.repeat.x = 1;
      textureDiffuse.repeat.y = 1;
      textureDiffuse.anisotropy = 16;
      // create the textureNormal
      var textureNormalUrl = 'textures/lod2d_normal.png';
      var textureNormal = THREE.ImageUtils.loadTexture(textureNormalUrl);
      textureNormal.wrapS = THREE.RepeatWrapping;
      textureNormal.wrapT = THREE.RepeatWrapping;
      textureNormal.repeat.x = 1;
      textureNormal.repeat.y = 1;
      textureNormal.anisotropy = 16;
      var material = new THREE.MeshPhongMaterial({
        map: textureDiffuse,
        normalMap: textureNormal,
        normalScale: new THREE.Vector2(1, 1)
      });
      material.transparent = true;
      var retVal = [material];
      return function () {
        return retVal;
      };
    }
  }
];

/**
 * Creates an THREE.LOD object and pushes it to THREE.Foliage.lodObjects
 * @returns {THREE.LOD}
 */
THREE.Foliage.prototype.createLOD = function () {
  var lod = new THREE.LOD();
  this.lodObjects.push(lod);
  return lod;
};

/**
 * Callback function which is called when the foliage is successfully created
 */
THREE.Foliage.prototype.callback = function () {
};

/**
 * Updates the LOD object
 * @param {THREE.Camera} camera camera for calculating the distance
 * @param {number} delta delta time since the last call
 */

THREE.Foliage.prototype.update = function (camera, delta) { // jshint ignore:line
  // calculates the distance between the current and the old camera position
  var deltaPos = 0;
  if (camera !== undefined) {
    // dist immer 0!
    deltaPos = this.oldCameraPos.distanceTo(camera.getWorldPosition());
  }
  //update
  if (deltaPos > 0.1 || this.forceUpdate) {
    // update each THREE.LOD object
    for (var i = 0; i < this.lodObjects.length; i++) {
      var object = this.lodObjects[i];
      if (object instanceof THREE.LOD) {
      }
    }
    // update successfully done
    this.oldCameraPos = camera.position.clone();
    this.forceUpdate = false;
  }
};

/**
 * Creates the underground for the foliage
 * @param {number} width width of the underground
 * @param {number} height height of the underground
 * @returns {THREE.Mesh} underground
 */
THREE.Foliage.prototype.createTerrain = function (width, height) {
  var geometry = new THREE.PlaneGeometry(width, height, width, height);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  for (var i = 0; i < geometry.vertices.length; i++) {
    var x = geometry.vertices[i].x;
    var z = geometry.vertices[i].z;
    geometry.vertices[i].y = this.calculateHeight(x, z);
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

/**
 * Calculates the height (y axis) for a foliage object at a given point (x, z)
 * @param {number} x
 * @param {number} z
 * @returns {number} height at the given point
 */
THREE.Foliage.prototype.calculateDefaultHeight = function (x, z) {
  x = x / 2.5;
  z = z / 2.5;
  return (Math.sin(x) + Math.cos(z)) / 4;
};

/**
 * Callback function for the JSON Loader.
 * @param {number} level level of the mesh
 * @param {number} meshIdx mesh Index of the mesh
 * @returns {Function} callback function which
 * is called when the JSON loader loaded the mesh
 */
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
    if (foliage.lodTemplates[level - 1] !== null) {
      foliage.lodTemplates[level - 1].addMesh(meshIdx, mesh);
    } else {
      foliage.lodTemplates[level - 1] = new THREE.Foliage.LodTemplate(meshIdx, mesh, level, '3d');
    }
    foliage.modelsLoaded++;
    foliage.createFoliage();
  };
};

/**
 * 'plants' the foliage on the underground if all models are loaded.
 */
THREE.Foliage.prototype.createFoliage = function () {
  // All levels loaded?
  if (this.modelsLoaded === this.totalModels) {
    // Create terrain
    var terrain = this.createTerrain(this.width, this.depth);
    if (terrain !== undefined) {
      this.add(terrain);
    }
    // Create and sort the positions
    // Each LOD object represends a lodObjectSize * lodObjectSize area
    var lodObjectSize = 5;
    var positions = [];
    var unsortedPositions = this.createPositions();
    if (unsortedPositions === undefined || unsortedPositions === null) {
      return;
    }
    for (var j = 0; j < unsortedPositions.length; j++) {
      positions[j] = [];
      var p = unsortedPositions[j];
      for (var i = 0; i < p.length; i++) {
        if (
          positions[j][Math.floor(p[i].x / lodObjectSize)] === undefined ||
          positions[j][Math.floor(p[i].x / lodObjectSize)] === null) {
          positions[j][Math.floor(p[i].x / lodObjectSize)] = [];
        }
        if (
          positions[j][Math.floor(p[i].x / lodObjectSize)]
            [Math.floor(p[i].y / lodObjectSize)] === undefined ||
              positions[j][Math.floor(p[i].x / lodObjectSize)]
            [Math.floor(p[i].y / lodObjectSize)] === null) {
          positions[j][Math.floor(p[i].x / lodObjectSize)]
            [Math.floor(p[i].y / lodObjectSize)] = [];
        }
        positions[j][Math.floor(p[i].x / lodObjectSize)]
        [Math.floor(p[i].y / lodObjectSize)].push(p[i]);
      }
    }
    // 'plants' the foliage meshes at the given points
    for (var x = 0; x < this.width; x += lodObjectSize) {
      for (var y = 0; y < this.depth; y += lodObjectSize) {
        var lod = this.createLOD();
        lod.position.x = x - this.width / 2 + 1;
        lod.position.z = y - this.depth / 2 + 1;
        // Saves the scales over all levels
        var scales = [];
        // Saves the rotation over all levels
        var rotationY = [];
        var xIdx = Math.floor(x / lodObjectSize);
        var yIdx = Math.floor(y / lodObjectSize);
        for (var lodLevel = 0; lodLevel < this.lodTemplates.length; lodLevel++) {
          if (this.lodTemplates[lodLevel] === null) {
            break;
          }
          var mergedMesh;
          // Creates the 2d plane
          if (this.lodTemplates[lodLevel].mode === '2d') {
            //only one 2d mesh is supported
            var mesh = this.lodTemplates[lodLevel].meshes[0].clone();
            mesh.scale.x = 1;
            mesh.scale.y = 1;
            mesh.castShadow = true;
            mergedMesh = mesh;
            if (terrain !== undefined) {
              mesh.position.y += this.calculateHeight(lod.position.x, lod.position.z) + 0.1;
            }
            mesh.position.x += 2.5;
            mesh.position.z += 2.5;  // Creates the 3d models
          } else if (positions[lodLevel] !== undefined &&
                     positions[lodLevel][xIdx] !== undefined &&
                     positions[lodLevel][xIdx][yIdx] !== undefined &&
                     positions[lodLevel][xIdx][yIdx] !== null) {
            mergedMesh = new THREE.Object3D();
            var posArray = positions[lodLevel][xIdx][yIdx];
            for (var positionIdx = 0; positionIdx < posArray.length; positionIdx++) {
              var pos = posArray[positionIdx];
              var mesh =
                this.lodTemplates[lodLevel].meshes[pos.meshIdx].clone();
              if (scales[positionIdx] === undefined) {
                var scaleDiff = Math.random() * 0.1 - 0.2;
                mesh.scale.x += scaleDiff;
                mesh.scale.y += scaleDiff;
                mesh.scale.z += scaleDiff;
                scales[positionIdx] = mesh.scale.clone();
              } else {
                mesh.scale.x = scales[positionIdx].x;
                mesh.scale.y = scales[positionIdx].y;
                mesh.scale.z = scales[positionIdx].z;
              }
              if (rotationY[positionIdx] === undefined) {
                var rotation = Math.random() * 2 * Math.PI;
                mesh.rotateY(rotation);
                rotationY[positionIdx] = rotation;
              } else {
                mesh.rotateY(rotationY[positionIdx]);
              }
              mesh.position.x = pos.x - x;
              mesh.position.z = pos.y - y;
              if (terrain !== undefined) {
                mesh.position.y +=
                  this.calculateHeight(lod.position.x + mesh.position.x,
                                       lod.position.z + mesh.position.z);
              }
              mesh.castShadow = true;
              mergedMesh.add(mesh);
            }
            // if there is no foliage for this area, there will no foliage in all levels
            if (positions[lodLevel][xIdx][yIdx].length < 1) {
              lod = null;
            }
          }
          if (mergedMesh !== undefined && lod != null) {
            mergedMesh.castShadow = true;
            mergedMesh.visible = false;
            lod.addLevel(mergedMesh, this.levelDefinition[lodLevel]);
          }
        }
        if (lod != null) {
          lod.castShadow = true;
          this.add(lod);
        }
      }
    }
    // foliage successfully created
    this.forceUpdate = true;
    this.callback(this);
  }
};

/**
 * Creates an array with arrays of positions for each LOD level (2d levels excluded)
 * @returns {Array} [lodLevel] = Array of positions, position = {x, y, mesh Index}
 */
THREE.Foliage.prototype.createPositions = function () {
  var positions = [];
  for (var lodLevel = 0; lodLevel < this.lodTemplates.length; lodLevel++) {
    if (this.lodTemplates[lodLevel] === null ||
        this.lodTemplates[lodLevel].meshes.length < 1 ||
        this.lodTemplates[lodLevel].mode === '2d') {
      break;
    }
    positions[lodLevel] = [];
  }
  for (var x = -1; x <= this.width - 1.5; x += 0.4 + Math.random() * 0.25) {
    for (var y = -1; y <= this.depth - 1.5; y += 0.4 + Math.random() * 0.25) {
      var meshIdx = Number.MAX_VALUE;
      for (var lodLevel = 0; lodLevel < this.lodTemplates.length; lodLevel++) {
        if (this.lodTemplates[lodLevel] === null ||
            this.lodTemplates[lodLevel].meshes.length < 1 ||
            this.lodTemplates[lodLevel].mode === '2d') {
          break;
        }
        if (this.lodTemplates[lodLevel].meshes.length <= meshIdx) {
          meshIdx = Math.floor(Math.random() * this.lodTemplates[lodLevel].meshes.length);
        }
        positions[lodLevel].push({
          x: x,
          y: y,
          meshIdx: meshIdx
        });
      }
    }
  }
  return positions;
};

/**
 * Loads a 3d json model
 * @param {string} modelURL json model url
 * @param {number} modelIdx model index
 * @param {number} level LOD level index
 */
THREE.Foliage.prototype.handle3DLevel = function (modelURL, modelIdx, level) {
  if (!this.loader) {
    this.loader = new THREE.JSONLoader();
  }
  this.loader.load(modelURL, this.modelLoaded(level, modelIdx));
};

/**
 * Creates an 2d plane with the defined texture
 * @param {THREE.Material} texture texture for the plane
 * @param {number} textureIdx texture index
 * @param {number} level LOD level index
 */
THREE.Foliage.prototype.handle2DLevel = function (texture, textureIdx, level) {
  var object3D = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), texture);
  object3D.rotateX(-Math.PI / 2);
  if (this.lodTemplates[level - 1] !== null) {
    this.lodTemplates[level - 1].addMesh(textureIdx, object3D);
  } else {
    this.lodTemplates[level - 1] = new THREE.Foliage.LodTemplate(textureIdx, object3D, level, '2d');
  }
  this.modelsLoaded++;
  this.createFoliage();
};

/**
 * Object which decribes a LOD level
 * @param {number} meshIdx mesh index
 * @param {THREE.Mesh} mesh THREE.Mesh
 * @param {number} level LOD level index
 * @param {string} mode String '3d' or '2d'
 * @constructor
 */
THREE.Foliage.LodTemplate = function (meshIdx, mesh, level, mode) {
  this.level = level;
  this.mode = mode;
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
