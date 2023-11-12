import axios from 'axios';

// Define a function to fetch data from the API
async function fetchData() {
    try {
        const response = await axios.get('https://e34zimyozb.execute-api.us-east-1.amazonaws.com/Prod/ad')
        console.log(response.data);
    } catch (error) {
        console.error('Failed to fetch API data:', error);
    }
}

// Call the function
fetchData();
