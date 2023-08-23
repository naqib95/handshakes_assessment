const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://assessement.onrender.com/api/image';

describe('Single Image API', () => {

  test('Attaching a valid image returns a permanent link', async () => {
    const imagePath = path.join(__dirname, '../assets', 'test_image.jpg');
    const imageBuffer = fs.readFileSync(imagePath);

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'test_image.jpg');

    try {
      const response = await axios.post(BASE_URL, formData);
      expect(response.status).toBe(200); // We are expecting the API to return status 200
      expect(response.data.image).toBeDefined(); // image json should exist in the return
      expect(response.data.image).not.toBeNull(); // the returned image link should not be null 
    } catch (error) {
      console.log(error.response.data);
    }
  });

  test('Attaching a non-image file should return an error', async () => {
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
