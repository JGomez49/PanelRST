const {Router} = require('express');
const router = Router();

const { Controller, Tag, EthernetIP } = require("ethernet-ip");
const { DINT, BOOL } = EthernetIP.CIP.DataTypes.Types;

const moment = require('moment');
const path = require('path');
const {unlink} = require('fs-extra');
const Image = require('../models/Image');
const RegistroMercado = require('../models/RegistroMercado');

// const cloudinary = require('cloudinary');
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


router.get('/', async(req,res)=>{
    //const images = await Image.find();
    //console.log(images);

    const PLC = new Controller();
    let tag = 'blf_temp_rset'
        //MCP01: 'BLF_temp_rst'
    let ip = '10.239.216.77';
        //MCP01: '10.239.216.80';
        //MCP20: '10.239.216.77';
    const barTag = new Tag(tag);
    let status = true;
    PLC.connect(ip, 0).then(async() => { 
        await console.log(PLC.properties);
        await PLC.readTag(barTag);
        console.log('The value of ' + tag + ' is: ' + barTag.value);
        if (barTag.value == false){
            status = false
        };
        //await PLC.writeTag(barTag, status);
        //console.log('The new value of ' + tag + ' is: ' + barTag.value);
        res.render('index', {status});
    });
});


router.get('/mcp20reset/:status', async(req,res)=>{  
    const PLC = new Controller();
    let tag = 'blf_temp_rset'
        //MCP01: 'BLF_temp_rst'
    let ip = '10.239.216.77';
        //MCP01: '10.239.216.80';
        //MCP20: '10.239.216.77';
    const barTag = new Tag(tag);
    let status = req.params.status;
    PLC.connect(ip, 0).then(async() => {
        await console.log(PLC.properties);
        await PLC.readTag(barTag);
        console.log('The value of ' + tag + ' is: ' + barTag.value);
        if (barTag.value == true){
            status = false;
        } 
        if (barTag.value == false){
            status = true;
        } 
        await PLC.writeTag(barTag, status);
        console.log('The new value of ' + tag + ' is: ' + barTag.value);
    });
    res.redirect('/');
});


// router.get('/costco', async(req,res)=>{
//     const images = await Image.find();
//     res.render('costco', {images: images});
// });

// router.get('/superstore', async(req,res)=>{
//     const images = await Image.find();
//     res.render('superstore', {images: images});
// });

// router.get('/coop', async(req,res)=>{
//     const images = await Image.find();
//     res.render('coop', {images: images});
// });



// router.get('/upload', (req,res)=>{
//     res.render('upload.ejs');
// });



// router.post('/upload', async(req,res)=>{
//     const image = new Image();
//     //el req.body es lo que se recibe desde el formulario
//     console.log('Esto es el req de Image: ' + req);
//     const result = await cloudinary.v2.uploader.upload(req.file.path);
//         image.title = req.body.title;
//         image.description = req.body.description;
//         image.filename = req.file.filename;
//         //image.path = 'img/uploads/' + req.file.filename;
//         image.path = result.url;
//         image.public_id = result.public_id;
//         image.originalname = req.file.originalname;
//         image.mimetype = req.file.mimetype;
//         image.size = req.file.size;
//         image.portada = req.body.portada;
//         image.precio = req.body.precio;
//         image.adicionar = req.body.adicionar;
//         image.veces = req.body.veces;
//     //await unlink(path.resolve('./src/public/' + image.path));
//     await unlink(req.file.path);
//     await image.save();
//     //console.log(image);
//     res.redirect('/');
// });


// router.post('/history', async(req,res)=>{
//     const registroMercado = new RegistroMercado();
//     registroMercado.valor = req.body.valor;
//     registroMercado.fecha = moment().format('LL'); 
//     registroMercado.hora = moment().format('LTS');
//     registroMercado.mesa = req.body.mesa;
//     await registroMercado.save();
//     res.redirect('/clear');
// });



// router.get('/history', async(req,res)=>{
//     const registrosMercado = await RegistroMercado.find();
//     console.log(registrosMercado);
//     res.render('history', {registrosMercado});
// });



// router.get('/image/:id', async(req,res)=>{
//     const {id} = req.params;
//     console.log('El id de la foto es: ' + id);
//     const image = await Image.findById(id);
//     const images = await Image.find();
//     console.log('Esto es image: ' + image);
//     // res.render('profile', {image: image});
//     if (image.description == 'Almuerzos'){
//         res.render('almuerzos', {image: image,images: images});
//     }else{
//         res.render('profile', {image: image});
//     }
// });


// router.get('/image/:id/delete', async(req,res)=>{
//     console.log(req.params.id);
//     const {id} = req.params;
//     const image = await Image.findByIdAndDelete(id);
//     await cloudinary.v2.uploader.destroy(image.public_id);
//     res.redirect('/');
// });


// router.get('/registro/:id/delete', async(req,res)=>{
//     //console.log(req.params.id);
//     const {id} = req.params;
//     const registroMercado = await RegistroMercado.findByIdAndDelete(id);
//     res.redirect('/history');
// });


// router.get('/image/:id/add', async(req,res)=>{
//     //console.log(req.params.id);
//     const {id} = req.params;
//     const image = await Image.findById(id);
//     let veces = image.veces;
//     veces = veces + 1;
//     //console.log("veces: "+veces);
//     await Image.findByIdAndUpdate(id, { adicionar: "ON", veces });
//     //console.log(image);
//     res.redirect('/');
// });


// router.get('/image/:id/remove', async(req,res)=>{
//     //console.log(req.params.id);
//     const {id} = req.params;
//     const image = await Image.findById(id);
//     let veces = image.veces;
//     veces = veces - 1;
//     //console.log("veces: "+veces);
//     await Image.findByIdAndUpdate(id, { adicionar: "OFF", veces});
//     //console.log(image);
//     res.redirect('/');
// });

// router.get('/clear', async(req,res)=>{
//     const images = await Image.find();
//     images.forEach(imagen => {
//         clearOrden(Image, imagen);
//     });
//     res.redirect('/');
// });
// async function clearOrden(Image,imagen){
//     await Image.findByIdAndUpdate(imagen.id, { veces: 0 });
// };





module.exports = router;