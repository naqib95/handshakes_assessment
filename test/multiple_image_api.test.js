const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://assessement.onrender.com/api/zip';

describe('Multiple Image API', () => {

  test('Attaching a valid zip images returns permanent links', async () => {
    const imagePath = path.join(__dirname, '../assets', 'valid_zip.zip'); // 1png, 1jpg
    const imageBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'valid_zip.zip');

    try {
      const response = await axios.post(BASE_URL, formData);
      expect(response.status).toBe(200); // We are expecting the API to return status 200
      expect(response.data.images).toBeDefined(); // images json should exist in the return
    } catch (error) {
      console.log(error.response.data);
    }
  });

  test('Attaching a non-image file with valid image in zip should not return link', async () => {
    const imagePath = path.join(__dirname, '../assets', 'invalid_zip.zip'); // 1jpg, 1png, 1txt
    const imageBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'invalid_zip.zip');

    try {
      const response = await axios.post(BASE_URL, formData);
      expect(response.status).toBe(200); 
    } catch (error) {
      console.log(error.response.data);
    }
  });

  test('Attaching a non-image files only in zip should return an error', async () => {
    const imagePath = path.join(__dirname, '../assets', 'invalid_zip2.zip'); // 3txt
    const imageBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'invalid_zip2.zip');

    try {
      const response = await axios.post(BASE_URL, formData);
      expect(response.status).not.toBe(200); // We are expecting the API to not be 200
    } catch (error) {
      expect(error.response.status).not.toBe(200); // We are expecting the API to return status 500
      expect(error.response.data.err).toBeDefined(); // err json message should exist in the return
    }
  });

  test('Attaching a non-zip file should return an error', async () => {
    const imagePath = path.join(__dirname, '../assets', 'test.txt');
    const imageBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'test.txt');

    try {
      const response = await axios.post(BASE_URL, formData);
      expect(response.status).not.toBe(200); // If return status is 200, it will fail
    } catch (error) {
      expect(error.response.status).not.toBe(200); // We are expecting the API to return status 500
      expect(error.response.data.err).toBeDefined(); // err json message should exist in the return
    }
  });

});
