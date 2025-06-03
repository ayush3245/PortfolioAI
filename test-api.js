const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/enhance-portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bio: 'I am a software developer',
        projects: [{
          title: 'Test Project',
          description: 'A simple test project',
          skillsUsed: ['JavaScript', 'Node.js']
        }],
        hobbies: 'reading, coding'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();
