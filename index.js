import KcAdminClient from '@keycloak/keycloak-admin-client';

import config from './config.js';
import database from './database.js';


import express from 'express';

const app = express();
const port = 80;

// import { SimpleDateFormat } from '@riversun/simple-date-format';
// const SimpleDateFormat = require("@riversun/simple-date-format");
// const sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

import { gql } from 'graphql-request';

import Minio from 'minio';

const kcAdminClient = new KcAdminClient.default({
  baseUrl: config.keycloak.url,
  realmName: config.keycloak.realm,
});

const minioClient = new Minio.Client({
  endPoint: config.minio.url,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey
});


import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post("/bucket/create", async (req, res) => {
  try {
    const data = req.body;
    minioClient.makeBucket(data.schema + "-" + data.id, function (err) {
      if (err) return console.log('Error creating bucket.', err)
    })
    res.send("OK");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.post("/bucket/delete", async (req, res) => {
  try {
    const data = req.body;
    var allegati = []
    var stream = minioClient.listObjects(data.schema + '-' + data.id, '', true)
    stream.on('data', function (obj) { allegati.push(obj) })
    stream.on("end", function (obj) {
      minioClient.removeObjects(data.schema + '-' + data.id, allegati, function (e) {
        if (e) return console.log('Unable to remove Objects ', e)
        console.log('Removed the objects successfully')

        minioClient.removeBucket(data.schema + '-' + data.id, function (err) {
          if (err) return console.log('unable to remove bucket.')
          console.log('Bucket removed successfully.')
        })
      })
    })
    stream.on('error', function (err) { console.log(err) })


    res.send("OK");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.post("/bucket/list", async (req, res) => {
  try {
    const data = req.body;
    var allegati = []
    var stream = minioClient.extensions.listObjectsV2WithMetadata(req.body.bucket, '', true, '')
    stream.on('data', function (obj) { allegati.push(obj) })
    stream.on("end", function (obj) { res.send({ allegati: allegati }) })
    stream.on('error', function (err) { res.send(err) })

  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.post("/file/get", async (req, res) => {
  let url = await new Promise((resolve, reject) => minioClient.presignedGetObject(req.body.bucket, req.body.name, 24 * 60 * 60, function (err, presignedUrl) {
    if (err) reject(err)
    resolve(presignedUrl)
  }));

  res.send({ url: url });
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
