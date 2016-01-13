//global variables
var billboardMap, billboardPositions;

//default constructor
THREE.Foliage = function () {
    new THREE.Foliage({});
};

//constructor with params
THREE.Foliage = function (opts) {
    THREE.Object3D.call(this);

    //callback function when foliage is loaded
    this.loadingDone = opts.callback !== undefined ? opts.callback : this.loadingDone;
    //set custom mapsize
    this.width = opts.width !== undefined ? opts.width : this.width;
    this.depth = opts.depth !== undefined ? opts.depth : this.depth;
    this.positionAmount = this.width * this.depth / 2;
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
THREE.Foliage.prototype.levelDefinition = [40, 80, 160, 150];

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
        billboardPositions[billboardMap.get(this.uuid)] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 2] = undefined;
    } else if (event.level == 3) {
        //LOD 3
        billboardPositions[billboardMap.get(this.uuid)] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 2] = undefined;
    } else if (event.level == 2) {
        //LOD 2
        billboardPositions[billboardMap.get(this.uuid)] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 2] = undefined;
    } else if (event.level == 1) {
        //LOD 1
        billboardPositions[billboardMap.get(this.uuid)] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 1] = undefined;
        billboardPositions[billboardMap.get(this.uuid) + 2] = undefined;
    } else if (event.level == 0) {
        //LOD 0
        billboardPositions[billboardMap.get(this.uuid)] = this.position.x;
        billboardPositions[billboardMap.get(this.uuid) + 1] = this.position.y + 0.5;
        billboardPositions[billboardMap.get(this.uuid) + 2] = this.position.z;
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
    var textureDiffuseUrl = '../public/textures/sand_clean_bumpy_01_b.png';
    var textureDiffuse = THREE.ImageUtils.loadTexture(textureDiffuseUrl);
    textureDiffuse.wrapS = THREE.RepeatWrapping;
    textureDiffuse.wrapT = THREE.RepeatWrapping;
    textureDiffuse.repeat.x = width / 2;
    textureDiffuse.repeat.y = height / 2;
    // create the textureNormal
    var textureNormalUrl = '../public/textures/sand_clean_bumpy_01_b_normal.png';
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
