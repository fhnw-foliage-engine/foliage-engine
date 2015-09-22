////////////////////////////////////////////////////////////////////////////
/////                                                                  /////
///// Foliage Engine for three.js / read me                            /////
/////                                                                  /////
///// ---------------------------------------------------------------- /////
/////                                                                  /////
///// created by Andri Hadorn & Lukas Zimmermann                       /////
///// University of Applied Sciences and Arts Northwestern Switzerland /////
/////                                                                  /////
///// August 14, 2015                                                  /////
/////                                                                  /////
///// ---------------------------------------------------------------- /////
/////                                                                  /////
///// Contains: license informations, credits, usage and examples      /////
/////                                                                  /////
////////////////////////////////////////////////////////////////////////////

Released under creative commons Attribution 3.0 Unported license (CC-BY 3.0)

http://creativecommons.org/licenses/by/3.0/

"This license is acceptable for Free Cultural Works.
You are free:

    to Share & to copy, distribute and transmit the work
    to Remix & to adapt the work
    to make commercial use of the work

Under the following conditions:

    Attribution
	You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests
        that they endorse you or your use of the work)"

////////////////////////////////////////////////////////////////////////////

Credits:

Grass models
Mischa Winkler
http://www.mwvizwork.com

Sand underground texture
Christian Femmer aka Duion
http://opengameart.org/content/terrainssandpack01zip

Skybox - Above The Sea
iedoc
http://www.braynzarsoft.net/vision/index.php?p=VT&texture=25&vi=y

////////////////////////////////////////////////////////////////////////////

Usage:

For using it in a project, copying the following files is needed:
- three.foliageengine.js
- models/grass/
  - lod0/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch.js
    - grass_01_single_grass_patch.js
    - grass_03_single_grass_patch.js
    - grass_04_single_grass_patch.js
  - lod1/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch_lod1.js
    - grass_01_single_grass_patch_lod1.js
    - grass_03_single_grass_patch_lod1.js
    - grass_04_single_grass_patch_lod1.js
  - lod2/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch_lod2.js
    - grass_01_single_grass_patch_lod2.js
    - grass_03_single_grass_patch_lod2.js
    - grass_04_single_grass_patch_lod2.js
  - lod3/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch_lod3.js
    - grass_01_single_grass_patch_lod3.js
    - grass_03_single_grass_patch_lod3.js
    - grass_04_single_grass_patch_lod3.js
  - lod4/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch_lod4.js
    - grass_01_single_grass_patch_lod4.js
    - grass_03_single_grass_patch_lod4.js
    - grass_04_single_grass_patch_lod4.js
  - lod5/
    - Blade_0.jpg    - Blade_01.jpg    - Blade_02.jpg    - Blade_03.jpg    - Blade_04.jpg
    - grass_0_single_grass_patch_lod5.js
    - grass_01_single_grass_patch_lod5.js
    - grass_03_single_grass_patch_lod5.js
    - grass_04_single_grass_patch_lod5.js
  - textures/    - lod2d_normal.png    - lod2d.png    - sand_clean_bumpy_01_b_normal.png o sand_clean_bumpy_01_b.png

There are models for six different LOD levels. LOD0 has the most detailed and LOD5 the least detailed models.

For creating a foliage object, you have to call new THREE.Foliage();. This will create a plane, 100 x 100 units, 
with the default models. Important: the folder with the models, which is named “models”, and the folder with the 
textures, which is named “textures”, have to be in the same folder as the caller site, for example index.html. 
This foliage object can now be added to the scene.

For updating the LOD objects you have to add following statement to the animate() method:

var time = performance.now();var delta = ( time - prevTime ) / 1000;renderer.render( scene, camera );foliageObject.update(camera, delta);prevTime = time;

For modifying the foliage object, you can call the constructor with following arguments:
foliage = new THREE.Foliage({
  width:           worldWidth,  depth:           worldDepth,  callback:        function() { /* do something */ },  createTerrain:   createTerrain,  calculateHeight: calculateHeight,  models:          models,  levelDefinition: levelDefinition,  createPositions: createPositions});scene.add(foliage);

The explanation of the API can be found here: http://grass.andri-h.ch/docs/THREE.Foliage.html

////////////////////////////////////////////////////////////////////////////

Examples:
http://grass.andri-h.ch/
http://grass.andri-h.ch/scenes/demo.html
http://grass.andri-h.ch/scenes/50fps.html
http://grass.andri-h.ch/scenes/2.5d.html
http://grass.andri-h.ch/scenes/32.52d.html
http://grass.andri-h.ch/scenes/unity.html
http://grass.andri-h.ch/scenes/phd.html

////////////////////////////////////////////////////////////////////////////