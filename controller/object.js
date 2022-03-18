const upload = require('../middleware/fileFunction.js')('user');
const objectValidator = require("../validator/object.js");
const APIRef = 'Object';
const constants = require("../util/constants");
const responses = require("../util/responses");

const {
    md5,
    _,
    object,
    routes,
    databaseServices,
    authenticateController,
    commonFunctions,
    translation,
    Moment,
} = require('../services/baseService.js')


let Upload = upload.fields([{
    name: 'user_pic'
}, {
    name: 'user_multiple_pics'
}, {
    name: 'user_pic2'
}, {
    name: 'user_pic3'
}]);

// Get Object Nearby API
routes.get('/get_object_nearby', objectValidator.getObjectNearby, async (req, res) => {
    
    const languageCode = req.query.language;
    try {

        let data = req.query;
        let pos_x = data.position_x ? data.position_x : '';
        let pos_y = data.position_y ? data.position_y : '';
        let pos_z = data.position_z ? data.position_z : '';
        let rot_x = data.rotation_x ? data.rotation_x : '';
        let rot_y = data.rotation_y ? data.rotation_y : '';
        let rot_z = data.rotation_z ? data.rotation_z : '';

        let objectrows = await object.getObjectNearby(pos_x, pos_y, pos_z, rot_x, rot_y, rot_z);

        let promises = objectrows.map(element => {
            return new Promise((resolve, reject) => {
                let material_id = element.material_id;
                if(material_id){
                    commonFunctions.getSingleRowNew(APIRef, 'material', 'material_id', material_id, 'getObjectMaterial').then((objectMaterial) => {
                        if (element) {
                            element.material = objectMaterial[0];
                            resolve(element);                            
                        }
                    });
                } else {
                    let fakeObject = {
                        id: 0,
                        material_id: '',
                        metalic: 0,
                        roughness: 0,
                        has_alpha: 0,
                        alpha: 0,
                        shape: '',
                        albedo_color_r: 0,
                        albedo_color_g: 0,
                        albedo_color_b: 0,
                        albedo_color_a: 0,
                        albedo_texture: '',
                        emissive_color_r: 0,
                        emissive_color_g: 0,
                        emissive_color_b: 0,
                        emissive_color_a: 0,
                        emissive_texture: ''
                    };
                    element.material = fakeObject;
                    resolve(element);
                }              
            });
        });

        Promise.all(promises).then(objectDetails => {
            return responses.actionCompleteResponse(res, languageCode, objectDetails, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
        }).catch(error => {
            console.log(error);
        });

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Add object records to database by using game.json
routes.get('/add_object_json', async (req, res) => {
    const languageCode = req.query.language;
    let json_file = req.query.json ? req.query.json : 'game.json';
    const games = require("../gltf/" + json_file);

    try {
        let length = games.length;
        for (let i=0; i<length; i++){
            let game = games[i];
            let object = {};
            object.entity_id = game.Entity_ID;
            object.entity_name = game.Entity_Name;
            object.position_x = game.Position.x;
            object.position_y = game.Position.y;
            object.position_z = game.Position.z;
            object.rotation_x = game.Rotation.x;
            object.rotation_y = game.Rotation.y;
            object.rotation_z = game.Rotation.z;
            object.rotation_w = game.Rotation.w;
            object.parent_id = game.Parent_ID;
            object.scale_x = game.Scale.x;
            object.scale_y = game.Scale.y;
            object.scale_z = game.Scale.z;
            object.shape = game.Shape;
            object.with_collisions = game.withCollisions;
            object.gltf_path = game.GLTF_Path;
            object.gltf_rotation_x = game.GLTF_Rotation ? game.GLTF_Rotation.x : null;
            object.gltf_rotation_y = game.GLTF_Rotation ? game.GLTF_Rotation.y : null;
            object.gltf_rotation_z = game.GLTF_Rotation ? game.GLTF_Rotation.z : null;
            object.gltf_rotation_w = game.GLTF_Rotation ? game.GLTF_Rotation.w : null;
            object.text_string = game.Text_string;
            object.text_color_r = game.Text_Color ? game.Text_Color.r : null;
            object.text_color_g = game.Text_Color ? game.Text_Color.g : null;
            object.text_color_b = game.Text_Color ? game.Text_Color.b : null;
            object.text_color_a = game.Text_Color ? game.Text_Color.a : null;
            object.text_width = game.Text_width;
            object.text_height = game.Text_height;
            object.text_size = game.Text_fontSize;
            object.audio_path = game.Audio_Path;
            object.audio_playing = game.playing;
            object.audio_loop = game.loop;
            object.audio_volume = game.volume;
            object.audio_pitch = game.pitch;
            await commonFunctions.insertSingleRowIgnore(APIRef, 'object', object, 'Insert object');
        }
        return responses.actionCompleteResponse(res, languageCode, {}, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (error) {
        console.log(error);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});


module.exports = routes;