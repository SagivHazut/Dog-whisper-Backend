const TheDogApi = 'https://api.thedogapi.com/v1'
const DogData = require('../models/DogData')

//generate image and save them in the data base
const HomepageDogImages = async () => {
  let data // Declare data outside the try block

  try {
    const existingData = await DogData.findOne({ apiName: 'homepageDogImages' })

    if (existingData) {
      console.log(
        'Data already exists in MongoDB. Skipping fetching and saving.'
      )
      return existingData.data
    } else {
      const apiKey =
        'live_168MuBcb3aCj7oD0YUmCUW18Ei73na7wktDxaOxY0GxkB50pUAt7Vax1FTXIZ4ks'
      const url = `${TheDogApi}/images/search?limit=9&mime_types=jpg,png&order=Random&size=small&page=3&sub_id=demo-ff5c9`

      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      data = await response.json()
      await DogData.create({ apiName: 'homepageDogImages', data })
      console.log('Data saved to MongoDB')
    }

    return data
  } catch (error) {
    console.error('Error fetching and saving dog images:', error)
    throw error
  }
}
//generate a random fact about dogs
const fetchDogsBreeds = async () => {
  let data

  try {
    const existingData = await DogData.findOne({ apiName: 'dogsBreeds' })

    if (existingData) {
      console.log(
        'Data already exists in MongoDB. Skipping fetching and saving.'
      )
      return existingData.data
    } else {
      const apiKey =
        'live_168MuBcb3aCj7oD0YUmCUW18Ei73na7wktDxaOxY0GxkB50pUAt7Vax1FTXIZ4ks'
      const url = `${TheDogApi}/breeds`

      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      data = await response.json()
      await DogData.create({ apiName: 'dogsBreeds', data })
      console.log('Data saved to MongoDB')
      return data
    }
  } catch (error) {
    console.error('Error fetching and saving dog breeds:', error)
    throw error
  }
}

module.exports = {
  HomepageDogImages,
  fetchDogsBreeds,
}
