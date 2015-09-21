	<script type="x-shader/x-vertex" id="grassvertexshader">

        uniform float zoom;

        attribute float atlasIndex;

        varying vec2 vUv;
        //varying float grassViewHeight;
        varying float viewHeight;

        const float imageSize = 128.0;
        const float imagesOnAtlas = 2.0;
        const float PI = 3.14159265358979323846264;

        void main() {

        float y = floor(atlasIndex / imagesOnAtlas);
        vUv = vec2( (atlasIndex - y * imagesOnAtlas) / imagesOnAtlas, y / imagesOnAtlas );

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		
		//if (length( mvPosition.xyz ) < 10.0) discard;

        viewHeight = cos(atan(abs(cameraPosition.y - position.y) / length(position.xz - cameraPosition.xz)));

        gl_PointSize = zoom * ( 180.0 / length( mvPosition.xyz ) );

        gl_Position = projectionMatrix * mvPosition;

        }

    </script>

    <script type="x-shader/x-fragment" id="grassfragmentshader">

        //uniform sampler2D grassAtlas;
        uniform sampler2D atlas;

        varying vec2 vUv;

        //varying float grassViewHeight;
        varying float viewHeight;

        const float imagesOnAtlas = 2.0;

        void main() {
            //if (gl_PointCoord.y < grassViewHeight) {
            if (gl_PointCoord.y < viewHeight) {
                gl_FragColor = texture2D(atlas, vec2( (gl_PointCoord.x / imagesOnAtlas) + vUv.s, ((gl_PointCoord.y / imagesOnAtlas) / viewHeight) + vUv.t ) );
                //gl_FragColor = texture2D(grassAtlas, vec2( (gl_PointCoord.x / imagesOnAtlas) + vUv.s, ((gl_PointCoord.y / imagesOnAtlas) / grassViewHeight) + vUv.t ) );
                //gl_FragColor = texture2D(grassAtlas, vUv );
            } else {
                gl_FragColor.r = 1.0;
                gl_FragColor.g = 1.0;
                gl_FragColor.b = 1.0;
                gl_FragColor.a = 0.0;
            }
        }

    </script>