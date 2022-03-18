const upload = require('../middleware/fileFunction.js')('user');
const objectValidator = require("../validator/object.js");
const APIRef = 'User Auth';
const constants = require("../util/constants");
const responses = require("../util/responses");
const geoIP = require('geoip-lite');

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


module.exports = routes;